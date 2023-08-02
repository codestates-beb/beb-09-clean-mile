// const ethers = require("ethers");
// const dnftABI = require("./../abis/dnftABI.json");
// const badgeABI  = require("./../abis/badgeABI.json");
// const tokenABI = require("./../abis/tokenABI.json");
// require("dotenv").config;

// async function main() {
//     const dnftAddress = "0x029bd476eC9EB435EF55f1F11451e5F3A3343711";
//     const badgeAddress = "0x3F3D6B3892eAafC39cfE363a121a0d8BBa43F3f5";
//     const tokenAddress = "0xA5Fe46BB0f31433A6d5124F31fcD1F0463016D57";

//     const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

//     const dnftContract = new ethers.Contract(dnftAddress, dnftABI, provider);
//     const badgeContract = new ethers.Contract(badgeAddress, badgeABI, provider);
//     const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

//     dnftContract.on("UpgradeDNFT",(sender, tokenId, event) => {
//         let info = {
//             sender: sender,
//             tokenId: tokenId,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     });

//     badgeContract.on("MintBadge", (sender, account, badgeType, amount, _uri, event)=> {
//         let info = {
//             sender: sender,
//             account: account,
//             badgeType: badgeType,
//             amount: amount,
//             uri: _uri,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     });

//     badgeContract.on("TransferMultiple", (sender, recipients, tokenId, amount, event) => {
//         let info = {
//             sender: sender,
//             recipients: recipients,
//             tokenId: tokenId,
//             amount: amount,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     });

//     badgeContract.on("ApprovalForToken", (account, tokenId, approved, event) => {
//         let info = {
//             account: account,
//             tokenId: tokenId,
//             approved: approved,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     });

//     badgeContract("TransferSingle", (sender, from, to, tokenId, amount, event) => {
//         let info = {
//             sender: sender,
//             from: from,
//             to: to,
//             tokenId: tokenId, 
//             amount: amount,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     });

//     tokenContract("Transfer", (sender, recipient, amount, event) => {
//         let info = {
//             sender: sender,
//             recipient: recipient,
//             amount: amount,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     })

//     tokenContract("Approval", (owner, spender, amount, event) => {
//         let info = {
//             owner: owner,
//             spender: spender,
//             amount: amount,
//             data: event
//         }
//         console.log(JSON.stringify(info,null,2));
//     })
// }

// module.exports = {
//     main
// }