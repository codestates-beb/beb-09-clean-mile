// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ICleanMileBadge {
    // 각 뱃지의 ID를 정의합니다. 0은 브론즈, 1은 실버, 2는 골드 뱃지입니다.
    enum BadgeType {
        Bronze,
        Silver,
        Gold
    }

    // 토큰 ID에 대한 뱃지 유형을 조회하는 함수
    function badgeType(uint256 tokenId) external view returns (BadgeType);

    // 유저의 뱃지 점수를 조회하는 함수
    function userBadgeScore(
        address userAddress
    ) external view returns (uint256);

    // 특정 토큰의 뱃지 수량을 조회하는 함수
    function badgeBalance(
        address account,
        uint256 tokenId
    ) external view returns (uint256);

    // 뱃지를 발급하는 함수
    function mintBadge(
        address account,
        BadgeType badgeType,
        uint256 amount,
        string memory uri
    ) external returns (uint256);

    // 뱃지를 전송하는 함수 (한명에게 한개씩)
    function transferBadge(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external;

    // 뱃지를 여러 사용자에게 전송하는 함수 (한가지 종류의 토큰을 여러 사람에게)
    function transferBadges(
        address from,
        address[] calldata recipients,
        uint256 tokenId,
        uint256 amount
    ) external;

    event MintBadge(
        address indexed sender,
        address account,
        BadgeType badgeType,
        uint256 amount,
        string _uri
    );

    event TransferMultiple(
        address indexed sender,
        address[] recipients,
        uint256 tokenId,
        uint256 amount
    );

    // 특정 토큰에 대한 권한 부여 이벤트입니다.
    event ApprovalForToken(
        address indexed account,
        uint256 indexed tokenId,
        bool approved
    );
}
