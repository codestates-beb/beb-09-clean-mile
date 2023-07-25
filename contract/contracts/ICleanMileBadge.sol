// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICleanMileBadge {
    // 각 뱃지의 ID를 정의합니다. 0은 브론즈, 1은 실버, 2는 골드 뱃지입니다.
    enum BadgeType { Bronze, Silver, Gold }
    
    function mintBadge(address account, BadgeType badgeType, uint256 amount, string memory _uri) external;
    function badgeBalance(address account, uint256 tokenId) external view returns (uint256);
    function transferBadge(address from, address to, uint256 tokenId, uint256 amount) external;
    function transferBadges(address[] calldata recipients, uint256 tokenId, uint256 amount) external;
    function setApprovalForAll(address account, address operator, bool approved) external;
    function setApprovalForToken(address account, uint256 tokenId, bool approved) external;
    function approvalForToken(address account, uint256 tokenId) external view returns (bool);
    function badgeType(uint256 tokenId) external view returns (BadgeType);
    function userBadgeScore(address _address) external view returns(uint256);
} 