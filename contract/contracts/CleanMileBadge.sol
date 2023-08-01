// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICleanMileBadge.sol";

error NoAuthority(address _sender);
error NoRecipients();
error InvalidRecipient(address to);
error ZeroAmount();
error InsufficientBalance();
error SelfApprove();

contract CleanMileBadge is ERC1155, ICleanMileBadge, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256[3] badgeScore = [1, 5, 10];

    // 뱃지의 URI를 저장하기 위한 매핑입니다.
    mapping(uint256 => string) private _badgeURIs;

    // 생성된 뱃지의 수량을 저장하기 위한 매핑입니다.
    mapping(uint256 => mapping(address => uint256)) private _badgeBalances;

    // 토큰 ID에 대한 권한을 부여하는 매핑입니다.
    mapping(uint256 => mapping(address => bool)) private _tokenApprovals;

    // 토큰 ID에 대한 뱃지 유형을 저장하는 매핑입니다.
    mapping(uint256 => BadgeType) private _tokenToBadgeType;

    // 각 사용자에 대한 뱃지 스코어를 저장하는 매핑입니다.
    mapping(address => uint256) private _userBadgeScore;

    constructor() ERC1155("CleanMileBadge") {}

    // 뱃지를 발급하는 함수입니다.
    function mintBadge(
        address account,
        BadgeType _badgeType,
        uint256 amount,
        string memory _uri
    ) external onlyOwner {
        if (amount <= 0) revert ZeroAmount();

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mintBadge(account, _badgeType, amount, _uri, tokenId);

        emit MintBadge(msg.sender, account, _badgeType, amount, _uri);
    }

    function _mintBadge(
        address account,
        BadgeType _badgeType,
        uint256 amount,
        string memory _uri,
        uint256 tokenId
    ) internal virtual {
        _mint(account, tokenId, amount, "");

        _badgeBalances[tokenId][account] += amount;
        _badgeURIs[tokenId] = _uri;
        _tokenToBadgeType[tokenId] = _badgeType;
    }

    // 뱃지 전송을 위한 함수입니다. 한명에 사용자에게 한개씩 전송하는 함수 입니다.
    function transferBadge(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        if (
            from != msg.sender &&
            !isApprovedForAll(from, msg.sender) &&
            !approvalForToken(msg.sender, tokenId)
        ) revert NoAuthority(msg.sender);

        _transferBadge(from, to, tokenId, amount);

        emit TransferSingle(msg.sender, from, to, tokenId, amount);
    }

    // 토큰 주인이나 권한을 받은 사용자가 한가지 종류의 토큰을 여러 사람에게 전송합니다.
    function transferBadges(
        address from,
        address[] calldata recipients,
        uint256 tokenId,
        uint256 amount
    ) public {
        if (
            from != msg.sender &&
            !isApprovedForAll(from, msg.sender) &&
            !approvalForToken(msg.sender, tokenId)
        ) revert NoAuthority(msg.sender);

        if (recipients.length == 0) revert NoRecipients();

        for (uint256 i = 0; i < recipients.length; i++) {
            address to = recipients[i];

            _transferBadge(from, to, tokenId, amount);
        }
        emit TransferMultiple(from, recipients, tokenId, amount);
    }

    function _transferBadge(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) internal virtual {
        if (to == address(0)) revert InvalidRecipient(to);
        if (amount <= 0) revert ZeroAmount();
        if (_badgeBalances[tokenId][from] <= amount)
            revert InsufficientBalance();

        _badgeBalances[tokenId][from] -= amount;
        _badgeBalances[tokenId][to] += amount;

        _userBadgeScore[to] += badgeScore[uint256(_tokenToBadgeType[tokenId])];
    }

    // 사용자가 특정 연산자에게 토큰 전송 권한을 부여하는 함수입니다.
    function setApprovalForAll(
        address operator,
        bool approved
    ) public override {
        if (operator == msg.sender) revert SelfApprove();

        // 연산자에 대한 권한을 설정합니다.
        _setApprovalForAll(msg.sender, operator, approved);
    }

    // ERC-1155 표준에 정의된 isApprovedForAll 함수를 오버라이드합니다.
    function isApprovedForAll(
        address account,
        address operator
    ) public view override returns (bool) {
        // 컨트랙트 소유자에 대해 모든 연산자가 허용됩니다.
        if (msg.sender == owner()) {
            return true;
        }
        // 그 외의 경우 기본 동작을 따릅니다.
        return super.isApprovedForAll(account, operator);
    }

    // 특정 토큰에 대한 권한을 다른 계정에게 부여하는 함수입니다.
    function setApprovalForToken(
        address account,
        uint256 tokenId,
        bool approved
    ) public virtual onlyOwner {
        _tokenApprovals[tokenId][account] = approved;
        emit ApprovalForToken(account, tokenId, approved);
    }

    // 특정 토큰에 대한 권한 여부를 조회하는 함수입니다.
    function approvalForToken(
        address account,
        uint256 tokenId
    ) public view returns (bool) {
        return _tokenApprovals[tokenId][account];
    }

    // 특정 토큰의 뱃지 유형을 조회하는 함수입니다.
    function badgeType(uint256 tokenId) public view returns (BadgeType) {
        return _tokenToBadgeType[tokenId];
    }

    // 유저의 뱃지 점수를 조회하는 함수입니다.
    function userBadgeScore(address _address) public view returns (uint256) {
        return _userBadgeScore[_address];
    }

    // ERC-1155 표준에 정의된 URI를 가져오기 위한 함수입니다.
    function uri(
        uint256 tokenId
    ) public view override(ERC1155) returns (string memory) {
        return _badgeURIs[tokenId];
    }

    // 사용자의 특정 뱃지 수량을 가져오는 함수입니다.
    function badgeBalance(
        address account,
        uint256 tokenId
    ) public view returns (uint256) {
        return _badgeBalances[tokenId][account];
    }
}
