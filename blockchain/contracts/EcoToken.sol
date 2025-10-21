// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EcoToken
 * @dev Conservation rewards token with geofenced impact verification
 */
contract EcoToken is ERC20, Ownable {
    mapping(uint256 => bool) public verifiedImpacts;
    mapping(address => uint256) public impactPoints;
    mapping(uint256 => ImpactRecord) public impactRecords;
    
    uint256 public impactCounter;
    uint256 public constant TOKENS_PER_IMPACT_POINT = 10 * 10**18; // 10 tokens per point

    struct ImpactRecord {
        uint256 id;
        address contributor;
        uint256 projectId;
        uint256 impactScore;
        int256 latitude;
        int256 longitude;
        string evidenceHash;
        uint256 timestamp;
        bool verified;
    }

    event ImpactRecorded(
        uint256 indexed impactId,
        address indexed contributor,
        uint256 projectId,
        uint256 impactScore
    );

    event TokensRewarded(
        address indexed recipient,
        uint256 amount,
        uint256 impactId
    );

    constructor() ERC20("EcoToken", "ECO") {
        _mint(msg.sender, 1000000 * 10**18); // Initial supply: 1M tokens
    }

    /**
     * @dev Record conservation impact
     */
    function recordImpact(
        uint256 projectId,
        uint256 impactScore,
        int256 latitude,
        int256 longitude,
        string memory evidenceHash
    ) external returns (uint256) {
        require(impactScore <= 100, "Invalid impact score");

        uint256 impactId = impactCounter++;
        
        impactRecords[impactId] = ImpactRecord({
            id: impactId,
            contributor: msg.sender,
            projectId: projectId,
            impactScore: impactScore,
            latitude: latitude,
            longitude: longitude,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            verified: false
        });

        emit ImpactRecorded(impactId, msg.sender, projectId, impactScore);
        return impactId;
    }

    /**
     * @dev Verify and reward impact
     */
    function verifyAndReward(uint256 impactId) external onlyOwner {
        require(!verifiedImpacts[impactId], "Already verified");
        
        ImpactRecord storage record = impactRecords[impactId];
        record.verified = true;
        verifiedImpacts[impactId] = true;

        // Calculate reward based on impact score
        uint256 rewardAmount = (record.impactScore * TOKENS_PER_IMPACT_POINT) / 100;
        
        impactPoints[record.contributor] += record.impactScore;
        _mint(record.contributor, rewardAmount);

        emit TokensRewarded(record.contributor, rewardAmount, impactId);
    }

    /**
     * @dev Get contributor's total impact points
     */
    function getImpactPoints(address contributor) external view returns (uint256) {
        return impactPoints[contributor];
    }

    /**
     * @dev Get impact record details
     */
    function getImpactRecord(uint256 impactId) external view returns (
        address contributor,
        uint256 projectId,
        uint256 impactScore,
        bool verified
    ) {
        ImpactRecord memory record = impactRecords[impactId];
        return (
            record.contributor,
            record.projectId,
            record.impactScore,
            record.verified
        );
    }
}
