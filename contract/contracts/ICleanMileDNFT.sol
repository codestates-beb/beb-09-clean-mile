// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ICleanMileDNFT {
    //level 1~5는 일반 사용자 level_6은 관리자
    enum DNFTLevel {
        level_1,
        level_2,
        level_3,
        level_4,
        level_5,
        level_6
    }

    enum UserType {
        User,
        Admin
    }

    struct DNFTData {
        uint256 token_id;
        string name;
        string description;
        DNFTLevel level;
    }

    event UpgradeDNFT(address indexed sender, uint256 tokenId);

    event MintDNFT(
        address _to,
        string _name,
        string _description,
        UserType userType
    );

    function dnftName(uint256 _tokenId) external view returns (string memory);

    function dnftDescription(
        uint256 _tokenId
    ) external view returns (string memory);

    function dnftLevel(uint256 _tokenId) external view returns (DNFTLevel);

    function dnftData(uint256 _tokenId) external view returns (DNFTData memory);

    function mintDNFT(
        address _to,
        string calldata _name,
        string calldata _description,
        UserType userType
    ) external returns (uint256);

    function updateName(uint256 _tokenId, string calldata _name) external;

    function updateDescription(
        uint256 _tokenId,
        string calldata _description
    ) external;

    function setBadge(address badgeAddress) external returns (bool);

    function upgradeDNFT(uint256 _tokenId) external returns (bool);

    function upgradeCheck(uint256 _tokenId) external returns (DNFTLevel);
}
