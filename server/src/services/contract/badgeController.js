const { ethers } = require("ethers");
const config = require("../../config/config.json");
const badgeABI = require("../../contracts/CleanMileBadge.sol/CleanMileBadge.json").abi;
const BadgeModel = require("../../models/Badges");
const UserModel = require("../../models/Users");
const EventModel = require("../../models/Events");
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider);
const badgeContract = new ethers.Contract(config.BADGE_ADDRESS, badgeABI, signer);
const pinataSDK = require("@pinata/sdk");

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
const createBadge = async ( name, description, imageUrl, badgeType, amount, eventTitle) => {
  try{

    const pinata = new pinataSDK(config.PINATA_API, config.PINATA_SECRET);

    // 이미지 파일 pinata에 업로드
    const photoResult = await pinata.pinJSONToIPFS({ image_url: imageUrl });
    console.log(
      "Photo uploaded successfully. IPFS Hash:",
      photoResult.IpfsHash
    );

    // NFT 메타 데이터 생성 및 Pinata에 업로드
    const nftMetadata = {
      name: name,
      description: description,
      image_url: `ipfs://${photoResult.IpfsHash}`
    };

    const metadataResult = await pinata.pinJSONToIPFS(nftMetadata); //pinata에 업로드. -> 완료시 아래 코드에서 반환된 IpfsHash 출력.
    console.log(
      "Metadata uploaded successfully. IPFS Hash:",
      metadataResult.IpfsHash
    );

    const tokenURI = `ifps://${metadataResult.IpfsHash}`;

    const transaction = await badgeContract.connect(signer).mintBadge(config.SENDER , badgeType , amount, tokenURI);
    transaction.wait();
    const badgeScore = [1,5,10];

    const event = await EventModel.findOne({title: eventTitle});
    const eventId = event._id;
    console.log(eventId);

    if (transaction && eventId){
      const badgeLength = await BadgeModel.find();
      const badgeId = badgeLength.length;
      const badgeData = new BadgeModel({
        badge_id: badgeId,
        name: name,
        description: description,
        type: badgeType,
        score: badgeScore[badgeType],
        image_url: `ipfs://${photoResult.IpfsHash}`,
        event_id: eventId,
        initial_quantity: amount,
        remain_quantity: amount,
        owners: []
      })
      const result = await badgeData.save();
      if (result) return {success: true};
      else return {success: false};
    }else{
      return {success: false};
    }
  } catch(err) {
    console.error("Error:", err);
    throw new Error(err);
  }
}


// recipients를 인증완료한 user들의 _id를 배열로 받는다.
// 참여자들에게 badge를 뿌려준다
// users의 is_nft_issued를 true로 바꿔준다.
// user의 wallet에 있는 뱃지 수량을 1씩 더해준다.
// user의 wallet에 있는 총 뱃지 수량도 뱃지 점수 만큼 더 해준다. (체인에서는 컨트랙트에 따라 알아서 저장)
const transferBadges = async (recipients, eventTitle) => {
  try{
  const amount = 1;

  const event = await EventModel.findOne({title: eventTitle});
  const eventId = event._id;

  const badge = await BadgeModel.findOne({event_id: eventId});
  const tokenId = badge.badge_id;
  let recipientsAddress = [];
  for (const id of recipients) {
    let user = await UserModel.findById(id);
    let address = user.wallet.address;
    recipientsAddress.push(address);
  }

  console.log(recipientsAddress);

  const gasPrice = ethers.utils.parseUnits('50', 'gwei');
  const gasLimit = 1000000;
  
  const transaction = await badgeContract.connect(signer).transferBadges(config.SENDER, recipientsAddress, tokenId, amount,{gasPrice, gasLimit});
  transaction.wait();
  //전송한 사람들의 is_nft_issued를 true로 바꿔줘야 한다.
  
  if (transaction){
    badge.remain_quantity -= recipients.length;
    for (let i=0; i<recipients.length; i++){
      let user = event.users.get(recipients[i]);
      await user.save();
      user.is_nft_issued = true;    

      let userInfo = await UserModel.findById(recipients[i]);
      userInfo.wallet.badge_amount +=1;
      userInfo.wallet.total_badge_score += badge.score;
      await userInfo.save();
      badge.owners.push(recipients[i]);
      await badge.save();
      }
      
     
      
      return {success : true};
    } else {
      return {success : false};
    }
  } catch(err){
    console.error("Error:", err);
    throw new Error(err);
  }
}

const transferBadge = async (recipient, eventTitle) => {
  try{
    const sender = config.SENDER;
    const amount = 1;
  
    const event = await EventModel.findOne({title: eventTitle});
    const eventId = event._id;
  
    const badge = await BadgeModel.findOne({event_id: eventId});
    const tokenId = badge.badge_id;

    const recipientInfo = await UserModel.findById(recipient);
    const recipientAddress = recipient.wallet.address;
  
    const transaction = await badgeContract.connect(signer).transferBadges(sender, recipientAddress, tokenId, amount);
    transaction.wait();
  
    if (transaction){
      badge.remain_quantity -= 1
      let user = event.users.get(recipient);

      user.is_nft_issued = true;
      await user.save();

      let userInfo = await UserModel.findById(recipient);
      userInfo.wallet.badge_amount +=1;
      userInfo.wallet.total_badge_score += badge.score;

      await userInfo.save();

      badge.owners.push(recipient);
      await badge.save()
      return {success : true};   
      } else {
        return {success : false};
      }
    } catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
}

module.exports = {
  createBadge,
  transferBadge,
  transferBadges
}