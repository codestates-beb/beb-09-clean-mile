const { ethers } = require("ethers");
const config = require("../../config/config.json");
const dnftABI = require("../../contracts/CleanMileDNFT.sol/CleanMileDNFT.json").abi;
const DnftModel = require("../../models/DNFTs");
const UserModel = require("../../models/Users");
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
    if (transaction) return {success: true};
    else return {success: false};
  } catch (err) {
    console.error("Error:", err);
    throw new Error(err);
  }
};

/**
 * 회원가입 시 DNFT 생성
 * @param {string} email
 * @param {number} userType
 * @returns 성공여부
 */
const createDNFT = async (email, userType) => {
  try { 
    const user = await UserModel.findOne({ email : email });
    let description;
    const tokenId = await DnftModel.countDocuments();
    if (userType == 0) {
      // 일반 사용자
      description = "---Events---";
    } else if (userType == 1) {
      // 관리자
      description = "Administrator";
    } else {
      return {success: false};
    }
    const transaction = await dnftContract.connect(signer).mintDNFT(user.wallet.address, user.name, description, userType);
    await transaction.wait();

    const tokenUri = await dnftContract.connect(signer).tokenURI(tokenId);
    const dnftLevel = await dnftContract.connect(signer).dnftLevel(tokenId);
    const dnftId = await DnftModel.countDocuments();

    const dnftData = new DnftModel({
      token_id: dnftId,
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
    const ownerPK = user.wallet.private_key;
    let owner =  new ethers.Wallet(ownerPK, provider);
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
const updateDescription = async (email,newEvent) => {
  try{
    //업데이트는 token owner만 가능하다
    const user = await UserModel.findOne({email: email});
    const ownerPK = user.wallet.private_key;
    let owner =  new ethers.Wallet(ownerPK, provider);
    const dnft = await DnftModel.findOne({user_id: user._id});

    const currentDescription = await dnftContract.connect(owner).dnftDescription(dnft.token_id);

    const newDescription = `${currentDescription}\n${newEvent}`;

    const transaction = await dnftContract.connect(owner).updateDescription(dnft.token_id, newDescription);
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
 * DNFT Data 요청(굳이 필요한가?)
 * @param {string} email
 * @returns 사용자 DNFT 데이터
 */
const userDnftData = async (userId) => {
  try{
    const user = await UserModel.findOne({_id: userId });
    const dnft = await DnftModel.findOne({user_id: userId});
    
    return ({
      success: true,
      data:
      {
        owner: user.nickname,
        tokenId: dnft.token_id,
        name: dnft.name,
        imageUrl: dnft.token_uri,
        description: dnft.description
      }
    })
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
    const ownerPK = user.wallet.private_key;
    let owner = new ethers.Wallet(ownerPK, provider);
    const dnft = await DnftModel.findOne({user_id: user._id});
    const tokenId = dnft.token_id;
    const gasPrice = ethers.utils.parseUnits('50', 'gwei');
    const feeData = await provider.getFeeData();
    const gasLimit =  utils.formatUnits(feeData.maxFeePerGas, "wei");
    const transaction = await dnftContract.connect(owner).upgradeDNFT(tokenId,{ gasPrice,gasLimit});
    await transaction.wait();

    if (transaction) {
      const dnftURI = await dnftContract.tokenURI(tokenId);
      dnft.token_uri = dnftURI;
      const dnftLevel = await dnftContract.dnftLevel(tokenId);
      dnft.dnft_level = dnftLevel;
      const result = await dnft.save();
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
  setBadge,
  createDNFT,
  updateName,
  updateDescription,
  userDnftData,
  upgradeDnft
}