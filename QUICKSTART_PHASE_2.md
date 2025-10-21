# 🚀 ParkWise Phase 2 Quick Start Guide

## Prerequisites Checklist

Before starting, ensure you have:

- [x] Node.js 18+ and npm
- [x] Python 3.10+
- [x] PostgreSQL 14+ with PostGIS extension
- [x] Git
- [x] MetaMask wallet (for testing)
- [x] Alchemy/Infura account (for RPC endpoints)

---

## 🏁 Quick Start (Local Development)

### Step 1: Clone and Setup

```bash
# If not already cloned
git clone https://github.com/Ashmit-Singh/parkwise.git
cd parkwise

# Copy environment template
cp .env.example .env
```

### Step 2: Configure Environment

Edit `.env` with your values:

```bash
# Minimal configuration for local testing
DATABASE_URL=postgresql://postgres:password@localhost:5432/parkwise
WEB3_PROVIDER=ws://localhost:8545  # Local Hardhat node
AI_SERVICE_URL=http://localhost:8001
```

### Step 3: Install Dependencies

**Backend (Java)**:
```bash
cd backend
mvn clean install -DskipTests
```

**Frontend (React)**:
```bash
cd frontend
npm install
```

**Blockchain (Hardhat)**:
```bash
cd blockchain
npm install
```

**AI Pipeline (Python)**:
```bash
cd analytics
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Step 4: Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE parkwise;"

# Enable PostGIS
psql -U postgres -d parkwise -c "CREATE EXTENSION postgis;"

# Run migrations
psql -U postgres -d parkwise -f database/parkwise_schema.sql
psql -U postgres -d parkwise -f database/migrations/001_create_experiment_tables.sql
psql -U postgres -d parkwise -f database/migrations/002_create_species_identification_tables.sql
psql -U postgres -d parkwise -f database/migrations/003_create_blockchain_sync_tables.sql
```

### Step 5: Start Local Blockchain

```bash
cd blockchain

# Start local Hardhat node (Terminal 1)
npx hardhat node

# This will give you 20 test accounts with 10,000 ETH each
# Copy the first private key for deployment
```

### Step 6: Deploy Smart Contracts

```bash
# In new terminal (Terminal 2)
cd blockchain

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Note the contract addresses from output
# Copy CONTRACT_ADDRESS to your .env file
```

### Step 7: Start Backend Services

**Java Backend** (Terminal 3):
```bash
cd backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

**AI Pipeline** (Terminal 4):
```bash
cd analytics
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn ai_pipeline:app --host 0.0.0.0 --port 8001 --reload
# AI service runs on http://localhost:8001
```

**Blockchain Sync Service** (Terminal 5):
```bash
cd analytics
source venv/bin/activate  # Windows: venv\Scripts\activate
python blockchain_sync_service.py
# Sync service starts listening for blockchain events
```

### Step 8: Start Frontend

**React App** (Terminal 6):
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 9: Verify Everything Works

**Check Backend**:
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

**Check AI Pipeline**:
```bash
curl http://localhost:8001/
# Should return: {"service":"ParkWise AI Pipeline","status":"operational"}
```

**Check Frontend**:
- Open http://localhost:5173
- Connect MetaMask (localhost:8545, Chain ID: 1337)
- Import one of the Hardhat test accounts

---

## 🌍 Testnet Deployment (Polygon Mumbai)

### Step 1: Get Mumbai MATIC

1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select Mumbai network
3. Enter your wallet address
4. Receive 0.1 MATIC for gas

### Step 2: Configure for Mumbai

Update `.env`:
```bash
# Mumbai testnet
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here  # NEVER commit this!
WEB3_PROVIDER=wss://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```

### Step 3: Deploy to Mumbai

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network mumbai

# Wait for confirmation (~5 seconds)
# Note the contract addresses
```

### Step 4: Verify Contracts

```bash
# Get your Polygonscan API key from https://polygonscan.com/apis

npx hardhat verify --network mumbai <PARKWISE_CONTRACT_ADDRESS>
npx hardhat verify --network mumbai <ECOTOKEN_CONTRACT_ADDRESS>
```

### Step 5: Update Backend Configuration

Update `backend/application.properties`:
```properties
blockchain.contract.address=<PARKWISE_CONTRACT_ADDRESS>
blockchain.network=mumbai
blockchain.rpc.url=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```

### Step 6: Start Services

Same as local deployment (Steps 7-8), but services will connect to Mumbai testnet.

---

## 📊 Testing the Integration

### Test 1: Make a Donation

1. **Frontend**:
   - Navigate to Donate page
   - Connect MetaMask
   - Select a project
   - Enter donation amount (e.g., 0.01 MATIC)
   - Click "Donate with Blockchain"

2. **Expected Flow**:
   - MetaMask popup for transaction approval
   - Transaction submitted to blockchain
   - Sync service picks up DonationRecorded event
   - Record inserted into `blockchain_transactions` table
   - Dashboard updates with new donation

3. **Verify**:
```bash
# Check transaction in database
psql -U postgres -d parkwise -c "SELECT * FROM blockchain_transactions ORDER BY created_at DESC LIMIT 1;"

