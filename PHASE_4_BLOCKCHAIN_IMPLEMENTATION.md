# Phase 4: Blockchain Foundation Implementation Guide

## 🔗 BLOCKCHAIN LAYER - DETAILED IMPLEMENTATION

**Duration**: Weeks 7-12 (6 weeks)  
**Team**: 1 Blockchain Dev + 1 Backend Dev + 1 QA Engineer  
**Deliverables**: Smart contracts, blockchain service, wallet integration

---

## 📋 WEEK 7-8: SMART CONTRACTS DEVELOPMENT

### Smart Contract Suite (Solidity)

#### 1. DonationEscrow.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DonationEscrow is Ownable, ReentrancyGuard {
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 campaignId;
        uint256 timestamp;
        string status; // pending, confirmed, disputed
        string ipfsReceiptHash;
    }
    
    mapping(uint256 => Donation) public donations;
    mapping(address => uint256[]) public donorDonations;
    uint256 public donationCounter;
    
    event DonationRecorded(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        uint256 campaignId
    );
    
    event FundsReleased(
        uint256 indexed donationId,
        address indexed recipient,
        uint256 amount
    );
    
    function recordDonation(
        uint256 _campaignId,
        string memory _receiptHash
    ) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be > 0");
        
        uint256 donationId = donationCounter++;
        
        donations[donationId] = Donation({
            donor: msg.sender,
            amount: msg.value,
            campaignId: _campaignId,
            timestamp: block.timestamp,
            status: "confirmed",
            ipfsReceiptHash: _receiptHash
        });
        
        donorDonations[msg.sender].push(donationId);
        
        emit DonationRecorded(donationId, msg.sender, msg.value, _campaignId);
    }
    
    function releaseFunds(
        uint256 _donationId,
        address payable _recipient
    ) external onlyOwner nonReentrant {
        Donation storage donation = donations[_donationId];
        require(
            keccak256(bytes(donation.status)) == keccak256(bytes("confirmed")),
            "Donation not confirmed"
        );
        
        donation.status = "released";
        _recipient.transfer(donation.amount);
        
        emit FundsReleased(_donationId, _recipient, donation.amount);
    }
    
    function getDonorHistory(address _donor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return donorDonations[_donor];
    }
    
    function getDonationDetails(uint256 _donationId)
        external
        view
        returns (Donation memory)
    {
        return donations[_donationId];
    }
}
```

#### 2. ImpactOracle.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImpactOracle is Ownable {
    
    struct ImpactAttestation {
        uint256 campaignId;
        string metricType; // species_count, area_protected, etc.
        uint256 value;
        uint256 timestamp;
        address verifier;
        uint256 confidenceScore; // 0-100
    }
    
    mapping(uint256 => ImpactAttestation[]) public campaignImpact;
    uint256 public attestationCounter;
    
    event ImpactAttested(
        uint256 indexed campaignId,
        string metricType,
        uint256 value,
        address indexed verifier
    );
    
    function attestImpact(
        uint256 _campaignId,
        string memory _metricType,
        uint256 _value,
        uint256 _confidenceScore
    ) external onlyOwner {
        require(_confidenceScore <= 100, "Confidence must be 0-100");
        
        ImpactAttestation memory attestation = ImpactAttestation({
            campaignId: _campaignId,
            metricType: _metricType,
            value: _value,
            timestamp: block.timestamp,
            verifier: msg.sender,
            confidenceScore: _confidenceScore
        });
        
        campaignImpact[_campaignId].push(attestation);
        attestationCounter++;
        
        emit ImpactAttested(_campaignId, _metricType, _value, msg.sender);
    }
    
    function getCampaignImpact(uint256 _campaignId)
        external
        view
        returns (ImpactAttestation[] memory)
    {
        return campaignImpact[_campaignId];
    }
}
```

