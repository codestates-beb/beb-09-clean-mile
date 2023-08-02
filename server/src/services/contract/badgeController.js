const { ethers } = require('ethers');
const config = require('../../config/config.json');
const badgeABI =
  require('../../contracts/CleanMileBadge.sol/CleanMileBadge.json').abi;
const BadgeModel = require('../../models/Badges');
const UserModel = require('../../models/Users');
const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider);
const badgeContract = new ethers.Contract(
  config.BADGE_ADDRESS,
  badgeABI,
  signer
);
const pinataSDK = require('@pinata/sdk');

/**
 * 뱃지 발행
 * @param {string} address
 * @param {string} name
 * @param {string} description
 * @param {Number} badgeType
 * @param {string} imageUrl
 * @param {Number} amount
 * @param {string} eventTitle
 * @returns 성공여부
 */
// 1. 정보들 Ipfs에 업데이트
// 2. 뱃지 민팅
// 3. 성공한다면 뱃지 데이터들 데이터 베이스에 저장
/**
 * @Author: Lee jisu
 * @Date: 2023-08-02
 * @Desc: event_id를 title로 찾는 것이 아닌 클라이언트로부터 받아서 뱃지를 생성하도록 수정
 */
const createBadge = async (
  name,
  description,
  imageUrl,
  badgeType,
  amount,
  event_id
) => {
  try {
    const pinata = new pinataSDK(config.PINATA_API, config.PINATA_SECRET);

    // 이미지 파일 pinata에 업로드
    // const photoResult = await pinata.pinJSONToIPFS({ image_url: imageUrl });
    // console.log(
    //   "Photo uploaded successfully. IPFS Hash:",
    //   photoResult.IpfsHash
    // );

    // NFT 메타 데이터 생성 및 Pinata에 업로드
    const nftMetadata = {
      name: name,
      description: description,
      image_url: imageUrl,
    };

    const metadataResult = await pinata.pinJSONToIPFS(nftMetadata); //pinata에 업로드. -> 완료시 아래 코드에서 반환된 IpfsHash 출력.
    console.log(
      'Metadata uploaded successfully. IPFS Hash:',
      metadataResult.IpfsHash
    );

    const tokenURI = `ifps://${metadataResult.IpfsHash}`;

    const transaction = await badgeContract
      .connect(signer)
      .mintBadge(config.SENDER, badgeType, amount, tokenURI);
    transaction.wait();
    const badgeScore = [1, 5, 10];

    // const event = await EventModel.findOne({ title: eventTitle });
    // if (!event) return { success: false, message: '데이터 요청 실패' };
    // const eventId = event._id;

    if (transaction && event_id) {
      const badgeId = await BadgeModel.countDocuments();
      const badgeData = new BadgeModel({
        badge_id: badgeId,
        name: name,
        description: description,
        type: badgeType,
        score: badgeScore[badgeType],
        token_uri: tokenURI,
        image_url: imageUrl,
        event_id: event_id,
        initial_quantity: amount,
        remain_quantity: amount,
        owners: [],
      });
      const result = await badgeData.save();
      if (result) return { success: true };
      else return { success: false };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * 한 이벤트에 대한 참여 인증 완료자들 반환
 * @param {string} eventId
 * @returns 성공여부, 참여 인증자들(Array)
 */
const isConfirmedUser = async (eventId) => {
  try {
    const confirmedUser = [];
    const entryList = await EventEntryModel.find({ event_id: eventId });
    if (!entryList) return { success: false, message: '데이터 요청 실패' };
    for (const entry of entryList) {
      if (entry.is_confirmed) confirmedUser.push(entry.user_id);
    }
    return { success: true, data: confirmedUser };
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

// recipients를 인증완료한 user들의 _id를 배열로 받는다.
// 참여자들에게 badge를 뿌려준다.
// users의 is_nft_issued를 true로 바꿔준다.
// user의 wallet에 있는 뱃지 수량을 1씩 더해준다.
// user의 wallet에 있는 총 뱃지 수량도 뱃지 점수 만큼 더 해준다. (체인에서는 컨트랙트에 따라 알아서 저장)
/**
 * 한번에 여러사람에 동일한 수량의 동일한 토큰 전송
 * @param {string []} recipients
 * @param {string} eventTitle
 * @returns 성공여부
 */
const transferBadges = async (recipients, eventId) => {
  try {
    const amount = 1;

    // const event = await EventModel.findById(eventId);

    const badge = await BadgeModel.findOne({ event_id: eventId });
    if (!badge) return { success: false, message: '데이터 요청 실페' };
    const tokenId = badge.badge_id;
    let recipientsAddress = [];
    for (const id of recipients) {
      let user = await UserModel.findById(id);
      if (!user) return { success: false, message: '데이터 요청 실패' };
      let address = user.wallet.address;
      recipientsAddress.push(address);
    }

    const gasPrice = ethers.utils.parseUnits('50', 'gwei');
    // const feeData = await provider.getFeeData();
    // const gasLimit =  ethers.utils.formatUnits(feeData.maxFeePerGas, "wei");
    const gasLimit = 10000000;

    const transaction = await badgeContract
      .connect(signer)
      .transferBadges(config.SENDER, recipientsAddress, tokenId, amount, {
        gasPrice,
        gasLimit,
      });
    console.log('실핼 중...');
    transaction.wait();

    const badgeScore = [1, 5, 10];

    //전송한 사람들의 is_nft_issued를 true로 바꿔줘야 한다.
    if (transaction) {
      badge.remain_quantity -= recipients.length;
      for (let i = 0; i < recipients.length; i++) {
        let user = await EventEntryModel.findOne({
          event_id: eventId,
          user_id: recipients[i],
        });
        if (!user) return { success: false, message: '데이터 요청 실패' };
        user.is_nft_issued = true;
        await user.save();

        let userInfo = await UserModel.findById(recipients[i]);
        if (!userInfo) return { success: false, message: '데이터 요청 실패' };
        userInfo.wallet.badge_amount += 1;
        userInfo.wallet.total_badge_score += badgeScore[badge.type];
        await userInfo.save();
        badge.owners.push(recipients[i]);
        await badge.save();
      }
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

/**
 * 한번에 한사람에게 하나의 토큰 전송
 * @param {string} recipient
 * @param {string} eventTitle
 * @returns 성공여부
 */
const transferBadge = async (recipient, eventId) => {
  try {
    const sender = config.SENDER;
    const amount = 1;

    // const event = await EventModel.findById(eventId);

    const badge = await BadgeModel.findOne({ event_id: eventId });
    if (!badge) return { success: false, message: '데이터 요청 실패' };
    const tokenId = badge.badge_id;

    const recipientInfo = await UserModel.findById(recipient);
    if (!recipientInfo) return { success: false, message: '데이터 요청 실패' };
    const recipientAddress = recipientInfo.wallet.address;

    const transaction = await badgeContract
      .connect(signer)
      .transferBadge(sender, recipientAddress, tokenId, amount);
    transaction.wait();

    const badgeScore = [1, 5, 10];

    if (transaction) {
      badge.remain_quantity -= 1;
      let user = await EventEntryModel.findOne({
        event_id: eventId,
        user_id: recipient,
      });
      if (!user) return { success: false, message: '데이터 요청 실패' };
      user.is_nft_issued = true;
      await user.save();

      let userInfo = await UserModel.findById(recipient);
      if (!userInfo) return { success: false, message: '데이터 요청 실패' };
      userInfo.wallet.badge_amount += 1;
      userInfo.wallet.total_badge_score += badgeScore[badge.type];

      await userInfo.save();

      badge.owners.push(recipient);
      await badge.save();
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};

const userBadges = async (userId) => {
  try {
    const userEvents = await EventEntryModel.find({ user_id: userId });
    if (!userEvents) return { success: false, message: '데이터 요청 실패' };
    let confirmedEventList = [];
    for (const userEvent of userEvents) {
      if (userEvent.is_nft_issued) {
        confirmedEventList.push(userEvent.event_id);
      }
    }
    let badgeList = [];
    const badgeType = ['bronze', 'silver', 'gold'];
    for (const eventId of confirmedEventList) {
      const badge = await BadgeModel.findOne({ event_id: eventId });
      if (!badge) continue;
      badgeList.push({
        name: badge.name,
        description: badge.description,
        image: badge.image_url,
        badge_type: badgeType[badge.type],
      });
    }
    return { success: true, data: badgeList };
  } catch (err) {
    console.error('Error:', err);
    throw new Error(err);
  }
};
module.exports = {
  createBadge,
  transferBadge,
  transferBadges,
  userBadges,
  isConfirmedUser,
};