# Check sync service logs
# Should see: "✅ Synced donation: 0x... | Amount: 0.01 ETH | Project: 0"
```

### Test 2: AI Donor Segmentation

1. **API Call**:
```bash
curl -X POST http://localhost:8001/ai/predictive-segmentation \
  -H "Content-Type: application/json" \
  -d '{"lookback_days": 30, "min_donations": 1}'
```

2. **Expected Response**:
```json
{
  "timestamp": "2025-10-22T...",
  "total_donors": 15,
  "segments": [
    {"segment": "CHAMPION", "count": 3, "total_value": 150.5},
    {"segment": "LOYAL", "count": 5, "total_value": 80.2},
    ...
  ]
}
```

### Test 3: Geo-Impact Scoring

1. **API Call**:
```bash
curl -X POST http://localhost:8001/ai/geo-impact-score \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "latitude": -3.4653,
    "longitude": -62.2159,
    "area_hectares": 1000,
    "species_count": 250,
    "has_sensors": true
  }'
```

2. **Expected Response**:
```json
{
  "project_id": 1,
  "impact_analysis": {
    "base_impact_score": 78.5,
    "proximity_bonus": 10.0,
    "final_impact_score": 88.5,
    "classification": "CRITICAL_HIGH_IMPACT"
  }
}
```

### Test 4: Fund Release (NGO)

1. **Backend API**:
```bash
# As NGO owner, release funds
curl -X POST http://localhost:8080/api/blockchain/release-funds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "projectId": 0,
    "amount": 5.0,
    "verifierId": "0x..."
  }'
```

2. **Expected**:
   - Smart contract checks impact score
   - If score >= 60, funds released (dynamically adjusted)
   - FundsReleased event emitted
   - Sync service updates `fund_releases` table
   - NGO reputation incremented

---

## 🐛 Troubleshooting

### Issue: "Connection refused" to database

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
# Or check Windows Services

# Restart if needed
sudo systemctl start postgresql
```

### Issue: "Module not found" in AI pipeline

**Solution**:
```bash
cd analytics
pip install -r requirements.txt

# If still issues
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Issue: "Transaction underpriced" on testnet

**Solution**:
- Increase gas price in `hardhat.config.js`:
```javascript
mumbai: {
  gasPrice: 50000000000,  // Increase this
}
```

### Issue: Sync service not picking up events

**Solution**:
1. Check contract address in `.env` is correct
2. Verify WebSocket connection:
```python
from web3 import Web3
w3 = Web3(Web3.WebsocketProvider('ws://localhost:8545'))
print(w3.is_connected())  # Should be True
```
3. Check sync_service_health table:
```sql
SELECT * FROM sync_service_health;
```

### Issue: AI models not training

**Solution**:
- Ensure you have donation data in database:
```sql
SELECT COUNT(*) FROM blockchain_transactions;
-- Should be > 0
```
- If no data, seed test data:
```bash
cd backend
mvn test -Dtest=DataSeederTest
```

---

## 📚 API Documentation

### Backend (Java) - Port 8080

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### AI Pipeline (Python) - Port 8001

- **Interactive Docs**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

---

## 🔐 Security Notes

**Never commit**:
- `.env` files with real credentials
- Private keys
- Database passwords
- API keys

**Use** `.env.example` as template:
```bash
# Good
git add .env.example

# Bad - Don't do this!
git add .env
```

**For production**:
- Use environment variables from hosting provider
- Enable SSL/TLS for all connections
- Use hardware wallets for contract deployment
- Implement rate limiting on APIs

---

## 📞 Support

**Issues**: https://github.com/Ashmit-Singh/parkwise/issues
**Documentation**: https://github.com/Ashmit-Singh/parkwise/wiki
**Email**: support@parkwise.org

---

## ✅ Checklist for Production

Before deploying to production:

- [ ] Security audit of smart contracts
- [ ] Load testing (1000+ concurrent users)
- [ ] Database backup strategy
- [ ] Monitoring and alerting setup
- [ ] SSL certificates for all domains
- [ ] CDN for frontend assets
- [ ] Error tracking (Sentry)
- [ ] API rate limiting
- [ ] DDoS protection
- [ ] Privacy policy and terms of service
- [ ] GDPR compliance audit
- [ ] Disaster recovery plan

---

*Last Updated: October 22, 2025*  
*Version: 2.0*
