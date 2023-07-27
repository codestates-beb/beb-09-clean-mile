const Router = require("express");
const jwt = require("../../../services/jwtController");
const refresh = require("../../middlewares/refresh");
const {
  checkEmail,
  sendEmail,
  checkNickName,
  checkEmailAuthCode,
  saveUserData,
  findUser,
} = require("../../../services/client/usersController");
const route = Router();

module.exports = (app) => {
  app.use("/users", route);

  /**
   * @route POST /users/check-email
   * @group users - 사용자 관련
   * @summary 이메일 인증 코드 전송(이메일 중복 체크 포함)
   */
  route.post("/check-email", async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "이메일을 입력해주세요.",
        });
      }

      // 이메일 중복 체크
      const checkEmailResult = await checkEmail(email);
      if (!checkEmailResult.success) {
        return res.status(400).json({
          success: false,
          message: "이미 가입된 이메일입니다.",
        });
      }

      // 인증 이메일 전송
      const sendEmailResult = await sendEmail(email);
      if (!sendEmailResult.success) {
        return res.status(400).json({
          success: false,
          message: "인증 이메일 전송에 실패했습니다.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "인증 이메일 전송에 성공했습니다.",
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }
  });

  /**
   * @route POST /users/validate-nickname
   * @group users - 사용자 관련
   * @summary 닉네임 중복 체크
   */
  route.post("/validate-nickname", async (req, res) => {
    try {
      const nickname = req.body.nickname;
      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: "닉네임을 입력해주세요.",
        });
      }

      // 닉네임 중복 체크
      const checkNickNameResult = await checkNickName(nickname);
      if (!checkNickNameResult.success) {
        return res.status(400).json({
          success: false,
          message: "이미 사용중인 닉네임입니다.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "사용 가능한 닉네임입니다.",
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }
  });

  /**
   * @route POST /users/signup
   * @group users - 사용자 관련
   * @summary 회원가입 (이메일 인증 코드 검증 포함)
   */
  route.post("/signup", async (req, res) => {
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
          message: "필수 정보를 입력해주세요.",
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
          message: "이메일 인증에 실패했습니다.",
        });
      }

      // 사용자 정보 저장
      const saveDataResult = await saveUserData(userData);
      console.log(saveDataResult);
      if (!saveDataResult.success) {
        return res.status(400).json({
          success: false,
          message: "사용자 정보 저장에 실패했습니다.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "회원가입에 성공했습니다.",
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }
  });

  /**
   * @route POST /users/login
   * @group users - 사용자 관련
   * @summary 로그인
   */
  route.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "이메일 또는 비밀번호를 입력해주세요.",
        });
      }

      // 사용자 이메일로 정보 조회
      const userResult = await findUser(email);
      if (!userResult.success) {
        return res.status(400).json({
          success: false,
          message: "가입되지 않은 이메일입니다.",
        });
      }

      // 비밀번호 검증
      const isPwMatch = await userResult.data.comparePassword(password);
      if (!isPwMatch) {
        return res.status(400).json({
          success: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }

      // 토큰 생성
      const accessToken = jwt.sign(email);
      const refreshToken = jwt.refresh();

      // 토큰 헤더에 추가
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Authorization", "Bearer " + accessToken);
      res.setHeader("Refresh", refreshToken);

      /**
       * 리프레시 토큰만 http only secure 쿠키에 저장
       * 액세스 토큰은 프로그램상 로컬변수에 담아 놓는것이 그나마 제일 안전
       * 참고 : https://simsimjae.tistory.com/482
       */
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict", // CSRF와 같은 공격을 방지하기 위해 설정
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 (밀리초 단위)
      });

      return res.status(200).json({
        success: true,
        message: "로그인에 성공했습니다.",
        token: {
          accessToken: accessToken,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }
  });

  /**
   * @route POST /users/logout
   * @group users - 사용자 관련
   * @summary 로그아웃
   */
  route.post("/logout", (req, res) => {});

  /**
   * @route POST /users/refresh
   * @group users - 사용자 관련
   * @summary 토큰 갱신
   */
  route.post("/refresh", refresh);

  /**
   * @route GET /users/profile/:nickname
   * @group users - 사용자 관련
   * @summary 사용자 프로필 조회
   */
  route.get("/profile/:nickname", (req, res) => {});

  /**
   * @route POST /users/change-nickname
   * @group users - 사용자 관련
   * @summary 닉네임 변경
   */
  route.post("/change-nickname", (req, res) => {});

  /**
   * @route POST /users/change-password
   * @group users - 사용자 관련
   * @summary 사용자 배너 이미지 변경
   */
  route.post("/change-banner", (req, res) => {});
};
