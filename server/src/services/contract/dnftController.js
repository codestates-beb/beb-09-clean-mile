const { ethers } = require('ethers');
const config = require('../../config/config.json');
const dnftABI =
  require('../../contracts/CleanMileDNFT.sol/CleanMileDNFT.json').abi;
const DnftModel = require('../../models/DNFTs');
const UserModel = require('../../models/Users');
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider);
const dnftContract = new ethers.Contract(config.DNFT_ADDRESS, dnftABI, signer);

/**
 * 뱃지 컨트랙트 등록, 한번만 실행하면 된다.
 * @returns 성공여부
 */
const setBadge = async () => {
  try {
    const transaction = await dnftContract
      .connect(signer)
      .setBadge(config.BADGE_ADDRESS);
    await transaction.wait(); // 트랜잭션 마이닝까지 기다림;
    if (transaction) return { success: true };
    else return { success: false };
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * 회원가입 시 DNFT 생성
 * @param {string} user_id
 * @param {string} wallet_address
 * @param {string} name
 * @param {string} nickname
 * @param {number} userType
 * @returns 성공여부
 */
/**
 * @author leejisu
 * @data 2023.08.06
 * @description 아래의 내용 수정
 *  - 파라미터 수정
 *  - description 수정 (switch)
 */
const createDNFT = async (
  user_id,
  wallet_address,
  name,
  nickname,
  user_Type
) => {
  try {
    let description = '';
    switch (user_Type) {
      case 'user':
        description = '---Events---'; // 내용 수정 논의 필요
        break;
      case 'admin':
        description = 'Administrator'; // 내용 수정 논의 필요
        break;
      default:
        return { success: false, message: '잘못된 사용자 타입입니다.' };
    }

    const transaction = await dnftContract
      .connect(signer)
      .mintDNFT(wallet_address, name, description, user_Type);
    await transaction.wait();

    const eventFilter = dnftContract.filters.Transfer(null, wallet_address);
    const events = await dnftContract.queryFilter(eventFilter);
    const tokenId = Number(events[0].args.tokenId);

    const tokenUri = await dnftContract.connect(signer).tokenURI(tokenId);
    const dnftLevel = await dnftContract.connect(signer).dnftLevel(tokenId); // @todo dnftData 함수로 한 번에 불러올 수 있음

    // dnft 정보 저장
    const dnftData = new DnftModel({
      token_id: tokenId,
      user_id: user_id,
      name: nickname,
      description: description,
      token_uri: tokenUri,
      dnft_level: dnftLevel,
    });

    const result = await dnftData.save();
    if (!result) {
      return { success: false, message: 'dnft 데이터 저장 실패' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
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
  try {
    //업데이트는 token owner만 가능하다

    const user = await UserModel.findOne({ email: email });
    if (!user) return { success: false, message: '데이터 요청 실패' };
    // const ownerPK = user.wallet.private_key;
    // let owner =  new ethers.Wallet(ownerPK, provider);
    const dnft = await DnftModel.findOne({ user_id: user._id });
    if (!dnft) return { success: false, message: '데이터 요청 실패' };
    const transaction = await dnftContract
      .connect(signer)
      .updateName(dnft.token_id, newName);
    await transaction.wait();
    if (transaction) {
      dnft.name = newName;
      const result = await dnft.save();
      if (!result) return { success: false };
      else return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * DNFT description 변경 요청(새로운 뱃지를 얻었을 때 불러서 사용!!!)
 * @param {string} email
 * @param {string} newDescription
 * @returns 성공여부
 */
const updateDescription = async (userId, newEvent) => {
  try {
    // const ownerPK = user.wallet.private_key;
    // let owner =  new ethers.Wallet(ownerPK, provider);
    const dnft = await DnftModel.findOne({ user_id: userId });
    if (!dnft) return { success: false, message: '데이터 요청 실패' };

    const currentDescription = await dnftContract
      .connect(signer)
      .dnftDescription(dnft.token_id);

    const newDescription = `${currentDescription}\n${newEvent}`;

    const transaction = await dnftContract
      .connect(signer)
      .updateDescription(dnft.token_id, newDescription);
    if (transaction) {
      dnft.description = newDescription;
      const result = await dnft.save();
      if (!result) return { success: false };
      else return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * DNFT Data 요청
 * @param {string} email
 * @returns 사용자 DNFT 데이터
 */
const userDnftData = async (userId) => {
  try {
    // 사용자 정보 조회
    const user = await UserModel.findById(userId); // @todo 아래 내용 확인 후 수정
    if (!user) return { success: false, message: '데이터 요청 실패' };

    // 사용자 DNFT 정보 조회
    const dnft = await DnftModel.findOne({ user_id: userId });
    if (!dnft) return { success: false, message: '데이터 요청 실패' };

    return {
      success: true,
      data: {
        owner: user.nickname, // @todo 사용하는 곳이 있는지 확인 필요
        token_id: dnft.token_id,
        name: dnft.name,
        image_url: dnft.token_uri,
        description: dnft.description,
        dnft_level: dnft.dnft_level, // 2023.08.06 - leejisu 수정함
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * DNFT 업그레이드 요청
 * @param {string} user_id
 * @returns 성공여부
 */
const upgradeDnft = async (user_id) => {
  try {
    // dfnt 정보 조회
    const dnft = await DnftModel.findOne({ user_id: user_id });
    if (!dnft) return { success: false, message: '데이터 요청 실패' };

    const tokenId = dnft.token_id;
    const gasPrice = ethers.utils.parseUnits('10', 'gwei');
    const gasLimit = 500000;
    const transaction = await dnftContract
      .connect(signer)
      .upgradeDNFT(tokenId, { gasPrice, gasLimit });
    await transaction.wait();

    if (transaction) {
      const dnftURI = await dnftContract.tokenURI(tokenId);
      dnft.token_uri = dnftURI;
      const dnftLevel = await dnftContract.dnftLevel(tokenId);
      dnft.dnft_level = dnftLevel;
      const result = await dnft.save();
      if (!result) return { success: false };
      else return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

module.exports = {
  setBadge,
  createDNFT,
  updateName,
  updateDescription,
  userDnftData,
  upgradeDnft,
};
