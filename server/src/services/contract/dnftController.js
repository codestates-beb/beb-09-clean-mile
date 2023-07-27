const { ethers } = require("ethers");
const config = require("../../config");
const dnftABI = require("../../../../contract/artifacts/contracts/CleanMileDNFT.sol/CleanMileDNFT.json").abi;
const DnftModel = require("../../models/DNFTs");
const UserModel = require("../../models/Users");
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = provider.getSigner(config.SENDER);
const dnftContract = new ethers.Contract(config.DNFT_ADDRESS, dnftABI, signer);
//Badge 등록


/**
 * 회원가입 시 DNFT 생성
 * @param {string} email
 * @param {number} userType
 * @returns 성공여부
 */
//address -> email

const setBadge = async () => {
  try {
    const transaction = await dnftContract.connect(signer).setBadge(config.BADGE_ADDRESS);
    await transaction.wait(); // 트랜잭션 마이닝까지 기다림;
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
};

const createDNFT = async (email, userType) => {
  try { 
    const user = await UserModel.findOne({ email : email });
    let description;
    
    if (userType == 0) {
      // 일반 사용자
      const transaction = await dnftContract.connect(signer).mintDNFT(user.wallet.address, user.name, "", userType);
      await transaction.wait();
      description = "";
    } else if (userType == 1) {
      // 관리자
      const transaction = await dnftContract.connect(signer).mintDNFT(user.wallet.address, user.name, "Administrator", userType);
      await transaction.wait();
      description = "Administrator";
    }

    const tokenId = transaction.events[0].args.tokenId.toString();
    const tokenUri = await dnftContract.connect(signer).tokenURI(tokenId);
    const dnftLevel = await dnftContract.connect(signer).dnftLevel(tokenId);

    const dnftData = new DnftModel({
      token_id: tokenId,
      user_id: user._id,
      name: user.nickname,
      description: description,
      token_uri: tokenUri,
      dnft_level: dnftLevel,
    });
    const result = await dnftData.save();
    if (!result) return { success: false };
    else return { success: true };
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
};

/**
 * DNFT name 변경 요청
 * @param {string} email
 * @param {string} newName
 * @returns 성공여부
 */
const updateName = async (email, newName) => {
  try{
    //업데이트는 token owner만 가능하다
    
    const user = await UserModel.findOne({email: email});
    let owner = provider.getSigner(user.wallet.address);
    const dnft = await DnftModel.findOne({user_id: user._id});
    const transaction = await dnftContract.connect(owner).updateName(dnft.token_id, newName);
    await transaction.wait();
    if (transaction){
      dnft.name = newName;
      const result = await dnft.save();
      if (!result) return { success: false };
      else return { success: true };
    }else{
      return {success: false};
    }
  } catch(err) {
    console.error("Error:", err);
    throw new Error(err);
  }
}


/**
 * DNFT description 변경 요청(새로운 뱃지를 얻었을 때 불러서 사용!!!)
 * @param {string} email
 * @param {string} newDescription
 * @returns 성공여부
 */
const updateDescription = async (email,newDescription) => {
  try{
    //업데이트는 token owner만 가능하다
    const user = await UserModel.findOne({email: email});
    let owner = provider.getSigner(user.wallet.address);
    const dnft = await DnftModel.findOne({user_id: user._id});
    const transaction = await dnftContract.connect(owner).updateName(dnft.token_id, newDescription);
    await transaction.wait();
    if (transaction){
      dnft.description = newDescription;
      const result = await dnft.save();
      if (!result) return { success: false };
      else return { success: true };
    }else{
      return {success: false};
    }
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
}

/**
 * DNFT Data 요청
 * @param {string} email
 * @returns 사용자 DNFT 데이터
 */
const userDnftData = async (email) => {
  try{
    const user = await UserModel.findOne({email: email });
    const dnft = await DnftModel.findOne({user_id: user._id});
    
    return {
      owner: user.nickname,
      tokenId: dnft.token_id,
      name: dnft.name,
      imageUrl: dnft.token_uri,
      description: dnft.description
    }
  }catch(err){
    console.error("Error:", err);
    throw new Error(err);
  }
}

/**
 * DNFT 업그레이드 요청
 * @param {string} email
 * @returns 성공여부
 */
const upgradeDnft = async (email) => {
  try{
    
    const user = await UserModel.findOne({ email: email });
    let owner = provider.getSigner(user.wallet.address);
    const dnft = await DnftModel.findOne({user_id: user._id});
    const tokenId = dnft.token_id;
    const transaction = await dnftContract.connect(owner).upgradeDnft(tokenId);
    await transaction.wait();
    if (transaction) {
      const dnftLevel = await dnftContract.dnftData(tokenId);
      dnft.dnft_level = dnftLevel;
      const result = dnft.save();
      if (!result) return {success: false};
      else return {success: true};
    }else{
      return {success: false};
    }
  }catch(err){
    console.error("Error:", err);
    throw new Error(err);
  }
}


module.exports = {
  createDNFT,
  updateName,
  updateDescription,
  userDnftData,
  upgradeDnft
}
