const Router = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const jwtController = require('../../../services/jwtController');
const isAuth = require('../../middlewares/isAuth');
const {
  checkEmail,
  sendEmail,
  checkNickName,
  checkEmailAuthCode,
  saveUserData,
  findUser,
  chgNickname,
} = require('../../../services/client/usersController');
const upload = multer({ dest: 'uploads/' });
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

      // 이메일 인증 코드 검증
      const chkMailAuthCode = await checkEmailAuthCode(
        userData.email,
        userData.email_verification_code
      );
      if (!chkMailAuthCode.success) {
        return res.status(400).json({
          success: false,
          message: '이메일 인증에 실패했습니다.',
        });
      }

      // 사용자 정보 저장
      const saveDataResult = await saveUserData(userData);
      console.log(saveDataResult);
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
      const userResult = await findUser(email);
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

      /**
       * 리프레시 토큰만 http only secure 쿠키에 저장
       * 액세스 토큰은 프로그램상 로컬변수에 담아 놓는것이 그나마 제일 안전
       * 참고 : https://simsimjae.tistory.com/482
       */
      res.cookie('accessToken', accessToken, {
        httpOnly: false, // js에서 접근 가능
        secure: false, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지
        maxAge: 1000 * 60 * 15, // 15분 (밀리초 단위)
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // js에서 접근 불가능
        secure: false, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
        sameSite: 'strict', // CSRF와 같은 공격을 방지
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 (밀리초 단위)
      });

      return res.status(200).json({
        success: true,
        message: '로그인에 성공했습니다.',
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
  route.post('/refresh', isAuth, (req, res) => {
    try {
      // access token과 refresh token 존재 확인
      if (!req.cookies.accessToken && !req.cookies.refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Access Token과 Refresh Token이 필요합니다.',
        });
      }

      // 액세스 토큰과 리프레시 토큰을 쿠키에서 추출
      const authToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      // access token 검증 (만료여부 확인)
      const authResult = jwtController.verify(authToken);

      // access token 디코딩하여 user의 정보를 가져옵니다.
      const decoded = jwt.decode(authToken);
      if (!decoded) {
        return res.status(401).send({
          success: false,
          message: '권한이 없습니다!',
        });
      }

      // access token이 만료된 경우
      if (!authResult.success && authResult.message === 'jwt expired') {
        // refresh token 검증 (만료여부 확인)
        const refreshResult = jwtController.refreshVerify(
          refreshToken,
          decoded.email
        );
        // refresh token이 만료된 경우
        if (!refreshResult.success) {
          return res.status(401).send({
            success: false,
            message: '다시 로그인해야 합니다.',
          });
        }

        // refresh token이 만료되지 않은 경우
        const newAccessToken = jwtController.sign(decoded.email);
        res.cookie('accessToken', newAccessToken, {
          httpOnly: false, // js에서 접근 가능
          secure: false, // HTTPS 연결에서만 쿠키를 전송 (설정 후 수정 필요)
          sameSite: 'strict', // CSRF와 같은 공격을 방지
          maxAge: 1000 * 60 * 15, // 15분 (밀리초 단위)
        });

        return res.status(200).json({
          success: true,
          message: '토큰이 갱신되었습니다.',
        });
      } else {
        // access token이 만료되지 않은 경우
        return res.status(401).json({
          success: true,
          message: '토큰이 유효합니다.',
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
   * @route GET /users/profile/:nickname
   * @group users - 사용자 관련
   * @summary 사용자 프로필 조회
   */
  route.get('/profile/:nickname', isAuth, (req, res) => {
    try {
      const email = req.decoded.sub;
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
      const email = req.decoded.sub;
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
   * @route POST /users/change-password
   * @group users - 사용자 관련
   * @summary 사용자 배너 이미지 변경
   */
  route.post('/change-banner', isAuth, (req, res) => {});
};
