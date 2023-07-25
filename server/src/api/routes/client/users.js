const Router = require("express");
const route = Router();

module.exports = function (app) {
  app.use("/users", route);

  /**
   * @route POST /users/register
   * @group users - 사용자 관련
   * @summary 이메일 인증 코드 전송(이메일 중복 체크 포함)
   */
  route.post("/check-email", (req, res) => {});
};
