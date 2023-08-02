const ethers = require("ethers");
const dnftABI = require("../abis/dnftABI.json");
const badgeABI  = require("../abis/badgeABI.json");
const tokenABI = require("../abis/tokenABI.json");
require("dotenv").config;

async function main() {
    const dnftAddress = "0x03Ea9a78d3B9177A69AeCAb7f799C0a543b16f1d";
    const badgeAddress = "0xF3198c7a955aA92e3E739D2b4F9793Ad785d9142";
    const tokenAddress = "0x665d3C1766ae6CbCEB2d4297De07069FEbcA2428";

    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

    const dnftContract = new ethers.Contract(dnftAddress, dnftABI, provider);
    const badgeContract = new ethers.Contract(badgeAddress, badgeABI, provider);
    const tokenAdddress = new ethers.Contract(tokenAddress, tokenABI, provider);

    dnftContract.on("UpgradeDNFT",(sender, tokenId, event) => {
        let info = {
            sender: sender,
            tokenId: tokenId,
            data: event
        }
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
        console.log(JSON.stringify(info,null,2));
    });

    badgeContract.on("ApprovalForToken", (account, tokenId, approved, event) => {
        let info = {
            account: account,
            tokenId: tokenId,
            approved: approved,
            data: event
        }
        console.log(JSON.stringify(info,null,2));
    });

    badgeContract("TransferSingle", (sender, from, to, tokenId, amount, event) => {
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

    tokenContract("Transfer", (sender, recipient, amount, event) => {
        let info = {
            sender: sender,
            recipient: recipient,
            amount: amount,
            data: event
        }
        console.log(JSON.stringify(info,null,2));
    })
}

