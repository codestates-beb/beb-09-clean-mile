const Router = require('express');
const jwt = require('jsonwebtoken');
const jwtController = require('../../../services/jwtController');
const isAuth = require('../../middlewares/isAuth');
const upload = require('../../../loaders/s3');
const {
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
} = require('../../../services/client/usersController');
const route = Router();

module.exports = (app) => {
  app.use('/users', route);

  /**
   * @route POST /users/check-email
   * @group users - 사용자 관련
   * @summary 이메일 인증 코드 전송(이메일 중복 체크 포함)
   */
  route.post('/check-email', upload.single('email'), async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: '이메일을 입력해주세요.',
        });
      }

      // 이메일 중복 체크
      const checkEmailResult = await checkEmail(email);
      if (!checkEmailResult.success) {
        return res.status(400).json({
          success: false,
          message: '이미 가입된 이메일입니다.',
        });
      }

      // 인증 이메일 전송
      const sendEmailResult = await sendEmail(email);
      if (!sendEmailResult.success) {
        return res.status(400).json({
          success: false,
          message: '인증 이메일 전송에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '인증 이메일 전송에 성공했습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/validate-nickname
   * @group users - 사용자 관련
   * @summary 닉네임 중복 체크
   */
  route.post('/validate-nickname', upload.single('email'), async (req, res) => {
    try {
      const nickname = req.body.nickname;
      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: '닉네임을 입력해주세요.',
        });
      }

      // 닉네임 중복 체크
      const checkNickNameResult = await checkNickName(nickname);
      if (!checkNickNameResult.success) {
        return res.status(400).json({
          success: false,
          message: '이미 사용중인 닉네임입니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '사용 가능한 닉네임입니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @todo 사용자 dnft 데이터 추가 필요
   * @route POST /users/signup
   * @group users - 사용자 관련
   * @summary 회원가입 (이메일 인증 코드 검증 포함)
   */
  route.post('/signup', upload.none(), async (req, res) => {
    try {
      const userData = req.body;
      if (
        !userData.email ||
        !userData.name ||
        !userData.phone_number ||
        !userData.password ||
        !userData.nickname ||
        !userData.wallet_address ||
        !userData.social_provider ||
        !userData.email_verification_code
      ) {
        return res.status(400).json({
          success: false,
          message: '필수 정보를 입력해주세요.',
        });
      }

      // 사용자 정보 저장
      const saveDataResult = await saveUserData(userData);
      if (!saveDataResult.success) {
        return res.status(400).json({
          success: false,
          message: '사용자 정보 저장에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '회원가입에 성공했습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/verify-emailCode
   * @group users - 사용자 관련
   * @summary 이메일 인증 코드 확인
   */
  route.post('/verify-emailCode', upload.none(), async (req, res) => {
    try {
      const { email, email_verification_code } = req.body;
      if (!email || !email_verification_code) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 이메일 인증 코드 검증
      const chkMailAuthCode = await checkEmailAuthCode(
        email,
        email_verification_code
      );
      if (!chkMailAuthCode.success) {
        return res.status(400).json({
          success: false,
          message: '이메일 인증에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '이메일 인증에 성공했습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/login
   * @group users - 사용자 관련
   * @summary 로그인
   */
  route.post('/login', upload.none(), async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '이메일 또는 비밀번호를 입력해주세요.',
        });
      }

      // 사용자 이메일로 정보 조회
      const userResult = await findUserEmail(email);
      if (!userResult.success) {
        return res.status(400).json({
          success: false,
          message: '가입되지 않은 이메일입니다.',
        });
      }

      // 비밀번호 검증
      const isPwMatch = await userResult.data.comparePassword(password);
      if (!isPwMatch) {
        return res.status(400).json({
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        });
      }

      // 토큰 생성
      const accessToken = jwtController.sign(email);
      const refreshToken = jwtController.refresh(email);

      // 쿠키에 토큰 저장
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // js에서 접근 가능
        secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지 (None, Lax, Strict)
        maxAge: 1000 * 60 * 15, // 15분 (밀리초 단위)
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // js에서 접근 불가능
        secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지 (None, Lax, Strict)
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 (밀리초 단위)
      });

      userResult.data.hashed_pw = '';

      return res.status(200).json({
        success: true,
        message: '로그인에 성공했습니다.',
        data: userResult,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/logout
   * @group users - 사용자 관련
   * @summary 로그아웃
   */
  route.post('/logout', isAuth, (req, res) => {
    try {
      // 쿠키를 삭제하여 로그아웃 처리
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(200).json({
        success: true,
        message: '로그아웃 되었습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/refresh
   * @group users - 사용자 관련
   * @summary 토큰 갱신
   */
  route.post('/refresh', async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.',
        });
      }

      // 토큰 검증
      const refreshTokenAuth = await jwtController.refreshVerify(refreshToken);
      if (!refreshTokenAuth.success) {
        return res.status(401).json({
          success: false,
          message: 'Refresh Token 검증에 실패했습니다.',
        });
      }

      // 토큰이 유효한 경우
      const newAccessToken = jwtController.sign(refreshTokenAuth.decoded.email);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true, // js에서 접근 가능
        secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지
        maxAge: 1000 * 60 * 15, // 15분 (밀리초 단위)
      });

      const newRefreshToken = jwtController.refresh(
        refreshTokenAuth.decoded.email
      );
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true, // js에서 접근 불가능
        secure: true, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 (밀리초 단위)
      });

      return res.status(200).json({
        success: true,
        message: 'Access Token 갱신에 성공했습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @todo 사용자 배지, dnft 정보 조회 수정 필요
   * @route GET /users/profile/:nickname
   * @group users - 사용자 관련
   * @summary 사용자 프로필 조회
   */
  route.get('/profile/:nickname', isAuth, async (req, res) => {
    try {
      const {
        post_page = 1,
        post_last_id = null,
        event_page = 1,
        event_last_id = null,
        limit = 5,
      } = req.query;
      const email = req.decoded.email;
      const nickname = req.params.nickname;
      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: '닉네임을 입력해주세요.',
        });
      }

      // 닉네임으로 사용자 정보 조회
      const findUserData = await findUserNickname(nickname);
      if (!findUserData.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 사용자입니다.',
        });
      }

      // 반환 결과 데이터
      findUserData.data.hashed_pw = '';
      let resultData = {
        user: findUserData.data,
      };

      // 본인 프로필 조회
      if (findUserData.data.email == email) {
        const myUserData = await findMyUserData(
          findUserData.data._id,
          post_page,
          post_last_id,
          event_page,
          event_last_id,
          limit
        );
        if (myUserData.success) {
          resultData = {
            ...resultData,
            // dnft: myUserData.data.dnft,
            // badge: myUserData.data.badge,
            post: myUserData.data.post,
            event: myUserData.data.event,
          };
        }
      } else {
        // 타인 프로필 조회
        const otherUserData = await findOtherUserData(
          findUserData.data._id,
          post_page,
          post_last_id,
          event_page,
          event_last_id,
          limit
        );
        if (otherUserData.success) {
          resultData = {
            ...resultData,
            // dnft: otherUserData.data.dnft,
            // badge: otherUserData.data.badge,
            post: otherUserData.data.post,
          };
        }
      }

      return res.status(200).json({
        success: true,
        message: '사용자 프로필 조회에 성공했습니다.',
        data: resultData,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @route POST /users/change-nickname
   * @group users - 사용자 관련
   * @summary 닉네임 변경
   */
  route.post('/change-nickname', upload.none(), isAuth, async (req, res) => {
    try {
      const email = req.decoded.email;
      const nickname = req.body.nickname;
      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: '닉네임을 입력해주세요.',
        });
      }

      // 닉네임 중복 체크
      const chkNicknameResult = await checkNickName(nickname);
      if (!chkNicknameResult.success) {
        return res.status(400).json({
          success: false,
          message: '이미 사용중인 닉네임입니다.',
        });
      }

      // 닉네임 변경
      const chgNicknameResult = await chgNickname(email, nickname);
      if (!chgNicknameResult.success) {
        return res.status(400).json({
          success: false,
          message: '닉네임 변경에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '닉네임 변경에 성공했습니다.',
        chgNickname: chgNicknameResult.data,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @todo cloudFront 설정 추가할수도 있음
   * @route POST /users/change-password
   * @group users - 사용자 관련
   * @summary 사용자 배너 이미지 변경
   */
  route.post(
    '/change-banner',
    upload.single('imgFile'),
    isAuth,
    async (req, res) => {
      try {
        const email = req.decoded.email;

        // S3 이미지 업로드
        const imageData = req.file;
        if (!imageData) {
          return res.status(400).json({
            success: false,
            message: '이미지 업로드에 실패하였습니다.',
          });
        }

        // 사용자 배너 이미지 변경
        const chgBannerResult = await chgBanner(email, imageData.location);
        if (!chgBannerResult.success) {
          return res.status(400).json({
            success: false,
            message: '배너 이미지 변경에 실패했습니다.',
          });
        }

        return res.status(200).json({
          success: true,
          message: '배너 이미지 변경에 성공했습니다.',
          imageUrl: chgBannerResult.data,
        });
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
          success: false,
          message: '서버 오류',
        });
      }
    }
  );
};

/**
 * @todo 사용자 배지, dnft 정보 조회 수정 필요
 * @route GET /users/userInfo
 * @group users - 사용자 관련
 * @summary 사용자 정보 조회
 */
route.get('/userInfo', isAuth, async (req, res) => {
  try {
    const email = req.decoded.email;

    // 사용자 이메일로 정보 조회
    const userResult = await findUserEmail(email);
    if (!userResult.success) {
      return res.status(400).json({
        success: false,
        message: '가입되지 않은 이메일입니다.',
      });
    }

    // 반환 결과 데이터
    userResult.data.hashed_pw = '';
    let resultData = {
      user: userResult.data,
    };

    // 사용자 나머지 정보 조회
    const myUserData = await findMyUserData(userResult.data._id);
    if (myUserData.success) {
      resultData = {
        ...resultData,
        // dnft: myUserData.data.dnft,
        // badge: myUserData.data.badge,
        post: myUserData.data.post,
        event: myUserData.data.event,
      };
    }

    return res.status(200).json({
      success: true,
      message: '사용자 정보 조회에 성공했습니다.',
      data: resultData,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
});

/**
 * @todo DNFT 업그레이드
 * @route POST /users/upgrade-dnft
 * @group users - 사용자 관련
 * @summary DNFT 업그레이드
 */
route.post('/upgrade-dnft', isAuth, (req, res) => {});
