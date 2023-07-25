// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICleanMileDNFT.sol";
import "./ICleanMileBadge.sol";

error NotOwner(uint256 _tokenId, address sender);
error NonexistentToken(uint256 _tokenId, string tokenURI);

contract CleanMileDNFT is ERC721, Ownable ,ICleanMileDNFT {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    ICleanMileBadge private _badge;

    string[] IpfsUri = [ 
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/1level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/2level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/3level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/4level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/5level.png",
        "https://gold-cool-goat-213.mypinata.cloud/ipfs/QmfFbvLH37DebBqmVBm7V8ecfzgjFPnPeHRYiYk1PNoW84/6level.png"
    ];

    struct DNFTData {
        string name;
        string description;
        DnftType dnftType;
    }

    mapping(uint256 => DNFTData) private _dnftData;
    mapping(uint256 => string) private _tokenURIs; // Added _tokenURIs mapping

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mintDNFT(
        address _to,
        string memory _description,
        string memory _name,
        string memory _tokenURI
    ) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        _dnftData[tokenId] = DNFTData({ name: _name ,description: _description, dnftType: DnftType.level_1});
    }

    function updateDescription(uint256 _tokenId, string calldata _description) onlyOwner external {
        // require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(_tokenId, msg.sender);
        _dnftData[_tokenId].description = _description;
    }

    function updateName(uint256 _tokenId, string calldata _name) onlyOwner external {
        // require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(_tokenId, msg.sender);
        _dnftData[_tokenId].name = _name;
    }

    function dnftType(uint256 _tokenId) public view returns (DnftType) {
        // require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(_tokenId, msg.sender);
        return _dnftData[_tokenId].dnftType;
    }

    function dnftDescription(uint256 _tokenId) public view returns (string memory) {
        // require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(_tokenId, msg.sender);
        return _dnftData[_tokenId].description;
    }

        function dnftName(uint256 _tokenId) public view returns (string memory) {
        // require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        if (ownerOf(_tokenId) != msg.sender) revert NotOwner(_tokenId, msg.sender);
        return _dnftData[_tokenId].name;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function upgrade(uint256 _tokenId) external onlyOwner returns(bool){
        // 현재 단계를 가져옴
        uint256 currentLevel = ownerLevel(_tokenId);
        uint256 pastLevel = uint256(dnftType(_tokenId))+1;
        // 만약 다르다면 업그레이드 기준 충족
        if (currentLevel > pastLevel){
            _setTokenURI(_tokenId, IpfsUri[currentLevel-1]);
            return true;
        }
        return false;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        // require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        if (!_exists(tokenId)) revert NonexistentToken(tokenId, _tokenURI); 
        _tokenURIs[tokenId] = _tokenURI;
    }

    //외부에 노충된 transfer 함수만 사용 못하게 막아줌.
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) onlyOwner public virtual override {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    //외부에 노충된 transfer 함수만 사용 못하게 막아줌.
    function transferFrom(address from, address to, uint256 tokenId) onlyOwner public virtual override {
        super.transferFrom(from, to, tokenId);
    }

    function setBadge(address badgeAddress) public onlyOwner returns(bool){
         require(badgeAddress != address(0x0));
         _badge = ICleanMileBadge(badgeAddress);
         return true;
    }

    function ownerLevel (uint256 _tokenId) public returns(uint256){
        require(address(_badge) !=  address(0x0), '');
        address owner = ownerOf(_tokenId);
        uint256 ownerScore = _badge.userBadgeScore(owner);
        // 1단계(씨앗) : 0점(회원가입 상태)~ 14점 (간격: 15점)
        // 2단계(새싹) : 15점 ~ 39점 (간격25점)
        // 3단계(잎새) : 40점 ~ 74점 (간격35점)
        // 4단계(가지) : 75점 ~ 119점 (간격45점)
        // 5단계(열매) : 120점 ~
        if (ownerScore < 15)  return 1; 
        if (ownerScore < 40)  return 2; 
        if (ownerScore < 75)  return 3; 
        if (ownerScore < 120) return 4; 
        else return 5;
    } 
}