#### 3. ReputationToken.sol (ERC-721 Soulbound)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationToken is ERC721, Ownable {
    
    struct Badge {
        string badgeType; // NOVICE, EXPLORER, NATURALIST, EXPERT
        uint256 mintedAt;
        uint256 donationCount;
        uint256 speciesCount;
    }
    
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    uint256 public tokenCounter;
    
    event BadgeMinted(
        address indexed user,
        uint256 indexed tokenId,
        string badgeType
    );
    
    constructor() ERC721("ParkWise Reputation", "PWREP") {}
    
    function mintBadge(
        address _user,
        string memory _badgeType,
        uint256 _donationCount,
        uint256 _speciesCount
    ) external onlyOwner {
        uint256 tokenId = tokenCounter++;
        
        badges[tokenId] = Badge({
            badgeType: _badgeType,
            mintedAt: block.timestamp,
            donationCount: _donationCount,
            speciesCount: _speciesCount
        });
        
        _safeMint(_user, tokenId);
        userBadges[_user].push(tokenId);
        
        emit BadgeMinted(_user, tokenId, _badgeType);
    }
    
    // Soulbound: Prevent transfers
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(from == address(0), "Soulbound: Cannot transfer");
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function getUserBadges(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userBadges[_user];
    }
}
```

---

## 📝 BACKEND SERVICE LAYER (Spring Boot)

### BlockchainService.java

```java
package com.parkwise.blockchain.service;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BlockchainService {
    
    @Value("${blockchain.rpc-url}")
    private String rpcUrl;
    
    @Value("${blockchain.contract-address}")
    private String contractAddress;
    
    @Value("${blockchain.private-key}")
    private String privateKey;
    
    private Web3j web3j;
    
    /**
     * Initialize Web3j connection
     */
    public void initialize() {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        log.info("Blockchain service initialized: {}", rpcUrl);
    }
    
    /**
     * Record donation on blockchain
     */
    public String recordDonation(
        Long donationId,
        String donorAddress,
        BigDecimal amount,
        Long campaignId,
        String receiptHash
    ) throws Exception {
        log.info("Recording donation {} on blockchain", donationId);
        
        // Load contract
        DonationEscrow contract = DonationEscrow.load(
            contractAddress,
            web3j,
            getCredentials(),
            new DefaultGasProvider()
        );
        
        // Record donation
        TransactionReceipt receipt = contract.recordDonation(
            campaignId,
            receiptHash
        ).send();
        
        String txHash = receipt.getTransactionHash();
        log.info("Donation recorded: {}", txHash);
        
        return txHash;
    }
    
    /**
     * Attest impact on blockchain
     */
    public String attestImpact(
        Long campaignId,
        String metricType,
        BigInteger value,
        Integer confidenceScore
    ) throws Exception {
        log.info("Attesting impact for campaign {}", campaignId);
        
        ImpactOracle contract = ImpactOracle.load(
            contractAddress,
            web3j,
            getCredentials(),
            new DefaultGasProvider()
        );
        
        TransactionReceipt receipt = contract.attestImpact(
            campaignId,
            metricType,
            value,
            BigInteger.valueOf(confidenceScore)
        ).send();
        
        return receipt.getTransactionHash();
    }
    
    /**
     * Mint reputation badge
     */
    public String mintBadge(
        String userAddress,
        String badgeType,
        Integer donationCount,
        Integer speciesCount
    ) throws Exception {
        log.info("Minting badge for user: {}", userAddress);
        
        ReputationToken contract = ReputationToken.load(
            contractAddress,
            web3j,
            getCredentials(),
            new DefaultGasProvider()
        );
        
        TransactionReceipt receipt = contract.mintBadge(
            userAddress,
            badgeType,
            BigInteger.valueOf(donationCount),
            BigInteger.valueOf(speciesCount)
        ).send();
        
        return receipt.getTransactionHash();
    }
    
    /**
     * Query donation history
     */
    public List<String> getDonorHistory(String donorAddress) throws Exception {
        DonationEscrow contract = DonationEscrow.load(
            contractAddress,
            web3j,
            getCredentials(),
            new DefaultGasProvider()
        );
        
        return contract.getDonorHistory(donorAddress).send();
    }
    
    /**
     * Get credentials from private key
     */
    private Credentials getCredentials() {
        return Credentials.create(privateKey);
    }
}
```

### TransactionService.java

```java
package com.parkwise.blockchain.service;

import com.parkwise.blockchain.entity.OnchainTransaction;
import com.parkwise.blockchain.repository.OnchainTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionService {
    
    private final OnchainTransactionRepository transactionRepository;
    private final BlockchainService blockchainService;
    
    /**
     * Record donation transaction
     */
    public OnchainTransaction recordDonationTransaction(
        Long userId,
        String txHash,
        BigDecimal amount,
        String status
    ) {
        log.info("Recording transaction: {}", txHash);
        
        OnchainTransaction transaction = OnchainTransaction.builder()
            .userId(userId)
            .txHash(txHash)
            .amount(amount)
            .status(status)
            .transactionType("DONATION")
            .build();
        
        return transactionRepository.save(transaction);
    }
    
    /**
     * Verify transaction on blockchain
     */
    public boolean verifyTransaction(String txHash) throws Exception {
        log.info("Verifying transaction: {}", txHash);
        
        // Query blockchain for transaction
        Optional<TransactionReceipt> receipt = 
            blockchainService.getTransactionReceipt(txHash);
        
        return receipt.isPresent() && receipt.get().isStatusOK();
    }
    
    /**
     * Get transaction history
     */
    public List<OnchainTransaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}
