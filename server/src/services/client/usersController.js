const smtpTransport = require('../../loaders/email');
const config = require('../../config/index');
const calcPagination = require('../../utils/calcPagination');
const MailModel = require('../../models/Mails');
const UserModel = require('../../models/Users');
const DNFTModel = require('../../models/DNFTs');
const BadgeModel = require('../../models/Badges');
const PostModel = require('../../models/Posts');
const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');

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
    // 기존에 존재하는 이메일인지 확인
    const chkEmailData = await MailModel.find({ email: email });
    if (chkEmailData.length === 0) {
      const mailData = new MailModel({
        email: email,
        code: authCode,
        expiry: Date.now() + 1000 * 60 * 10, // 10분
      });
      const result = await mailData.save(); // 데이터 저장
      return result._id;
    } else {
      await MailModel.updateOne(
        { email: email },
        {
          code: authCode,
          expiry: Date.now() + 1000 * 60 * 10,
          authenticated: false,
        }
      );
      return chkEmailData[0]._id;
    }
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
 * 커서 기반 리스트 데이터 조회
 * @param {*} model
 * @param {*} userId
 * @param {*} page
 * @param {*} last_id
 * @param {*} limit
 * @returns
 */
const findUserContent = async (model, userId, page, last_id, limit) => {
  try {
    let query = { user_id: userId };

    const total = await model.countDocuments(query);

    // last_id가 존재하면, 마지막 id 이후의 문서 조회
    if (last_id) {
      query._id = { $gt: last_id };
    }

    let cursor;
    if (model === PostModel) {
      cursor = model.find(query).sort({ created_at: -1 }).limit(limit);
    } else if (model === EventEntryModel) {
      cursor = model
        .find(query)
        .populate('event_id')
        .sort({ created_at: -1 })
        .limit(limit);
    }

    const result = await cursor.exec();
    if (!result.length) {
      // 더이상 결과가 없는 경우
      return { data: null, last_id: null };
    }

    // 마지막 문서의 ID를 가져옴
    const lastId = result[result.length - 1]._id.toString();

    const paginationResult = await calcPagination(total, limit, page);

    return { data: result, last_id: lastId, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 본인 프로필 조회
 * @param {*} userId
 * @param {*} post_page
 * @param {*} post_last_id
 * @param {*} event_page
 * @param {*} event_last_id
 * @param {*} limit
 * @returns
 */
const findMyUserData = async (
  userId,
  post_page,
  post_last_id,
  event_page,
  event_last_id,
  limit
) => {
  try {
    // 게시글 목록 조회
    const postResult = await findUserContent(
      PostModel,
      userId,
      post_page,
      post_last_id,
      limit
    );
    // 참여한 이벤트 목록 조회
    const eventResult = await findUserContent(
      EventEntryModel,
      userId,
      event_page,
      event_last_id,
      limit
    );

    const result = {
      post: postResult,
      event: eventResult,
    };

    return { success: true, data: result };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 다른 사람의 프로필 조회
 * @param {*} userId
 * @param {*} post_page
 * @param {*} post_last_id
 * @param {*} event_page
 * @param {*} event_last_id
 * @param {*} limit
 * @returns
 */
const findOtherUserData = async (userId, post_page, post_last_id, limit) => {
  try {
    const postResult = await findUserContent(
      PostModel,
      userId,
      post_page,
      post_last_id,
      limit
    );

    const result = {
      post: postResult,
    };
    return { success: true, data: result };
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
      userData.updated_at = Date.now();
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
    userData.updated_at = Date.now();
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

/**
 * 토큰을 쿠키에 저장
 * @param {*} res
 * @param {*} accessToken
 * @param {*} refreshToken
 */
const setTokenCookie = async (res, accessToken, refreshToken) => {
  // access token을 쿠키에 저장
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // js에서 접근 가능
    secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
    sameSite: 'strict', // CSRF와 같은 공격을 방지
    maxAge: 1000 * 60 * 15, // 15분 (밀리초 단위)
  });

  // refresh token을 쿠키에 저장
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // js에서 접근 불가능
    secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
    sameSite: 'strict', // CSRF와 같은 공격을 방지
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 (밀리초 단위)
  });
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
  findMyUserData,
  findOtherUserData,
  chgBanner,
  findUserContent,
  setTokenCookie,
};
