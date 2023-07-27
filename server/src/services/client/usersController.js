const { findOne } = require('../../models/Badges');
const smtpTransport = require('../../loaders/email');
const config = require('../../config/index');
const MailModel = require('../../models/Mails');
const UserModel = require('../../models/Users');
const DNFTModel = require('../../models/DNFTs');
const BadgeModel = require('../../models/Badges');
const PostModel = require('../../models/Posts');
const EventModel = require('../../models/Events');

/**
 * 랜덤 인증코드 생성 (min ~ max)
 * @param {number} min
 * @param {number} max
 * @returns {number} 인증코드(6자리)
 */
const generateRandomCode = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

/**
 * 이메일 인증 데이터 저장
 * @param {string} email
 * @param {number} authCode
 * @returns 성공여부
 */
const saveAuthCode = async (email, authCode) => {
  try {
    const mailData = new MailModel({
      email: email,
      code: authCode,
      expiry: Date.now() + 1000 * 60 * 10, // 10분
    });
    const result = await mailData.save(); // 데이터 저장
    return result._id;
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 인증 이메일 전송
 * @param {string} email
 * @returns 성공여부
 */
const sendEmail = async (email) => {
  try {
    const authCode = generateRandomCode(111111, 999999); // 인증코드 생성
    const mailOptions = {
      from: config.mail.adminEmail,
      to: email,
      subject: '[Clean Mile]인증 관련 이메일 입니다',
      text: `오른쪽 숫자 6자리를 입력해주세요 : ${authCode}`,
    };

    const mailSaveId = await saveAuthCode(email, authCode); // 인증코드 DB에 저장
    // 메일 전송
    await smtpTransport
      .sendMail(mailOptions)
      .then(() => {
        smtpTransport.close(); // 메일 전송 종료
      })
      .catch(async (err) => {
        // 메일 전송 실패시 DB에 저장된 인증코드 삭제
        await MailModel.deleteOne({ _id: mailSaveId });
        console.error('Error:', err);
        throw Error(err);
      });

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이메일 중복 체크
 * @param {string} email
 * @returns 중복 여부 확인
 */
const checkEmail = async (email) => {
  try {
    const result = await UserModel.findOne({ email: email });
    if (!result) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 닉네임 중복 체크
 * @param {string} nickname
 * @returns 중복 여부
 */
const checkNickName = async (nickname) => {
  try {
    const result = await UserModel.findOne({ nickname: nickname });
    if (!result) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이메일 인증 코드 확인
 * @param {string} email
 * @param {*} code
 * @returns 일치 여부
 */
const checkEmailAuthCode = async (email, code) => {
  try {
    const emailData = await MailModel.findOne({ email: email });
    if (
      emailData &&
      Number(emailData.code) === Number(code) &&
      emailData.expiry >= Date.now()
    ) {
      await emailData.updateOne({ authenticated: true });
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 정보 저장
 * @param {*} userData
 * @returns 저장 여부
 */
const saveUserData = async (userData) => {
  try {
    const saveUserData = new UserModel({
      email: userData.email,
      name: userData.name,
      phone_number: userData.phone_number,
      hashed_pw: userData.password,
      nickname: userData.nickname,
      social_provider: userData.social_provider,
      wallet: {
        address: userData.wallet_address,
      },
    });
    const result = await saveUserData.save();
    if (!result) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이메일을 이용한 사용자 정보 조회
 * @param {string} email
 * @returns 조회 결과
 */
const findUserEmail = async (email) => {
  try {
    const result = await UserModel.findOne({ email: email });
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 닉네임을 이용한 사용자 정보 조회
 * @param {*} nickname
 * @returns
 */
const findUserNickname = async (nickname) => {
  try {
    const result = await UserModel.findOne({ nickname: nickname });
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 DNFT 정보 조회
 * @param {*} userId
 * @returns 조회 결과
 */
const findUserDnft = async (userId) => {
  try {
    const result = await DNFTModel.find({ user_id: userId });
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * @todo 컨트랙트 개발 후 수정 필요
 * 사용자 뱃지 정보 조회
 * @param {*} userId
 * @returns 조회 결과
 */
const findUserBadge = async (userId) => {
  try {
    // 뱃지 정보 조회
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 게시글 조회
 * @param {*} userId
 * @returns 조회 결과 (array)
 */
const findUserPost = async (userId) => {
  try {
    const result = await PostModel.find({ user_id: userId });
    if (result.length === 0) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 참여 이벤트 조회
 * @param {*} userId
 * @returns 조회 결과 (array)
 */
const findUserEvent = async (userId) => {
  try {
    const result = await EventModel.find({
      [`users.${userId}`]: { $exists: true },
    });
    if (result.length === 0) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 닉네임 변경
 * @param {string} email
 * @param {string} nickname
 * @returns 성공여부
 */
const chgNickname = async (email, nickname) => {
  try {
    const userData = await UserModel.findOne({ email: email });
    if (!userData) {
      return { success: false };
    } else {
      userData.nickname = nickname;
      const result = await userData.save();
      return { success: true, data: result.nickname };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 배너 이미지 변경
 * @param {*} email
 * @param {*} bannerUrl
 * @returns 성공여부
 */
const chgBanner = async (email, bannerUrl) => {
  try {
    const userData = await UserModel.findOne({ email: email });
    if (!userData) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    userData.banner_img_url = bannerUrl;
    const result = await userData.save();
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result.banner_img_url };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  checkEmail,
  sendEmail,
  checkNickName,
  checkEmailAuthCode,
  saveUserData,
  findUserEmail,
  findUserNickname,
  chgNickname,
  findUserDnft,
  findUserBadge,
  findUserPost,
  findUserEvent,
  chgBanner,
};
