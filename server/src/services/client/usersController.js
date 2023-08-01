const smtpTransport = require('../../loaders/email');
const config = require('../../config/index');
const calcPagination = require('../../utils/calcPagination');
const getKorDate = require('../../utils/getKorDateUtil');
const MailModel = require('../../models/Mails');
const UserModel = require('../../models/Users');
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
 * @returns 저장된 이메일 인증 데이터의 _id
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
 * @returns
 */
const sendEmail = async (email) => {
  try {
    const authCode = generateRandomCode(111111, 999999); // 인증코드 생성
    const mailOptions = {
      from: config.mail.adminEmail,
      to: email,
      subject: '[Clean Mile]인증 이메일 입니다.',
      text: `오른쪽 숫자 6자리를 입력해주세요 : ${authCode}`,
    };

    const mailSaveId = await saveAuthCode(email, authCode); // 인증코드 DB에 저장

    // 메일 전송
    await smtpTransport
      .sendMail(mailOptions)
      .then(() => {
        // 메일 전송 종료
        smtpTransport.close();
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
 * @returns 중복 여부 (boolean)
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
 * @returns 중복 여부 (boolean)
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
 * @returns 일치 여부 (boolean)
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
 * @returns 저장 여부 (boolean)
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
 * pw를 제거한 사용자 정보 조회
 * @param {*} nickname
 * @returns 성공 여부 (boolean), 조회 결과
 */
const getUser = async (user_id) => {
  try {
    const user = await UserModel.findById(user_id).select('-__v -hashed_pw');
    if (!user) {
      return { success: false };
    }

    return { success: true, data: user };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * General, Review Posts List 조회
 * @param {*} userId
 * @param {*} page
 * @param {*} limit
 * @returns Review or General Posts List
 */
const getPosts = async (userId, page, limit) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    let query = { user_id: userId };
    // 게시글 리스트 조회 (Notice, General)
    const posts = await PostModel.find(query)
      .populate('user_id', 'nickname')
      .select('-__v -view.viewers') // 필요없는 필드 제외
      .sort({ created_at: -1 })
      .skip(skip) // 스킵
      .limit(limit);

    // 결과가 없는 경우
    if (posts.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await PostModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return { data: posts, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 참여 목록 조회
 * @param {*} userId
 * @param {*} limit
 * @param {*} last_id
 * @returns 조회 결과, last_id
 */
const getEvents = async (userId, page, limit) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    // 사용자별 참여한 이벤트 목록 조회
    const eventEntries = await EventEntryModel.find({ user_id: userId });

    // 조회한 이벤트의 ID들을 배열로 추출
    const eventIds = eventEntries.map((entry) => entry.event_id);

    // 이벤트 ID들을 이용하여 event 컬렉션에서 해당 이벤트들을 조회
    const events = await EventModel.find({ _id: { $in: eventIds } })
      .populate('host_id', ['name', 'organization'])
      .select('-__v -view.viewers')
      .sort({ created_at: -1 })
      .skip(skip) // 스킵
      .limit(limit);

    // 결과가 없는 경우
    if (events.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await EventModel.countDocuments({ _id: { $in: eventIds } });
    const paginationResult = await calcPagination(total, limit, page);

    return { data: events, pagination: paginationResult };
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
const changeNickname = async (email, nickname) => {
  try {
    const userData = await UserModel.findOne({ email: email });
    if (!userData) {
      return { success: false };
    } else {
      userData.nickname = nickname;
      userData.updated_at = getKorDate();
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
const changeBanner = async (email, bannerUrl) => {
  try {
    const userData = await UserModel.findOne({ email: email });
    if (!userData) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    userData.banner_img_url = bannerUrl;
    userData.updated_at = getKorDate();
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
  getUser,
  changeNickname,
  getPosts,
  getEvents,
  changeBanner,
  setTokenCookie,
};
