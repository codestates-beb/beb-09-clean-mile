const { ethers } = require("ethers");
const config = require("../../config");
const dnftABI = require("../../../../contract/artifacts/contracts/CleanMileDNFT.sol/CleanMileDNFT.json").abi;
const DnftModel = require("../../models/DNFTs");
const UserModel = require("../../models/Users");
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = provider.getSigner(config.SENDER);
const dnftContract = new ethers.Contract(config.DNFT_ADDRESS, dnftABI, signer);
//Badge 등록
const setBadge = await dnftContract.connect(signer).setBadge(config.BADGE_ADDRESS);


/**
 * 회원가입 시 DNFT 생성
 * @param {string} address
 * @param {number} userType
 * @returns 성공여부
 */
const createDNFT = async (address, userType) => {
  try { 
    const user = await UserModel.findOne({ 'wallet.address': address });
    let description;
    
    if (userType == 0) {
      // 일반 사용자
      const transaction = await dnftContract.connect(signer).mintDNFT(address, user.name, "", userType);
      await transaction.wait();
      description = "";
    } else if (userType == 1) {
      // 관리자
      const transaction = await dnftContract.connect(signer).mintDNFT(address, user.name, "Administrator", userType);
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
    if (!result) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
};

/**
 * DNFT name 변경 요청
 * @param {string} address
 * @param {string} newName
 * @returns 성공여부
 */
const updateName = async (address, newName) => {
  try{
    //업데이트는 token owner만 가능하다
    let owner = provider.getSigner(address);
    const userId = await UserModel.findOne({'wallet.address': address })._id;
    const dnft = await DnftModel.findOne({user_id: userId});
    const tokenId = dnft.token_id;
    const reqUpdateName = await dnftContract.connect(owner).updateName(tokenId, newName);
    if (reqUpdateName){
      dnft.name = newName;
      const result = await dnft.save();
      if (!result) {
        return { success: false };
      } else {
        return { success: true };
      }
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
 * @param {string} address
 * @param {string} newDescription
 * @returns 성공여부
 */
const updateDescription = async (address,newDescription) => {
  try{
    //업데이트는 token owner만 가능하다
    let owner = provider.getSigner(address);
    const userId = await UserModel.findOne({'wallet.address': address })._id;
    const dnft = await DnftModel.findOne({user_id: userId});
    const tokenId = dnft.token_id;
    const reqUpdateName = await dnftContract.connect(owner).updateName(tokenId, newDescription);
    if (reqUpdateName){
      dnft.description = newDescription;
      const result = await dnft.save();
      if (!result) {
        return { success: false };
      } else {
        return { success: true };
      }
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
 * @param {string} address
 * @returns 사용자 DNFT 데이터
 */
const userDnftData = async (address) => {
  try{
    const userId = await UserModel.findOne({'wallet.address': address })._id;
    const userName = await UserModel.findOne({'wallet.address': address}).nickname;
    const dnft = await DnftModel.findOne({user_id: userId});
    
    return {
      owner: userName,
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
 * @param {string} address
 * @returns 사용자 DNFT 데이터
 */
const upgradeDnft = async () => {
  try{

  }catch(err){
    onsole.error("Error:", err);
    throw new Error(err);
  }
}


module.exports = {
  createDNFT,
  updateName,
  updateDescription,
  userDnftData
}