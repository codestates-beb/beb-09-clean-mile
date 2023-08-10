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
    const CleanMileBadage = await ethers.getContractFactory("CleanMileBadge");
    cleanMileBadge = await CleanMileBadage.deploy();
  });

  it("Positive) DNFT와 연동될 뱃지 컨트랙트를 등록 합니다", async function () {
    const badgeAddress = "0x3098dc593Ca5C1f2E845A1DA6430298cF18dFf2B";
    const setBadge = await cleanMileDNFT.connect(owner).setBadge(badgeAddress);

    expect(setBadge); //setBadge === true
  })

  it("Positive) 레벨 1의 DNFT를 생성합니다", async function () {
    const tokenId = 0;
    const description = "Description 1";
    const name = "DNFT 1";

    await cleanMileDNFT.mintDNFT(addr1.address, name, description,0);

    // DNFT 데이터 확인
    const dnftType = await cleanMileDNFT.dnftLevel(tokenId);
    const dnftDescription = await cleanMileDNFT.dnftDescription(tokenId);
    const dnftName = await cleanMileDNFT.dnftName(tokenId);
    const tokenOwner = await cleanMileDNFT.ownerOf(tokenId);
    expect(dnftType).to.equal(0); // DnftType.level_1은 enum 값 0
    expect(dnftDescription).to.equal(description);
    expect(dnftName).to.equal(name);
    expect(tokenOwner).to.equal(addr1.address);
  });

  it("Positive) DNFT의 Name과 Description을 업그레이드 합니다.", async function () {
    const tokenId = 0;
    const description = "Description 1";
    const name = "DNFT 1";

    await cleanMileDNFT.mintDNFT(addr1.address, name, description,0);

    const newName = "new DNFT 1";
    const newDescription = "new Description 1";

    await cleanMileDNFT.connect(owner).updateName(tokenId, newName);
    await cleanMileDNFT.connect(owner).updateDescription(tokenId, newDescription);

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
    
    await cleanMileDNFT.mintDNFT(addr1.address, name, description, 0);

    await cleanMileDNFT.setBadge(cleanMileBadge.target);

    await cleanMileBadge.mintBadge(owner.address, 2, 10, 'this is sample');

    await cleanMileBadge.transferBadge(owner.address,addr1.address,badgeId,1);

    await cleanMileBadge.transferBadge(owner.address,addr1.address,badgeId,1);

    await cleanMileDNFT.connect(owner).upgradeDNFT(dnftId)

    const dnftLevel = await cleanMileDNFT.dnftLevel(dnftId);
    const badgeScore = await cleanMileBadge.userBadgeScore(addr1.address);

    expect(badgeScore).to.equal(20);
    expect(dnftLevel).to.equal(1);
  })

  it("Positive) on-chain 상에서 언제든지 사용자의 DNFT 데이터들을 가져올 수 있습니다.", async function () {
    const dnftId = 0;
    const description = "Description 1";
    const name = "DNFT 1";

    await cleanMileDNFT.mintDNFT(addr1.address, name, description, 0);

    const userDNFTData = await cleanMileDNFT.dnftData(dnftId);

    expect(userDNFTData.name).to.equal(name);
    expect(userDNFTData.description).to.equal(description);
    expect(userDNFTData.level).to.equal(0);
  })

  it("Negative) 뱃지 점수가 모자란 상태에서 업그레이드 요청 시 실패", async function () {
    const dnftId = 0;
    const badgeId = 0;
    const description = "Description 1";
    const name = "DNFT 1";
    

    await cleanMileDNFT.mintDNFT(addr1.address, name, description, 0);

    await cleanMileDNFT.setBadge(cleanMileBadge.target);

    await cleanMileBadge.mintBadge(owner.address, 2, 10, 'this is sample');

    await cleanMileBadge.transferBadge(owner.address,addr1.address,badgeId,1);

    await cleanMileDNFT.connect(owner).upgradeDNFT(dnftId);

    const dnftLevel = await cleanMileDNFT.dnftLevel(dnftId);

    expect(dnftLevel).to.equal(0);
  })

  it("Negative) 컨트랙트 Owner가 아닌 사람이 Name, Description 업데이트 시도 시 실패", async function() {
    const dnftId = 0;
    const description = "Description 1";
    const name = "DNFT 1";
    
    await cleanMileDNFT.mintDNFT(addr1.address, name, description, 0);

    const newName = "new DNFT 1";
    await cleanMileDNFT.connect(addr1).updateName(dnftId, newName).catch(err => {
      expect(err.message);
    });

    const newDescription = "new Description 1";
    await cleanMileDNFT.connect(addr1).updateDescription(dnftId, newDescription).catch(err => {
      expect(err.message);
    });

    const currentName = await cleanMileDNFT.dnftName(dnftId);
    const currentDescription = await cleanMileDNFT.dnftDescription(dnftId);

    expect(currentName).to.equal(name);
    expect(currentDescription).to.equal(description);
  })

  it("Negative) 다른 사용자들이 사용하지 못하도록 override한 함수의 사용이 불가합니다.", async function() {
    const tokenId = 0;
    const description = "Description 1";
    const name = "DNFT 1";

    await cleanMileDNFT.mintDNFT(addr1.address, name, description,0);

    await cleanMileDNFT.connect(addr2).approve(addr2.address, tokenId).catch(err => {
      expect(err.message);
    });
    await cleanMileDNFT.connect(addr2).transferFrom(addr2,addr1,tokenId).catch(err => {
      expect(err.message);
    });

    await cleanMileDNFT.connect(addr2).setApprovalForAll(addr1, true).catch(err => {
      expect(err.message);
    });
  });
}); 
