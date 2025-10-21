"""
Blockchain Event Synchronization Service
Syncs on-chain donations to PostgreSQL database
"""

from web3 import Web3
from web3.middleware import geth_poa_middleware
import psycopg2
from psycopg2.extras import execute_values
import json
import os
import time
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BlockchainSyncService:
    """Synchronize blockchain events to PostgreSQL"""
    
    def __init__(self):
        # Web3 connection
        self.web3_provider = os.getenv("WEB3_PROVIDER", "ws://localhost:8545")
        self.w3 = Web3(Web3.WebsocketProvider(self.web3_provider))
        
        # For POA chains like Polygon/BSC
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Contract details
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        self.contract_abi = self._load_contract_abi()
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=self.contract_abi
        )
        
        # Database connection
        self.db_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/parkwise")
        
        # Sync state
        self.last_synced_block = self._get_last_synced_block()
    
    def _load_contract_abi(self):
        """Load contract ABI from file"""
        abi_path = os.path.join(os.path.dirname(__file__), '../blockchain/abi/ParkWiseDonations.json')
        with open(abi_path, 'r') as f:
            return json.load(f)['abi']
    
    def _get_db_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.db_url)
    
    def _get_last_synced_block(self):
        """Get last synced block from database"""
        try:
            conn = self._get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                SELECT COALESCE(MAX(block_number), 0) 
                FROM blockchain_sync_state 
                WHERE contract_address = %s
            """, (self.contract_address,))
            
            last_block = cur.fetchone()[0]
            cur.close()
            conn.close()
            
            return last_block
        except Exception as e:
            logger.warning(f"Could not fetch last synced block: {e}")
            return 0
    
    def _update_sync_state(self, block_number: int):
        """Update last synced block"""
        try:
            conn = self._get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO blockchain_sync_state (contract_address, block_number, synced_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (contract_address) 
                DO UPDATE SET block_number = EXCLUDED.block_number, synced_at = NOW()
            """, (self.contract_address, block_number))
            
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            logger.error(f"Failed to update sync state: {e}")
    
    def sync_donation_event(self, event):
        """Sync DonationRecorded event to database"""
        try:
            conn = self._get_db_connection()
            cur = conn.cursor()
            
            # Extract event data
            project_id = event['args']['projectId']
            donor_address = event['args']['donor']
            amount = self.w3.from_wei(event['args']['amount'], 'ether')
            timestamp = event['args']['timestamp']
            tx_hash = event['transactionHash'].hex()
            block_number = event['blockNumber']
            is_anonymous = event['args']['isAnonymous']
            
            # Insert into database
            cur.execute("""
                INSERT INTO blockchain_transactions (
                    transaction_hash,
                    campaign_id,
                    user_id,
                    amount,
                    status,
                    block_number,
                    is_anonymous,
                    created_at
                ) VALUES (
                    %s,
                    (SELECT id FROM geo_projects WHERE id = %s),
                    (SELECT id FROM users WHERE wallet_address = %s),
                    %s,
                    'CONFIRMED',
                    %s,
                    %s,
                    to_timestamp(%s)
                )
                ON CONFLICT (transaction_hash) DO NOTHING
            """, (
                tx_hash,
                project_id,
                donor_address.lower(),
                amount,
                block_number,
                is_anonymous,
                timestamp
            ))
            
            conn.commit()
            cur.close()
            conn.close()
            
            logger.info(f"✅ Synced donation: {tx_hash} | Amount: {amount} ETH | Project: {project_id}")
            
        except Exception as e:
            logger.error(f"Failed to sync donation event: {e}")
    
    def sync_fund_release_event(self, event):
        """Sync FundsReleased event to database"""
        try:
            conn = self._get_db_connection()
            cur = conn.cursor()
            
            # Extract event data
            project_id = event['args']['projectId']
            amount = self.w3.from_wei(event['args']['amount'], 'ether')
            verifier = event['args']['verifier']
            reputation_score = event['args']['newReputationScore']
            tx_hash = event['transactionHash'].hex()
            block_number = event['blockNumber']
            
            # Insert fund release record
            cur.execute("""
                INSERT INTO fund_releases (
                    project_id,
                    amount,
                    verifier_address,
                    transaction_hash,
                    block_number,
                    released_at
                ) VALUES (%s, %s, %s, %s, %s, NOW())
            """, (project_id, amount, verifier.lower(), tx_hash, block_number))
            
            # Update NGO reputation
            cur.execute("""
                UPDATE ngo_reputation 
                SET score = %s, last_updated = NOW()
                WHERE address = %s
            """, (reputation_score, verifier.lower()))
            
            conn.commit()
            cur.close()
            conn.close()
            
            logger.info(f"✅ Synced fund release: {tx_hash} | Amount: {amount} ETH | Project: {project_id}")
            
        except Exception as e:
            logger.error(f"Failed to sync fund release event: {e}")
    
    def sync_impact_verification_event(self, event):
        """Sync ImpactVerified event to database"""
        try:
            conn = self._get_db_connection()
            cur = conn.cursor()
            
            # Extract event data
            project_id = event['args']['projectId']
            verifier = event['args']['verifier']
            impact_score = event['args']['impactScore']
            evidence_hash = event['args']['evidenceHash']
            tx_hash = event['transactionHash'].hex()
            
            # Insert impact verification
            cur.execute("""
                INSERT INTO impact_reports (
                    project_id,
                    reporter_address,
                    impact_score,
                    evidence_url,
                    verification_status,
                    transaction_hash,
                    created_at
                ) VALUES (%s, %s, %s, %s, true, %s, NOW())
            """, (project_id, verifier.lower(), impact_score, evidence_hash, tx_hash))
            
            conn.commit()
            cur.close()
            conn.close()
            
            logger.info(f"✅ Synced impact verification: {tx_hash} | Score: {impact_score} | Project: {project_id}")
            
        except Exception as e:
            logger.error(f"Failed to sync impact verification: {e}")
    
    def sync_historical_events(self, from_block: int = None, to_block: int = None):
        """Sync historical events in batches"""
        if from_block is None:
            from_block = self.last_synced_block + 1
        
        if to_block is None:
            to_block = self.w3.eth.block_number
        
        logger.info(f"🔄 Syncing blocks {from_block} to {to_block}")
        
        # Sync in batches of 1000 blocks
        batch_size = 1000
        
        for start in range(from_block, to_block + 1, batch_size):
            end = min(start + batch_size - 1, to_block)
            
            try:
                # Get DonationRecorded events
                donation_filter = self.contract.events.DonationRecorded.create_filter(
                    fromBlock=start,
                    toBlock=end
                )
                donation_events = donation_filter.get_all_entries()
                
                for event in donation_events:
                    self.sync_donation_event(event)
                
                # Get FundsReleased events
                release_filter = self.contract.events.FundsReleased.create_filter(
                    fromBlock=start,
                    toBlock=end
                )
                release_events = release_filter.get_all_entries()
                
                for event in release_events:
                    self.sync_fund_release_event(event)
                
                # Get ImpactVerified events
                impact_filter = self.contract.events.ImpactVerified.create_filter(
                    fromBlock=start,
                    toBlock=end
                )
                impact_events = impact_filter.get_all_entries()
                
                for event in impact_events:
                    self.sync_impact_verification_event(event)
                
                # Update sync state
                self._update_sync_state(end)
                
                logger.info(f"✅ Synced blocks {start} - {end} | Donations: {len(donation_events)} | Releases: {len(release_events)} | Impacts: {len(impact_events)}")
                
            except Exception as e:
                logger.error(f"Failed to sync blocks {start}-{end}: {e}")
                time.sleep(5)  # Wait before retrying
    
    def listen_for_new_events(self):
        """Listen for new events in real-time"""
        logger.info("👂 Listening for new blockchain events...")
        
        # Create event filters
        donation_filter = self.contract.events.DonationRecorded.create_filter(fromBlock='latest')
        release_filter = self.contract.events.FundsReleased.create_filter(fromBlock='latest')
        impact_filter = self.contract.events.ImpactVerified.create_filter(fromBlock='latest')
        
        while True:
            try:
                # Check for new donation events
                for event in donation_filter.get_new_entries():
                    self.sync_donation_event(event)
                
                # Check for fund release events
                for event in release_filter.get_new_entries():
                    self.sync_fund_release_event(event)
                
                # Check for impact verification events
                for event in impact_filter.get_new_entries():
                    self.sync_impact_verification_event(event)
                
                time.sleep(2)  # Poll every 2 seconds
                
            except Exception as e:
                logger.error(f"Error listening for events: {e}")
                time.sleep(5)
    
    def run(self):
        """Run sync service"""
        logger.info("🚀 Starting Blockchain Sync Service")
        
        # First sync historical events
        self.sync_historical_events()
        
        # Then listen for new events
        self.listen_for_new_events()

def main():
    """Main entry point"""
    sync_service = BlockchainSyncService()
    sync_service.run()

if __name__ == "__main__":
    main()
