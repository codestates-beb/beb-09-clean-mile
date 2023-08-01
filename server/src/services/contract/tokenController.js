const { ethers } = require("ethers");
const config = require("../../config/config.json");
const tokenABI = require("../../contracts/CleanMileToken.sol/CleanMileToken.json").abi;
const UserModel = require("../../models/Users");
const EventEntry = require("../../models/EventEntries");
const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
const signer = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider);
const tokenContract = new ethers.Contract(config.TOKEN_ADDRESS, tokenABI, signer);

// 토큰 전송 권한 부여, 이건 다른 사람이 토큰을 전송할 수 있게 해주는게 아니라 다른 사람에게 전송할 수 있게 해주는 권한 부여이다. approve 후 allowance 확인하기
// 토큰 전송 transferFrom으로 할 것이냐? transfer로 할 것이냐?
// 토큰을 전송해주고 event에 is_review_rewarded를 true로 변환해주어야 한다

const tokenReward = async (userId, eventId) => {
    const amount =3;
    let user = await UserModel.findById(userId);
    if (!user) return ({success: false, message: '사용자를 찾을 수 없습니다'});

    let userEntry = await EventEntry.findOne({user_id: userId, event_id: eventId});
    if (!userEntry) return ({success: false, message: '사용자를 찾을 수 없습니다'});
    if (userEntry.is_token_rewarded) return ({success: false, message: '해당 행사에 대한 보상이 이미 지급 되었습니다'});
    const address = user.wallet.address;

    const balance = await tokenContract.balanceOf(config.SENDER);

    console.log(balance);

    const gasPrice = ethers.utils.parseUnits('50', 'gwei');
    // const feeData = await provider.getFeeData();
    const gasLimit =  10000000;

    if (amount > balance){
        return({success: false, message: "송신자의 잔액이 부족합니다."});
    }

    const allowance = await tokenContract.allowance(config.SENDER, address);
    if (amount > allowance){
        const approveTransaction = await tokenContract.connect(signer).approve(address, amount,{gasPrice,gasLimit});
        approveTransaction.wait();

        if (!approveTransaction){
            return({success: false, message: "전송 권한 부여 실패."});
        }
    }

    const transferTransaction = await tokenContract.connect(signer).transferFrom(config.SENDER, address, amount,{gasPrice,gasLimit});
    transferTransaction.wait();

    if (!transferTransaction){
        return ({success: false, message: "토큰 전송에 실패 했습니다."});
    }

    user.wallet.token_amount += amount;
    user.save();

    userEntry.is_token_rewarded = true
    userEntry.save();

    return({success: true});
}   

module.exports = {
    tokenReward
}