// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ReputationToken - Soulbound NFT badges for conservation contributors
 * Non-transferable tokens that represent user achievements
 */
contract ReputationToken is ERC721, Ownable {
    
    struct Badge {
        string badgeType; // NOVICE, EXPLORER, NATURALIST, EXPERT
        uint256 mintedAt;
        uint256 donationCount;
        uint256 speciesCount;
        uint256 points;
    }
    
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => bool) public badgeHolders;
    uint256 public tokenCounter;
    
    event BadgeMinted(
        address indexed user,
        uint256 indexed tokenId,
        string badgeType,
        uint256 timestamp
    );
    
    event BadgeBurned(
        address indexed user,
        uint256 indexed tokenId
    );
    
    constructor() ERC721("ParkWise Reputation", "PWREP") {}
    
    /**
     * Mint a badge (only owner)
     */
    function mintBadge(
        address _user,
        string memory _badgeType,
        uint256 _donationCount,
        uint256 _speciesCount,
        uint256 _points
    ) external onlyOwner {
        require(_user != address(0), "Invalid user address");
        require(bytes(_badgeType).length > 0, "Badge type required");
        
        uint256 tokenId = tokenCounter++;
        
        badges[tokenId] = Badge({
            badgeType: _badgeType,
            mintedAt: block.timestamp,
            donationCount: _donationCount,
            speciesCount: _speciesCount,
            points: _points
        });
        
        _safeMint(_user, tokenId);
        userBadges[_user].push(tokenId);
        badgeHolders[_user] = true;
        
        emit BadgeMinted(_user, tokenId, _badgeType, block.timestamp);
    }
    
    /**
     * Burn a badge (only owner or token holder)
     */
    function burnBadge(uint256 _tokenId) external {
        require(
            msg.sender == ownerOf(_tokenId) || msg.sender == owner(),
            "Not authorized"
        );
        
        address tokenOwner = ownerOf(_tokenId);
        _burn(_tokenId);
        
        emit BadgeBurned(tokenOwner, _tokenId);
    }
    
    /**
     * Get user's badges
     */
    function getUserBadges(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userBadges[_user];
    }
    
    /**
     * Get badge details
     */
    function getBadgeDetails(uint256 _tokenId)
        external
        view
        returns (Badge memory)
    {
        require(_exists(_tokenId), "Badge does not exist");
        return badges[_tokenId];
    }
    
    /**
     * Check if user holds any badge
     */
    function isBadgeHolder(address _user) external view returns (bool) {
        return badgeHolders[_user];
    }
    
    /**
     * Soulbound: Prevent transfers
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: Cannot transfer"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * Override approve to prevent transfers
     */
    function approve(address to, uint256 tokenId) public override {
        revert("Soulbound: Cannot approve");
    }
    
    /**
     * Override setApprovalForAll to prevent transfers
     */
    function setApprovalForAll(address operator, bool approved) public override {
        revert("Soulbound: Cannot approve");
    }
}
