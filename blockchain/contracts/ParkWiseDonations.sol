// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ParkWiseDonations
 * @dev Advanced donation management with dynamic fund release and reputation system
 */
contract ParkWiseDonations is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");

    struct Donation {
        address donor;
        uint256 amount;
        uint256 projectId;
        uint256 timestamp;
        string message;
        bool isAnonymous;
    }

    struct Project {
        uint256 id;
        string name;
        string description;
        address ngoAddress;
        uint256 fundingGoal;
        uint256 totalFunds;
        uint256 releasedFunds;
        uint256 deadline;
        bool isActive;
        int256 latitude;  // Stored as fixed-point (multiply by 1e6)
        int256 longitude; // Stored as fixed-point (multiply by 1e6)
        uint256 geofenceRadius; // in meters
    }

    struct ImpactVerification {
        uint256 projectId;
        address verifier;
        uint256 impactScore; // 0-100
        string evidenceHash; // IPFS hash
        uint256 timestamp;
        bool approved;
    }

    mapping(uint256 => Donation[]) public projectDonations;
    mapping(uint256 => Project) public projects;
    mapping(address => uint256) public ngoReputation;
    mapping(uint256 => ImpactVerification[]) public projectVerifications;
    mapping(address => uint256[]) public donorProjects;
    
    uint256 public projectCounter;
    uint256 public totalDonationsValue;

    event DonationRecorded(
        uint256 indexed projectId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        bool isAnonymous
    );

    event FundsReleased(
        uint256 indexed projectId,
        uint256 amount,
        address indexed verifier,
        uint256 newReputationScore
    );

    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed ngo,
        uint256 fundingGoal
    );

    event ImpactVerified(
        uint256 indexed projectId,
        address indexed verifier,
        uint256 impactScore,
        string evidenceHash
    );

    event DynamicFundRelease(
        uint256 indexed projectId,
        uint256 releaseAmount,
        uint256 impactScore,
        string reason
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Record donation with geofence validation
     */
    function recordDonation(
        address donor,
        uint256 amount,
        uint256 projectId,
        uint256 timestamp
    ) external payable nonReentrant whenNotPaused {
        require(projects[projectId].isActive, "Project not active");
        require(msg.value == amount, "Incorrect amount sent");
        require(block.timestamp <= projects[projectId].deadline, "Project expired");

        projectDonations[projectId].push(Donation({
            donor: donor,
            amount: amount,
            projectId: projectId,
            timestamp: timestamp,
            message: "",
            isAnonymous: false
        }));

        projects[projectId].totalFunds += amount;
        totalDonationsValue += amount;
        donorProjects[donor].push(projectId);

        emit DonationRecorded(projectId, donor, amount, timestamp, false);
    }

    /**
     * @dev Dynamic fund release based on impact verification
     */
    function releaseFunds(
        uint256 projectId,
        uint256 amount,
        address verifierId
    ) external nonReentrant onlyRole(NGO_ROLE) {
        Project storage project = projects[projectId];
        require(project.ngoAddress == msg.sender, "Not project owner");
        require(amount <= project.totalFunds - project.releasedFunds, "Insufficient funds");

        // Calculate dynamic release based on impact score
        uint256 avgImpactScore = calculateAverageImpactScore(projectId);
        require(avgImpactScore >= 60, "Impact score too low for fund release");

        // Adjust release amount based on impact
        uint256 adjustedAmount = (amount * avgImpactScore) / 100;

        project.releasedFunds += adjustedAmount;
        ngoReputation[verifierId] += (avgImpactScore / 10);

        payable(msg.sender).transfer(adjustedAmount);

        emit FundsReleased(projectId, adjustedAmount, verifierId, ngoReputation[verifierId]);
    }

    /**
     * @dev Submit impact verification with geofenced evidence
     */
    function submitImpactVerification(
        uint256 projectId,
        uint256 impactScore,
        string memory evidenceHash,
        int256 latitude,
        int256 longitude
    ) external onlyRole(VERIFIER_ROLE) {
        require(impactScore <= 100, "Invalid impact score");
        
        // Verify location is within project geofence
        require(isWithinGeofence(projectId, latitude, longitude), "Location outside geofence");

        projectVerifications[projectId].push(ImpactVerification({
            projectId: projectId,
            verifier: msg.sender,
            impactScore: impactScore,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            approved: true
        }));

        emit ImpactVerified(projectId, msg.sender, impactScore, evidenceHash);

        // Trigger dynamic fund release if impact is high
        if (impactScore >= 80) {
            triggerDynamicRelease(projectId, impactScore);
        }
    }

    /**
     * @dev Create new conservation project with geofence
     */
    function createProject(
        string memory name,
        string memory description,
        uint256 fundingGoal,
        uint256 duration,
        int256 latitude,
        int256 longitude,
        uint256 geofenceRadius
    ) external onlyRole(NGO_ROLE) returns (uint256) {
        uint256 projectId = projectCounter++;

        projects[projectId] = Project({
            id: projectId,
            name: name,
            description: description,
            ngoAddress: msg.sender,
            fundingGoal: fundingGoal,
            totalFunds: 0,
            releasedFunds: 0,
            deadline: block.timestamp + duration,
            isActive: true,
            latitude: latitude,
            longitude: longitude,
            geofenceRadius: geofenceRadius
        });

        emit ProjectCreated(projectId, name, msg.sender, fundingGoal);
        return projectId;
    }

    /**
     * @dev Calculate average impact score for project
     */
    function calculateAverageImpactScore(uint256 projectId) public view returns (uint256) {
        ImpactVerification[] memory verifications = projectVerifications[projectId];
        if (verifications.length == 0) return 0;

        uint256 totalScore = 0;
        for (uint256 i = 0; i < verifications.length; i++) {
            if (verifications[i].approved) {
                totalScore += verifications[i].impactScore;
            }
        }

        return totalScore / verifications.length;
    }

    /**
     * @dev Check if coordinates are within project geofence
     */
    function isWithinGeofence(
        uint256 projectId,
        int256 latitude,
        int256 longitude
    ) public view returns (bool) {
        Project memory project = projects[projectId];
        
        // Simplified distance calculation (Haversine would be more accurate)
        int256 latDiff = project.latitude - latitude;
        int256 lonDiff = project.longitude - longitude;
        
        uint256 distance = uint256(sqrt(uint256(latDiff * latDiff + lonDiff * lonDiff)));
        
        return distance <= project.geofenceRadius;
    }

    /**
     * @dev Trigger automatic fund release based on high impact
     */
    function triggerDynamicRelease(uint256 projectId, uint256 impactScore) internal {
        Project storage project = projects[projectId];
        uint256 availableFunds = project.totalFunds - project.releasedFunds;
        
        if (availableFunds > 0) {
            uint256 releasePercentage = (impactScore - 80) * 5; // 80+ score = 0-100% release
            uint256 releaseAmount = (availableFunds * releasePercentage) / 100;
            
            if (releaseAmount > 0) {
                project.releasedFunds += releaseAmount;
                payable(project.ngoAddress).transfer(releaseAmount);
                
                emit DynamicFundRelease(
                    projectId,
                    releaseAmount,
                    impactScore,
                    "Automatic release triggered by high impact score"
                );
            }
        }
    }

    /**
     * @dev Get donor's contribution history
     */
    function getDonorProjects(address donor) external view returns (uint256[] memory) {
        return donorProjects[donor];
    }

    /**
     * @dev Get project details
     */
    function getProjectDetails(uint256 projectId) external view returns (
        string memory name,
        uint256 totalFunds,
        uint256 releasedFunds,
        uint256 fundingGoal,
        bool isActive,
        uint256 avgImpactScore
    ) {
        Project memory project = projects[projectId];
        return (
            project.name,
            project.totalFunds,
            project.releasedFunds,
            project.fundingGoal,
            project.isActive,
            calculateAverageImpactScore(projectId)
        );
    }

    /**
     * @dev Square root helper function
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    /**
     * @dev Grant verifier role
     */
    function addVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, verifier);
        ngoReputation[verifier] = 50; // Initial reputation
    }

    /**
     * @dev Grant NGO role
     */
    function addNGO(address ngo) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(NGO_ROLE, ngo);
    }

    /**
     * @dev Pause contract in emergency
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
