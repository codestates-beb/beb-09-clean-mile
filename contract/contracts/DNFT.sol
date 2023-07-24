// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

interface IDNFT {
    function mintDNFT(
        address _to,
        string calldata _description,
        string calldata _name,
        string calldata _tokenURI
    ) external;
    function updateDescription(uint256 _tokenId, string calldata _description) external;
    function updateName(uint256 _tokenId, string calldata _name) external;
    function getDnftDescription(uint256 _tokenId) external view returns (string memory);
    function getDnftName(uint256 _tokenId) external view returns (string memory);
    function getTokenURI(uint256 _tokenId) external view returns (string memory);
    function upgrade(uint256 _tokenId, uint256 i) external;
}

contract DNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string[] IpfsUri = [ 
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/bronze.json",
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/silver.json",
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/gold.json"
    ];

    struct DNFTData {
        address owner;
        string name;
        string description;
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

        _dnftData[tokenId] = DNFTData({owner: _to, name: _name ,description: _description});
    }

    function updateDescription(uint256 _tokenId, string memory _description) external {
        require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        _dnftData[_tokenId].description = _description;
    }

    function updateName(uint256 _tokenId, string memory _name) external {
        require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        _dnftData[_tokenId].name = _name;
    }

    function getDnftDescription(uint256 _tokenId) public view returns (string memory) {
        require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        return _dnftData[_tokenId].description;
    }

        function getDnftName(uint256 _tokenId) public view returns (string memory) {
        require(ownerOf(_tokenId) == msg.sender, "DNFT: Not the owner of the DNFT");
        return _dnftData[_tokenId].name;
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        string memory tokenUri = tokenURI(_tokenId);
        return tokenUri;
    }

    function upgrade(uint256 _tokenId, uint256 i) public {
        _setTokenURI(_tokenId, IpfsUri[i]);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        return _tokenURIs[tokenId]; // Return URI from _tokenURIs mapping
    }
}