```

---

## 🎨 FRONTEND INTEGRATION

### DonationWithBlockchain.jsx

```jsx
import React, { useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

export const DonationWithBlockchain = ({ userId, campaignId }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [receipt, setReceipt] = useState(null)

  const handleDonate = async () => {
    try {
      setLoading(true)

      // 1. Connect wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()

      // 2. Create donation on backend
      const donationResponse = await axios.post('/api/v2/donations/crypto', {
        userId,
        campaignId,
        amount: ethers.utils.parseEther(amount),
        walletAddress: userAddress
      })

      const donationId = donationResponse.data.donationId

      // 3. Send transaction
      const contract = new ethers.Contract(
        process.env.REACT_APP_ESCROW_ADDRESS,
        ESCROW_ABI,
        signer
      )

      const tx = await contract.recordDonation(
        campaignId,
        donationId
      )

      const receipt = await tx.wait()
      setTxHash(receipt.transactionHash)

      // 4. Verify on backend
      await axios.post('/api/v2/donations/verify', {
        donationId,
        txHash: receipt.transactionHash
      })

      setReceipt(receipt)
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Donate with Blockchain</h2>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (ETH)"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Donate'}
      </button>
      
      {txHash && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <p className="text-green-700">✓ Transaction confirmed!</p>
          <p className="text-sm text-gray-600 mt-2">
            TX: {txHash.substring(0, 10)}...
          </p>
          <a
            href={`https://polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View on PolygonScan
          </a>
        </div>
      )}
    </div>
  )
}
```

---

## 🧪 TESTING STRATEGY

### Smart Contract Tests (Hardhat)

```javascript
// test/DonationEscrow.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationEscrow", function () {
  let donationEscrow;
  let owner, donor, recipient;

  beforeEach(async function () {
    [owner, donor, recipient] = await ethers.getSigners();
    const DonationEscrow = await ethers.getContractFactory("DonationEscrow");
    donationEscrow = await DonationEscrow.deploy();
  });

  it("Should record donation", async function () {
    const amount = ethers.utils.parseEther("1.0");
    
    await expect(
      donationEscrow.connect(donor).recordDonation(
        1, // campaignId
        "QmHash123", // receiptHash
        { value: amount }
      )
    ).to.emit(donationEscrow, "DonationRecorded");
  });

  it("Should release funds", async function () {
    const amount = ethers.utils.parseEther("1.0");
    
    await donationEscrow.connect(donor).recordDonation(
      1,
      "QmHash123",
      { value: amount }
    );
    
    await expect(
      donationEscrow.releaseFunds(0, recipient.address)
    ).to.emit(donationEscrow, "FundsReleased");
  });
});
```

---

## 📊 DEPLOYMENT CHECKLIST

### Week 7-8: Development
- [ ] Write smart contracts
- [ ] Unit test contracts
- [ ] Deploy to testnet (Polygon Mumbai)
- [ ] Create backend service layer

### Week 9-10: Integration
- [ ] Integrate with Spring Boot
- [ ] Create REST endpoints
- [ ] Build frontend components
- [ ] Integration testing

### Week 11-12: Testing & Deployment
- [ ] Security audit
- [ ] Load testing
- [ ] Deploy to mainnet (Polygon PoS)
- [ ] Production monitoring

---

## 🚀 DEPLOYMENT CONFIGURATION

### application.properties

```properties
# Blockchain Configuration
blockchain.rpc-url=https://polygon-rpc.com
blockchain.contract-address=0x...
blockchain.private-key=${BLOCKCHAIN_PRIVATE_KEY}
blockchain.network=polygon-mainnet
blockchain.gas-price=50

# IPFS Configuration
ipfs.gateway=https://gateway.pinata.cloud
ipfs.api-url=https://api.pinata.cloud

# Wallet Configuration
wallet.supported-networks=polygon,ethereum
wallet.chain-id=137
```

---

## 📈 SUCCESS METRICS (Phase 4)

- ✅ All smart contracts deployed
- ✅ 100+ test cases passing
- ✅ < 100ms blockchain response time
- ✅ Zero security vulnerabilities
- ✅ Full integration with backend
- ✅ Production-ready documentation

---

**Status**: 🚀 **PHASE 4 READY FOR EXECUTION**  
**Duration**: 6 weeks  
**Team**: 3 engineers  
**Next**: Phase 5 - Geospatial Intelligence  

---

**Last Updated**: October 21, 2025  
**Version**: 1.0
