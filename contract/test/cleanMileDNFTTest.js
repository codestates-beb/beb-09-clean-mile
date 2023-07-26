const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CleanMileDNFT", function () {
  let cleanMileDNFT;
  let cleanMileBadge;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CleanMileDNFT = await ethers.getContractFactory("CleanMileDNFT");
    cleanMileDNFT = await CleanMileDNFT.deploy("CleanMileDNFT", "CMNFT");
    const CleanMileBadge = await ethers.getContractFactory("CleanMileBadge");
    cleanMileBadge = await CleanMileBadge.deploy();
  });

  it("Positive) 레벨 1의 DNFT를 생성합니다.", async function () {
    const tokenId = 0;
    const description = "Description 1";
    const name = "DNFT 1";
    const tokenURI = "ipfs://1";

    await cleanMileDNFT.mintDNFT(addr1.address, description, name, tokenURI);

    // DNFT 데이터 확인
    const dnftType = await cleanMileDNFT.dnftType(tokenId);
    const dnftDescription = await cleanMileDNFT.dnftDescription(tokenId);
    const dnftName = await cleanMileDNFT.dnftName(tokenId);
    const tokenOwner = await cleanMileDNFT.ownerOf(tokenId);
    const tokenUri = await cleanMileDNFT.tokenURI(tokenId);
    expect(dnftType).to.equal(0); // DnftType.level_1은 enum 값 0
    expect(dnftDescription).to.equal(description);
    expect(dnftName).to.equal(name);
    expect(tokenOwner).to.equal(addr1.address);
    expect(tokenUri).to.equal(tokenURI);
  });

  it("Positive) DNFT의 Name과 Description을 업그레이드 합니다.", async function () {
    const tokenId = 0;
    const description = "Description 1";
    const name = "DNFT 1";
    const tokenURI = "ipfs://1";

    await cleanMileDNFT.mintDNFT(addr1.address, description, name, tokenURI);

    const newName = "new DNFT 1";
    const newDescription = "new Description 1";

    await cleanMileDNFT.connect(addr1).updateName(tokenId, newName);
    await cleanMileDNFT.connect(addr1).updateDescription(tokenId, newDescription);

    const dnftName = await cleanMileDNFT.dnftName(tokenId);
    const dnftDescription = await cleanMileDNFT.dnftDescription(tokenId);

    expect(dnftName).to.equal(newName);
    expect(dnftDescription).to.equal(newDescription);
  });

  it("Positive) DNFT에게 뱃지를 지급하고 기준을 충족한다면 업그레이드 합니다.", async function () {
    const dnftId = 0;
    const badgeId = 0;
    const description = "Description 1";
    const name = "DNFT 1";
    const tokenURI = "ipfs://1";
    

    await cleanMileDNFT.mintDNFT(addr1.address, description, name, tokenURI);

    await cleanMileDNFT.setBadge(cleanMileBadge.target);

    await cleanMileBadge.mintBadge(owner.address, 2, 10, 'this is sample');

    await cleanMileBadge.transferBadge(owner.address,addr1.address,badgeId,1);

    await cleanMileBadge.transferBadge(owner.address,addr1.address,badgeId,1);

    await cleanMileDNFT.connect(addr1).upgrade(dnftId)

    const dnftType = await cleanMileDNFT.dnftType(dnftId);
    const badgeScore = await cleanMileBadge.userBadgeScore(addr1.address);

    expect(badgeScore).to.equal(20);
    expect(dnftType).to.equal(1); 
  })

});
