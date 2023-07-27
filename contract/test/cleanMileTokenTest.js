const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CleanMileToken", function () {
  let cleanMileToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CleanMileToken = await ethers.getContractFactory("CleanMileToken");
    cleanMileToken = await CleanMileToken.deploy("CleanMileToken", "CMT");
  });

  it("Positive) 토큰을 발행하고 정보를 확인합니다.", async function () {
    const name = "CleanMileToken";
    const symbol = "CMT";
    const totalSupply = 100000000n * 10n ** 18n

    const tokenName = await cleanMileToken.name();
    const tokenSymbol = await cleanMileToken.symbol();
    const tokenTotalSupply = await cleanMileToken.totalSupply();

    expect(name).to.equal(tokenName);
    expect(symbol).to.equal(tokenSymbol);
    expect(totalSupply.toString()).to.equal(tokenTotalSupply.toString());
  });

  it("Positive) 타인에게 토큰 전송 권한을 부여 합니다.", async function () {
    const amount = 1000;
    
    await cleanMileToken.approve(addr1.address, amount);

    const allowance = await cleanMileToken.allowance(owner.address, addr1.address);

    expect(amount).to.equal(allowance);
  })

  it("Positive) 토큰 전송 권한을 부여 받은 사람이 타인에게 토큰을 전송합니다.", async function () {
    const amount = 1000;
    const amountBigInt = 1000n;
    const totalSupply = 100000000n * 10n ** 18n
    
    await cleanMileToken.approve(addr2.address, amount);

    await cleanMileToken.transferFrom(owner.address,addr2.address,amount);

    const spenderBalance = await cleanMileToken.balanceOf(owner.address);
    const recipientBalance = await cleanMileToken.balanceOf(addr2.address);

    expect(spenderBalance.toString()).to.equal((totalSupply-amountBigInt).toString());
    expect(recipientBalance).to.equal(amount);
  })

  it("Negative) 잔액 부족 시 전송 실패", async function () {
    const amount = 1000;
  
    // 토큰 전송 허용을 먼저 설정해야 함
    await cleanMileToken.connect(addr1).approve(addr2.address, amount);
  
    // addr1.address의 토큰 잔액 조회
    const balanceBefore = await cleanMileToken.balanceOf(addr1.address);
  
    // 잔액보다 더 많은 토큰을 전송하려고 하면 실패해야 함
    await cleanMileToken.connect(addr1).transferFrom(addr1.address, addr2.address, amount).catch(err => {
      expect(err.message).to.contain("ExceedsBalance");
    });
  
    // 토큰 전송 후 addr1.address의 잔액이 변하지 않아야 함
    const balanceAfter = await cleanMileToken.balanceOf(addr1.address);
    expect(balanceAfter).to.equal(balanceBefore);
  })

  it("Negative) 권한 부여량 보다 많은 토큰 전송 시 전송 실패", async function () {
    const amount = 1000;
  
    // 토큰 전송 허용을 먼저 설정해야 함
    await cleanMileToken.approve(addr2.address, amount);
  
    // addr1.address의 토큰 잔액 조회
    const balanceBefore = await cleanMileToken.balanceOf(addr1.address);
  
    // 잔액보다 더 많은 토큰을 전송하려고 하면 실패해야 함
    await cleanMileToken.transferFrom(owner.address, addr2.address, amount+1).catch(err => {
      expect(err.message).to.contain("ExceedsAllowance");
    });
  
    // 토큰 전송 후 addr1.address의 잔액이 변하지 않아야 함
    const balanceAfter = await cleanMileToken.balanceOf(addr1.address);
    expect(balanceAfter).to.equal(balanceBefore);
  })
  
});
