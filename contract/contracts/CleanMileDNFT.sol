// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICleanMileDNFT.sol";
import "./ICleanMileBadge.sol";

error InvalidUserType();
error NotOwner(uint256 _tokenId, address sender);
error NonexistentToken(uint256 _tokenId);
error BadgeNotSet();
error MaxLevel(uint256 _tokenId);

contract CleanMileDNFT is ERC721, ICleanMileDNFT, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    ICleanMileBadge private _badge;

    string[6] IpfsUri = [
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/1level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/2level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/3level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/4level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/5level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/6level.png"
    ];

    mapping(uint256 => DNFTData) private _dnftData;
    mapping(uint256 => string) private _tokenURIs; // Added _tokenURIs mapping

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function dnftName(uint256 _tokenId) public view returns (string memory) {
        return _dnftData[_tokenId].name;
    }

    function dnftDescription(
        uint256 _tokenId
    ) public view returns (string memory) {
        return _dnftData[_tokenId].description;
    }

    function dnftLevel(uint256 _tokenId) public view returns (DNFTLevel) {
        return _dnftData[_tokenId].level;
    }

    function dnftData(uint256 _tokenId) public view returns (DNFTData memory) {
        return _dnftData[_tokenId];
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function mintDNFT(
        address _to,
        string calldata _name,
        string calldata _description,
        UserType userType
    ) external onlyOwner {
        if (!(userType == UserType.Admin || userType == UserType.User)) {
            revert InvalidUserType();
        }

        DNFTLevel _level;

        if (userType == UserType.Admin) {
            _level = DNFTLevel.level_6;
        } else {
            _level = DNFTLevel.level_1;
        }

        string memory _tokenURI = IpfsUri[uint256(_level)];

        _mintDNFT(_to, _name, _description, _tokenURI, _level);
    }

    function _mintDNFT(
        address _to,
        string calldata _name,
        string calldata _description,
        string memory _tokenURI,
        DNFTLevel _level
    ) internal virtual {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        _dnftData[tokenId] = DNFTData({
            name: _name,
            description: _description,
            level: _level
        });

        return tokenId;
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        if (!_exists(tokenId)) revert NonexistentToken(tokenId);
        _tokenURIs[tokenId] = _tokenURI;
    }

    function updateName(uint256 _tokenId, string calldata _name) external {
        if (ownerOf(_tokenId) != msg.sender)
            revert NotOwner(_tokenId, msg.sender);
        _dnftData[_tokenId].name = _name;
    }

    function updateDescription(
        uint256 _tokenId,
        string calldata _description
    ) external {
        if (ownerOf(_tokenId) != msg.sender)
            revert NotOwner(_tokenId, msg.sender);
        _dnftData[_tokenId].description = _description;
    }

    function setBadge(address badgeAddress) public onlyOwner returns (bool) {
        require(badgeAddress != address(0x0));
        _badge = ICleanMileBadge(badgeAddress);
        return true;
    }

    function upgradeDNFT(uint256 _tokenId) external returns (bool) {
        // check if the token exists
        if (!_exists(_tokenId)) revert NonexistentToken(_tokenId);

        // check if the badge contract is set
        address owner = ownerOf(_tokenId);
        if (msg.sender != owner) revert NotOwner(_tokenId, msg.sender);

        // check current level of the DNFT
        DNFTLevel currentLevel = dnftLevel(_tokenId);

        // check if the current level is max level (level 5) or admin level (level 6)
        if (
            currentLevel == DNFTLevel.level_5 ||
            currentLevel == DNFTLevel.level_6
        ) revert MaxLevel(_tokenId);

        // check next level based on the badge score
        DNFTLevel nextLevel = _upgradeCheck(_tokenId);

        // if the next level is higher than the current level, upgrade the DNFT
        if (nextLevel > currentLevel) {
            string memory _tokenURI = IpfsUri[uint256(nextLevel)];
            _setTokenURI(_tokenId, _tokenURI);
            _dnftData[_tokenId].level = nextLevel;
            emit UpgradeDNFT(msg.sender, _tokenId);
            return true;
        }

        // if the next level is not higher than the current level, do nothing
        return false;
    }

    function upgradeCheck(uint256 _tokenId) public view returns (DNFTLevel) {
        // check if the token exists
        if (!_exists(_tokenId)) revert NonexistentToken(_tokenId);
        // check if the badge contract is set
        if (address(_badge) == address(0x0)) revert BadgeNotSet();

        return _upgradeCheck(_tokenId);
    }

    function _upgradeCheck(uint256 _tokenId) private view returns (DNFTLevel) {
        address owner = ownerOf(_tokenId);
        uint256 ownerScore = _badge.userBadgeScore(owner);
        // 1단계(씨앗) : 0점(회원가입 상태)~ 14점 (간격: 15점)
        // 2단계(새싹) : 15점 ~ 39점 (간격25점)
        // 3단계(잎새) : 40점 ~ 74점 (간격35점)
        // 4단계(가지) : 75점 ~ 119점 (간격45점)
        // 5단계(열매) : 120점 ~
        if (ownerScore < 15) return DNFTLevel.level_1;
        if (ownerScore < 40) return DNFTLevel.level_2;
        if (ownerScore < 75) return DNFTLevel.level_3;
        if (ownerScore < 120) return DNFTLevel.level_4;
        else return DNFTLevel.level_5;
    }

    /* 
        disable transfer and approve functions by overriding them with onlyOwner modifier
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override onlyOwner {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        super.safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        super.transferFrom(from, to, tokenId);
    }

    function approve(
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override onlyOwner {
        super.setApprovalForAll(operator, approved);
    }
}
