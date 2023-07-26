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

  it("토큰을 발행하고 정보를 확인합니다.", async function () {
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

  it("타인에게 토큰 전송 권한을 부여 합니다.", async function () {
    const amount = 1000;
    
    await cleanMileToken.approve(addr1.address, amount);

    const allowance = await cleanMileToken.allowance(owner.address, addr1.address);

    expect(amount).to.equal(allowance);
  })

  it("토큰 전송 권한을 부여 받은 사람이 타인에게 토큰을 전송합니다.", async function () {
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
});
