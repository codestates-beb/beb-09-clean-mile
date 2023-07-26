// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICleanMileBadge.sol";

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

    event TransferBatch(
        address indexed sender,
        address[] recipients,
        uint256 tokenId,
        uint256 amount
    );

    constructor() ERC1155("") {}

    // 뱃지를 발급하는 함수입니다.
    function mintBadge(
        address account,
        BadgeType badgeType,
        uint256 amount,
        string memory _uri
    ) external onlyOwner {
        require(amount > 0, "Amount should be greater than 0");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(account, tokenId, amount, "");

        _badgeBalances[tokenId][account] += amount;
        _badgeURIs[tokenId] = _uri;
        _tokenToBadgeType[tokenId] = badgeType;

        emit MintBadge(msg.sender, account, badgeType, amount, _uri);
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

    // 뱃지 전송을 위한 함수입니다. 한명에 사용자에게 한개씩 전송하는 함수 입니다.
    function transferBadge(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            from == msg.sender ||
                isApprovedForAll(from, msg.sender) ||
                approvalForToken(msg.sender, tokenId),
            "Caller is not approved"
        );

        uint256 senderBalance = _badgeBalances[tokenId][from];
        require(senderBalance >= amount, "Insufficient balance");

        _badgeBalances[tokenId][from] = senderBalance - amount;
        _badgeBalances[tokenId][to] += amount;

        _userBadgeScore[to] += badgeScore[uint256(_tokenToBadgeType[tokenId])];

        emit TransferSingle(msg.sender, from, to, tokenId, amount);
    }

    // 토큰 주인(권한 부여 받은 사람X)이 한가지 종류의 토큰을 여러 사람에게 전송합니다.
    function transferBadges(
        address[] calldata recipients,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            recipients.length > 0,
            "Input arrays should have the same length"
        );

        uint256 currentBadageScore = badgeScore[
            uint256(_tokenToBadgeType[tokenId])
        ];

        for (uint256 i = 0; i < recipients.length; i++) {
            address to = recipients[i];

            require(to != address(0), "Invalid recipient");
            require(amount > 0, "Amount should be greater than 0");
            require(
                _badgeBalances[tokenId][msg.sender] >= amount,
                "Insufficient balance"
            );

            _badgeBalances[tokenId][msg.sender] -= amount;
            _badgeBalances[tokenId][to] += amount;

            _userBadgeScore[to] += currentBadageScore;
        }
        emit TransferBatch(msg.sender, recipients, tokenId, amount);
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

    // 사용자가 특정 연산자에게 토큰 전송 권한을 부여하는 함수입니다.
    function setApprovalForAll(
        address account,
        address operator,
        bool approved
    ) public virtual {
        require(operator != msg.sender, "You cannot approve yourself");

        // 연산자에 대한 권한을 설정합니다.
        _setApprovalForAll(account, operator, approved);
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

    // 특정 토큰에 대한 권한 부여 이벤트입니다.
    event ApprovalForToken(
        address indexed account,
        uint256 indexed tokenId,
        bool approved
    );

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
}
