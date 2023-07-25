const Router = require("express");
const {
  checkEmail,
  sendEmail,
  checkNickName,
  checkEmailAuthCode,
  saveUserData,
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
        !userData.walle_address ||
        !userData.social_provider ||
        !userData.email_verificatio_code
      ) {
        return res.status(400).json({
          success: false,
          message: "필수 정보를 입력해주세요.",
        });
      }

      // 이메일 인증 코드 검증
      const chkMailAuthCode = await checkEmailAuthCode(
        userData.email,
        userData.email_verificatio_code
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
  route.post("/login", (req, res) => {});

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
  route.post("/refresh", (req, res) => {});
};
