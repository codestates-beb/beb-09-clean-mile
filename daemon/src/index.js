const cron = require("node-cron");
const {ethers} = require("ethers");
const config = require("./config/config.json");
const dnftABI = require("./abis/dnftABI.json");
const badgeABI  = require("./abis/badgeABI.json");
const tokenABI = require("./abis/tokenABI.json");
const dnftAddress = config.DNFT_ADDRESS;
const badgeAddress = config.BADGE_ADDRESS;
const tokenAddress = config.TOKEN_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

const dnftContract = new ethers.Contract(dnftAddress, dnftABI, provider);
const badgeContract = new ethers.Contract(badgeAddress, badgeABI, provider);
const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

//once 메서드는 이벤트가 발생할 때마다 한 번만 실행되며, 중복 등록을 방지
dnftContract.once("UpgradeDNFT",(sender, tokenId, event) => {
  let info = {
    sender: sender,
    tokenId: tokenId,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
});

badgeContract.once("MintBadge", (sender, account, badgeType, amount, _uri, event)=> {
  let info = {
    sender: sender,
    account: account,
    badgeType: badgeType,
    amount: amount,
    uri: _uri,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
});

badgeContract.once("TransferMultiple", (sender, recipients, tokenId, amount, event) => {
  let info = {
    sender: sender,
    recipients: recipients,
    tokenId: tokenId,
    amount: amount,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
});

badgeContract.once("ApprovalForToken", (account, tokenId, approved, event) => {
  let info = {
    account: account,
    tokenId: tokenId,
    approved: approved,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
});

badgeContract.once("TransferSingle", (sender, from, to, tokenId, amount, event) => {
  let info = {
    sender: sender,
    from: from,
    to: to,
    tokenId: tokenId, 
    amount: amount,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
});

tokenContract.once("Transfer", (sender, recipient, amount, event) => {
  let info = {
    sender: sender,
    recipient: recipient,
    amount: amount,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
})

tokenContract.once("Approval", (owner, spender, amount, event) => {
  let info = {
    owner: owner,
    spender: spender,
    amount: amount,
    data: event
  }
  console.log(JSON.stringify(info,null,2));
})