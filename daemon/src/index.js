const cron = require("node-cron");
const {ethers} = require("ethers");
const config = require("./config/config.json");
const dnftABI = require("./abis/dnftABI.json");
const badgeABI  = require("./abis/badgeABI.json");
const tokenABI = require("./abis/tokenABI.json");
const dnftAddress = config.DNFT_ADDRESS;
const badgeAddress = config.BADGE_ADDRESS;
const tokenAddress = config.TOKEN_ADDRESS;
const mongoConnection = require("./loaders/mongoose");
const TransactionModel = require("./models/transaction");
const { TransactionTypes } = require("ethers/lib/utils");

mongoConnection();

const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

async function main(){
    
  const dnftContract = new ethers.Contract(dnftAddress, dnftABI, provider);
  const badgeContract = new ethers.Contract(badgeAddress, badgeABI, provider);
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

  dnftContract.on("MintDNFT", (_to, _name, _description, userType, event) => {
    let info = {
      recipient: _to,
      name : _name,
      description: _description,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));
    
    console.log(JSON.stringify(info,null,2));
  })

  dnftContract.on("UpgradeDNFT",(sender, tokenId, event) => {
    let info = {
      sender: sender,
      tokenId: tokenId,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));
    
    console.log(JSON.stringify(info,null,2));
  });

  badgeContract.on("MintBadge", (sender, account, badgeType, amount, _uri, event)=> {
    let info = {
      sender: sender,
      account: account,
      badgeType: badgeType,
      amount: amount,
      uri: _uri,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  });

  badgeContract.on("TransferMultiple", (sender, recipients, tokenId, amount, event) => {
    let info = {
      sender: sender,
      recipients: recipients,
      tokenId: tokenId,
      amount: amount,
      data: event
    }

    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  });

  badgeContract.on("ApprovalForToken", (account, tokenId, approved, event) => {
    let info = {
      account: account,
      tokenId: tokenId,
      approved: approved,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  });

  badgeContract.on("TransferSingle", (sender, from, to, tokenId, amount, event) => {
    let info = {
      sender: sender,
      from: from,
      to: to,
      tokenId: tokenId, 
      amount: amount,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  });

  tokenContract.on("Transfer", (sender, recipient, amount, event) => {
    let info = {
      sender: sender,
      recipient: recipient,
      amount: amount,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  })

  tokenContract.on("Approval", (owner, spender, amount, event) => {
    let info = {
      owner: owner,
      spender: spender,
      amount: amount,
      data: event
    }
    const transaction = new TransactionModel(info);
  
    transaction.save()
      .then(() => console.log("Transaction saved successfully."))
      .catch((err) => console.error("Error saving transaction:", err));

    console.log(JSON.stringify(info,null,2));
  })
}

main();