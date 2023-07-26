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
    const totalSupply = 100000000;

    const tokenName = await cleanMileToken.name();
    const tokenSymbol = await cleanMileToken.symbol();
    const tokenTotalSupply = await cleanMileToken.totalSupply();

    expect(name).to.equal(tokenName);
    expect(symbol).to.equal(tokenSymbol);
    expect(totalSupply).to.equal(tokenTotalSupply);
  });

  it("타인에게 토큰 전송 권한을 부여 합니다.", async function () {
    const amount = 1000;
    
    await cleanMileToken.approve(addr1.address, amount);

    const allowance = await cleanMileToken.allowance(owner.address, addr1.address);

    expect(amount).to.equal(allowance);
  })

  it("토큰 전송 권한을 부여 받은 사람이 타인에게 토큰을 전송합니다.", async function () {
    const amount = 1000;
    const totalSupply = 100000000;
    
    await cleanMileToken.approve(addr1.address, amount);

    await cleanMileToken.connect(addr1).transfer(addr2.address,amount);

    const spenderBalance = await cleanMileToken.balanceOf(owner.address);
    const recipientBalance = await cleanMileToken.balanceOf(addr2.address);

    expect(spenderBalance).to.equal(totalSupply-amount);
    expect(recipientBalance).to.equal(amount);
  })
});
