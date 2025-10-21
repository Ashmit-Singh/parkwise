// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ImpactOracle - Records and verifies conservation impact on blockchain
 * Provides transparent, auditable impact attestations
 */
contract ImpactOracle is Ownable {
    
    struct ImpactAttestation {
        uint256 campaignId;
        string metricType; // species_count, area_protected, etc.
        uint256 value;
        uint256 timestamp;
        address verifier;
        uint256 confidenceScore; // 0-100
        string dataHash; // IPFS hash of supporting data
    }
    
    mapping(uint256 => ImpactAttestation[]) public campaignImpact;
    mapping(address => bool) public authorizedVerifiers;
    uint256 public attestationCounter;
    
    event ImpactAttested(
        uint256 indexed campaignId,
        string metricType,
        uint256 value,
        address indexed verifier,
        uint256 timestamp
    );
    
    event VerifierAuthorized(address indexed verifier);
    event VerifierRevoked(address indexed verifier);
    
    constructor() {
        authorizedVerifiers[msg.sender] = true;
    }
    
    /**
     * Authorize a verifier
     */
    function authorizeVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Invalid verifier");
        authorizedVerifiers[_verifier] = true;
        emit VerifierAuthorized(_verifier);
    }
    
    /**
     * Revoke verifier authorization
     */
    function revokeVerifier(address _verifier) external onlyOwner {
        authorizedVerifiers[_verifier] = false;
        emit VerifierRevoked(_verifier);
    }
    
    /**
     * Attest impact (only authorized verifiers)
     */
    function attestImpact(
        uint256 _campaignId,
        string memory _metricType,
        uint256 _value,
        uint256 _confidenceScore,
        string memory _dataHash
    ) external {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        require(_confidenceScore <= 100, "Confidence must be 0-100");
        require(bytes(_metricType).length > 0, "Metric type required");
        require(bytes(_dataHash).length > 0, "Data hash required");
        
        ImpactAttestation memory attestation = ImpactAttestation({
            campaignId: _campaignId,
            metricType: _metricType,
            value: _value,
            timestamp: block.timestamp,
            verifier: msg.sender,
            confidenceScore: _confidenceScore,
            dataHash: _dataHash
        });
        
        campaignImpact[_campaignId].push(attestation);
        attestationCounter++;
        
        emit ImpactAttested(
            _campaignId,
            _metricType,
            _value,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * Get campaign impact history
     */
    function getCampaignImpact(uint256 _campaignId)
        external
        view
        returns (ImpactAttestation[] memory)
    {
        return campaignImpact[_campaignId];
    }
    
    /**
     * Get impact count for campaign
     */
    function getCampaignImpactCount(uint256 _campaignId)
        external
        view
        returns (uint256)
    {
        return campaignImpact[_campaignId].length;
    }
    
    /**
     * Get specific impact attestation
     */
    function getImpactAttestation(uint256 _campaignId, uint256 _index)
        external
        view
        returns (ImpactAttestation memory)
    {
        require(_index < campaignImpact[_campaignId].length, "Index out of bounds");
        return campaignImpact[_campaignId][_index];
    }
}
