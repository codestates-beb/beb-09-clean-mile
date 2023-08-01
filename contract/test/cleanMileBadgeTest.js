const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CleanMileBadge", function () {
  let cleanMileBadge;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CleanMileBadge = await ethers.getContractFactory("CleanMileBadge");
    cleanMileBadge = await CleanMileBadge.deploy();
  });

  it ("Positive) 입력받은 정보에 맞는 뱃지를 생성합니다", async function (){
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 10;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    const currentBadgeType = await cleanMileBadge.badgeType(badgeId);
    const currentUri = await cleanMileBadge.uri(badgeId);

    expect(badgeType).to.equal(currentBadgeType);
    expect(uri).to.equal(currentUri);
  })

  it ("Positive) 발행한 뱃지의 전송 권한을 다른 사용자에게 부여할 수 있습니다.", async function (){
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 10;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);
    await cleanMileBadge.setApprovalForToken(addr1.address, badgeId, true);
    await cleanMileBadge.setApprovalForAll( addr1.address, true);

    expect(await cleanMileBadge.approvalForToken(addr1.address, 0)).to.equal(true);
    expect(await cleanMileBadge.isApprovedForAll(owner.address, addr1.address)).to.equal(true);
  })
  it ("Positive) 뱃지를 한번에 여러명에게 정해진 수량 만큼 전송할 수 있습니다", async function () {
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 10;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    const recipients = [addr1.address, addr2.address];

    await cleanMileBadge.transferBadges(owner.address, recipients, badgeId, 1);

    expect(await cleanMileBadge.badgeBalance(addr1.address, 0)).to.equal(1);
    expect(await cleanMileBadge.badgeBalance(addr2.address, 0)).to.equal(1);
  })

  it ("Positive) 뱃지 전송 권한을 부여 받은 사용자가 뱃지 전송을 할 수 있습니다", async function () {
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 100;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    await cleanMileBadge.setApprovalForAll(addr1.address, true);

    await cleanMileBadge.connect(addr1).transferBadge(owner.address, addr2.address, 0, 10);

    expect(await cleanMileBadge.badgeBalance(addr2.address, badgeId)).to.equal(10);
  })

  it ("Positive) 뱃지를 전송 받은 사용자는 뱃지의 등급 만큼 뱃지 점수가 올라가게 됩니다", async function () {
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 100;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    await cleanMileBadge.setApprovalForAll(addr1.address, true);

    await cleanMileBadge.connect(addr1).transferBadge(owner.address, addr2.address, 0, 10);

    const userBadgeScore = await cleanMileBadge.userBadgeScore(addr2.address);

    expect(userBadgeScore).to.equal(10);
  })

  it ("Negative) 뱃지 소유자가 아니거나 권한을 부여 받지 않은 사용자는 토큰을 전송할 수 없습니다.", async function () {
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 100;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    await cleanMileBadge.connect(addr1).transferBadge(owner.address, addr2.address, 0, 10).catch(err => {
      expect(err.message).to.contain("NoAuthority");
    }); 

    expect(await cleanMileBadge.badgeBalance(owner.address, badgeId)).to.equal(amount);
  });

  it ("Negative) 뱃지의 수량이 모자라거나 수량이 0이거나 수신자의 주소가 없다면 전송이 불가 합니다.", async function () {
    const badgeType = 2; //Gold
    const badgeId = 0;
    const amount = 100;
    const uri = "ipfs//Badge 1";

    await cleanMileBadge.mintBadge(owner.address, badgeType, amount, uri);

    await cleanMileBadge.transferBadge(owner.address, addr2.address, 0, 0).catch(err => {
      expect(err.message).to.contain("ZeroAmount","InsufficientBalance","InvalidRecipient");
    }); 

    expect(await cleanMileBadge.badgeBalance(owner.address, badgeId)).to.equal(amount);
  });
});