// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface ICleanMileDNFT {
    //level 1~5는 일반 사용자 level_6은 관리자
    enum DnftType{level_1, level_2, level_3, level_4, level_5, level_6}

    function mintDNFT(
        address _to,
        string calldata _description,
        string calldata _name,
        string calldata _tokenURI
    ) external;
    function updateDescription(uint256 _tokenId, string calldata _description) external;
    function updateName(uint256 _tokenId, string calldata _name) external;
    function dnftType(uint256 _tokenId) external view returns (DnftType);
    function dnftDescription(uint256 _tokenId) external view returns (string memory);
    function dnftName(uint256 _tokenId) external view returns (string memory);
    function upgrade(uint256 _tokenId) external returns(bool);
    function setBadge(address badgeAddress) external returns(bool);
    function upgradeCheck (uint256 _tokenId) external returns(uint256);

    event UpgradeDNFT(address indexed sender,uint256 tokenId);
}