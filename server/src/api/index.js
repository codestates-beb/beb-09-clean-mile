const Router = require("express");
const users = require("./routes/client/users");

module.exports = () => {
  const app = Router();

  // client/users 관련 라우터
  users(app);

  return app;
};
