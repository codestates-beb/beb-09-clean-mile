const config = require('../../../config');
const Router = require('express');
const multer = require('multer');
const jwtUtil = require('../../../utils/jwtUtil');
const isAuth = require('../../middlewares/isAuth');
const usersController = require('../../../services/client/usersController');
const dnftController = require('../../../services/contract/dnftController');
const badgeController = require('../../../services/contract/badgeController');
const tokenController = require('../../../services/contract/tokenController');
const {
  checkFileExistence,
  fileValidation,
} = require('../../middlewares/fileValidation');
const storage = multer.memoryStorage(); // 이미지를 메모리에 저장
const upload = multer({ storage: storage });

const route = Router();

module.exports = (app) => {
  app.use('/users', route);

  /**
   * @route POST /users/check-email
   * @group users - 사용자 관련
   * @summary 이메일 인증 코드 전송(이메일 중복 체크 포함)
   */
  route.post('/check-email', upload.none(), async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: '이메일을 입력해주세요.',
        });
      }

      // 이메일 중복 체크
      const checkEmailResult = await usersController.checkEmail(email);
      if (!checkEmailResult.success) {
        return res.status(400).json({
          success: false,
          message: '이미 가입된 이메일입니다.',
        });
      }

      // 인증 이메일 전송
      const sendEmailResult = await usersController.sendEmail(email);
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
  route.post('/validate-nickname', upload.none(), async (req, res) => {
    try {
      const nickname = req.body.nickname;
      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: '닉네임을 입력해주세요.',
        });
      }

      // 닉네임 중복 체크
      const checkNickNameResult = await usersController.checkNickName(nickname);
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
        !userData.social_provider
      ) {
        return res.status(400).json({
          success: false,
          message: '필수 정보를 입력해주세요.',
        });
      }

      // 사용자 정보 저장
      const saveDataResult = await usersController.saveUserData(userData);
      if (!saveDataResult.success) {
        return res.status(400).json({
          success: false,
          message: saveDataResult.message,
        });
      }

      //사용자 DNFT 발급
      const createDNFT = await dnftController.createDNFT(
        saveDataResult.data._id, // 사용자 아이디
        saveDataResult.data.wallet.address, // 사용자 지갑 주소
        saveDataResult.data.name, // 사용자 이름
        saveDataResult.data.nickname, // 사용자 닉네임
        saveDataResult.data.user_type // 사용자 타입
      );
      if (!createDNFT.success) {
        return res
          .status(400)
          .json({ success: false, message: createDNFT.message });
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
      const chkMailAuthCode = await usersController.checkEmailAuthCode(
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
      const userResult = await usersController.findUserEmail(email);
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

      const user_id = userResult.data._id;

      // 토큰 생성 후 쿠키에 저장
      const accessToken = jwtUtil.sign(email, user_id);
      const refreshToken = jwtUtil.refresh(email, user_id);

      usersController.setClientTokenCookie(res, accessToken, refreshToken);

      // 사용자 DNFT 데이터 조회
      const dnftData = await dnftController.userDnftData(user_id);
      if (!dnftData.success)
        return res
          .status(500)
          .json({ success: false, message: 'DNFT 데이터 조회 실패' });

      // 사용자 뱃지 정보 조회
      const badgeData = await badgeController.userBadges(user_id);
      if (!badgeData.success)
        return res
          .status(400)
          .json({ success: false, message: badgeData.message });

      // 필요 없는 데이터 제거
      const userData = userResult.data.toObject();
      delete userData.hashed_pw;
      delete userData.__v;

      userData.dnftData = dnftData.data; // userData에 dnft 정보 추가
      userData.badges = badgeData.data; // userData에 badge 정보 추가

      return res.status(200).json({
        success: true,
        message: '로그인에 성공했습니다.',
        data: userData,
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
      // 로그아웃 시 쿠키 덮어쓰기
      res.cookie('clientAccessToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0), // 즉시 만료
        domain: config.cookieDomain.client,
      });

      res.cookie('clientRefreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0), // 즉시 만료
        domain: config.cookieDomain.client,
      });

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
      const refreshToken = req.cookies.clientRefreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.',
        });
      }

      // 토큰 검증
      const refreshTokenAuth = await jwtUtil.refreshVerify(refreshToken);
      if (!refreshTokenAuth.success) {
        return res.status(401).json({
          success: false,
          message: 'Refresh Token 검증에 실패했습니다.',
        });
      }

      const email = refreshTokenAuth.decoded.email;
      const user_id = refreshTokenAuth.decoded.user_id;

      // 토큰이 유효한 경우
      const newAccessToken = jwtUtil.sign(email, user_id);
      const newRefreshToken = jwtUtil.refresh(email, user_id);

      // 쿠키에 토큰 저장
      usersController.setClientTokenCookie(
        res,
        newAccessToken,
        newRefreshToken
      );

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
   * @route POST /users/myProfile
   * @group users - 사용자 관련
   * @summary 내 프로필 조회
   */
  route.get('/profile', isAuth, async (req, res) => {
    try {
      const user_id = req.decoded.user_id;

      // 사용자 프로필 조회
      const userProfile = await usersController.getProfile(user_id);
      if (!userProfile.success) {
        return res.status(400).json({
          success: false,
          message: userProfile.message,
        });
      }

      // 사용자 참여 이벤트 정보 조회
      const userEvent = await usersController.getEvents(user_id, 1, 5);
      if (!userEvent) {
        return res.status(400).json({
          success: false,
          message: '사용자가 참여한 이벤트 조회에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '내 프로필 조회에 성공했습니다.',
        data: {
          user: userProfile.data.user,
          dnft: userProfile.data.dnft,
          badges: userProfile.data.badges,
          events: userEvent.data,
          eventPagination: userEvent.pagination,
          posts: userProfile.data.posts.data,
          postPagination: userProfile.data.posts.pagination,
        },
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
   * @route GET /users/profile/:id
   * @group users - 사용자 관련
   * @summary 다른 사용자 프로필 조회
   */
  route.get('/profile/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // 사용자 프로필 조회
      const userProfile = await usersController.getProfile(id);
      if (!userProfile.success) {
        return res.status(400).json({
          success: false,
          message: userProfile.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '사용자 프로필 조회에 성공했습니다.',
        data: {
          user: userProfile.data.user,
          dnft: userProfile.data.dnft,
          badges: userProfile.data.badges,
          posts: userProfile.data.posts.data,
          postPagination: userProfile.data.posts.pagination,
        },
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
   * @route POST /users/profile/postPagination/
   * @group users - 사용자 관련
   * @summary General, Review Posts List 조회 페이지네이션
   */
  route.get('/profile/postPagination/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 5 } = req.query;

      // General, Review Posts List 조회
      const posts = await usersController.getPosts(id, page, limit);

      return res.status(200).json({
        success: true,
        data: posts,
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
   * @route POST /users/profile/eventPagination/
   * @group users - 사용자 관련
   * @summary 사용자 프로필 이벤트 페이징
   */
  route.get('/profile/eventPagination/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 5 } = req.query;

      // 사용자가 참여한 이벤트 목록 조회
      const events = await usersController.getEvents(id, page, limit);

      return res.status(200).json({
        success: true,
        data: events,
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
  route.patch('/change-nickname', isAuth, upload.none(), async (req, res) => {
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
      const chkNicknameResult = await usersController.checkNickName(nickname);
      if (!chkNicknameResult.success) {
        return res.status(400).json({
          success: false,
          message: '이미 사용중인 닉네임입니다.',
        });
      }

      // 닉네임 변경
      const chgNicknameResult = await usersController.changeNickname(
        email,
        nickname
      );
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
   * @route POST /users/change-password
   * @group users - 사용자 관련
   * @summary 사용자 배너 이미지 변경
   */
  route.patch(
    '/change-banner',
    isAuth,
    upload.single('imgFile'), // multer로 이미지 받음
    checkFileExistence, // 파일 존재 여부 확인
    fileValidation, // 파일 유효성 검사
    async (req, res) => {
      try {
        const email = req.decoded.email;

        // 사용자 배너 이미지 변경
        const chgBannerResult = await usersController.changeBanner(
          email,
          req.file
        );
        if (!chgBannerResult.success) {
          return res.status(400).json({
            success: false,
            message: chgBannerResult.message,
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
 * @route GET /users/userInfo
 * @group users - 사용자 관련
 * @summary 사용자 정보 조회
 */
route.get('/userInfo', isAuth, async (req, res) => {
  try {
    const user_id = req.decoded.user_id;

    // 사용자 정보 조회
    const user = await usersController.getUser(user_id);
    if (!user.success) {
      return res.status(400).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    // 사용자 dnft 정보 조회
    const dnftData = await dnftController.userDnftData(user_id);
    if (!dnftData.success)
      return res
        .status(400)
        .json({ success: false, message: dnftData.message });

    // 사용자 뱃지 정보 조회
    const badgeData = await badgeController.userBadges(user_id);
    if (!badgeData.success)
      return res
        .status(400)
        .json({ success: false, message: badgeData.message });

    // 사용자 작성한 General, Review Posts List 조회
    const posts = await usersController.getPosts(user_id);

    // 사용자가 참여한 이벤트 목록 조회
    const events = await usersController.getEvents(user_id);

    return res.status(200).json({
      success: true,
      data: {
        user: user.data,
        dnftData: dnftData.data,
        badgeData: badgeData.data,
        events: events.data,
        posts: posts.data,
      },
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
 * @route POST /users/updateDNFTName
 * @group users - 사용자 관련
 * @summary DNFT 업그레이드
 */
/**
 * 당장 사용하는 곳이 없으므로 주석 처리
 */
// route.post(
//   '/updateDNFTName',
//   /*isAuth*/ async (req, res) => {
//     try {
//       const { email, newName } = req.body;

//       const updateName = await dnftController.updateName(email, newName);

//       if (updateName.success) {
//         return res.status(200).json({
//           success: true,
//         });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: 'DNFT Name 업데이트에 실패하였습니다',
//         });
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       return res.status(500).json({
//         success: false,
//         message: '서버 오류',
//       });
//     }
//   }
// );

/**
 * @route POST /users/upgrade-dnft
 * @group users - 사용자 관련
 * @summary DNFT 업그레이드
 */
route.post('/upgrade-dnft', isAuth, async (req, res) => {
  try {
    const user_id = req.decoded.user_id;

    const upgradeDNFT = await dnftController.upgradeDnft(user_id);

    if (upgradeDNFT.success) {
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'DNFT 업그레이드에 실패하였습니다',
      });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
});

/**
 * @route POST /users/token-exchange
 * @group users - 사용자 관련
 * @summary 마일리지를 토큰으로 교환
 */
route.post('/token-exchange', isAuth, async (req, res) => {
  try {
    const userId = req.decoded.user_id;

    const tokenExchange = await tokenController.tokenExchange(userId);
    if (!tokenExchange.success)
      return res
        .status(400)
        .json({ success: false, message: tokenExchange.message });

    return res
      .status(200)
      .json({ success: true, message: '토큰 교환에 성공했습니다.' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
});
