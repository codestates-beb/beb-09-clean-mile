const { ethers } = require("ethers");
const config = require("../../config");
const badgeABI = require("../../contracts/CleanMileBadge.sol/CleanMileBadge.json").abi;
const BadgeModel = require("../../models/Badges");
const UserModel = require("../../models/Users");
const eventModel = require("../../models/Events");
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = provider.getSigner(config.SENDER);
const badgeContract = new ethers.Contract(config.Badge_ADDRESS, badgeABI, signer);
const {NFTStorage} = require("nft.storage");



/**
 * 이미지 blob 처리
 * @param {string} imageUrl 
 * @returns 
 */
const blobImage = async (imageUrl) => {
  const r = await fetch(imageUrl)
  if (!r.ok) {
    throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`)
  }
  return r.blob()
}

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
const createBadge = async (address, name, description, imageUrl, badgeType, amount, eventTitle) => {
  try{
    const image = await blobImage(imageUrl);

    const API_KEY = config.NFT_STORAGE_API_KEY;

    const badgeMetaData = {
      name : name,
      description: description,
      image: image
    }

    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client.store(nft);

    console.log('NFT data stored!')
    console.log('Metadata URI: ', metadata.url)

    const transaction = await badgeContract.connect(signer).mintBadge(address, badgeType, amount, metadata.url);
    transaction.wait();

    const eventId = await eventModel.findOne({title: eventTitle})._id;

    if (transaction && eventId){
      const tokenId = transaction.events[0].args.tokenId.toString();
      const badgeData = new BadgeModel({
        badge_id: tokenId,
        name: name,
        description: description,
        type: badgeType,
        image_url: imageUrl,
        event_id: eventId,
        initial_quantity: amount,
        remain_quantity: amount,
        owners: []
      })
    }else{
      return {success: false};
    }
  } catch(err) {
    console.error("Error:", err);
    throw new Error(err);
  }
}