// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * DonationEscrow - Records and manages conservation donations on blockchain
 * Provides transparent, verifiable donation receipts
 */
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
    uint256 public totalDonated;
    
    event DonationRecorded(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        uint256 campaignId,
        uint256 timestamp
    );
    
    event FundsReleased(
        uint256 indexed donationId,
        address indexed recipient,
        uint256 amount
    );
    
    event DonationDisputed(
        uint256 indexed donationId,
        string reason
    );
    
    /**
     * Record a new donation
     */
    function recordDonation(
        uint256 _campaignId,
        string memory _receiptHash
    ) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be > 0");
        require(bytes(_receiptHash).length > 0, "Receipt hash required");
        
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
        totalDonated += msg.value;
        
        emit DonationRecorded(
            donationId,
            msg.sender,
            msg.value,
            _campaignId,
            block.timestamp
        );
    }
    
    /**
     * Release funds to recipient (only owner)
     */
    function releaseFunds(
        uint256 _donationId,
        address payable _recipient
    ) external onlyOwner nonReentrant {
        Donation storage donation = donations[_donationId];
        require(
            keccak256(bytes(donation.status)) == keccak256(bytes("confirmed")),
            "Donation not confirmed"
        );
        require(_recipient != address(0), "Invalid recipient");
        
        donation.status = "released";
        (bool success, ) = _recipient.call{value: donation.amount}("");
        require(success, "Transfer failed");
        
        emit FundsReleased(_donationId, _recipient, donation.amount);
    }
    
    /**
     * Dispute a donation
     */
    function disputeDonation(uint256 _donationId, string memory _reason) 
        external 
        onlyOwner 
    {
        Donation storage donation = donations[_donationId];
        donation.status = "disputed";
        emit DonationDisputed(_donationId, _reason);
    }
    
    /**
     * Get donor's donation history
     */
    function getDonorHistory(address _donor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return donorDonations[_donor];
    }
    
    /**
     * Get donation details
     */
    function getDonationDetails(uint256 _donationId)
        external
        view
        returns (Donation memory)
    {
        return donations[_donationId];
    }
    
    /**
     * Get total donations
     */
    function getTotalDonations() external view returns (uint256) {
        return totalDonated;
    }
}
