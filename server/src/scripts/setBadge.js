const { ethers } = require("ethers");
const config = require("../config/config.json");
const dnftABI = require("../contracts/CleanMileDNFT.sol/CleanMileDNFT.json").abi;
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider);
const dnftContract = new ethers.Contract(config.DNFT_ADDRESS, dnftABI, signer);


/**
 * 뱃지 컨트랙트 등록, 한번만 실행하면 된다.
 * @returns 성공여부
 */
const setBadge = async () => {
  try {
    const transaction = await dnftContract.connect(signer).setBadge(config.BADGE_ADDRESS);
    await transaction.wait(); // 트랜잭션 마이닝까지 기다림;
    if (transaction) console.log("setBadge success!!");
    else ("setBadge failed..");
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
};

setBadge();