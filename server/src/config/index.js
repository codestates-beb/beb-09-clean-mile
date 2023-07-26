const config = require("./config.json");

module.exports = {
  // port
  port: config.PORT,

  // database
  databaseURL: config.DATABASE_URL,

  // node environment
  nodeEnv: process.env.NODE_ENV,

  // naver mail
  mail: {
    serviceName: config.SERVICE_NAME,
    adminEmail: config.ADMIN_EMAIL,
    mailId: config.MAIL_ID,
    mailPassword: config.MAIL_PW,
  },

  // bcrypt
  saltRounds: 10,

  // jwt
  jwtSecret: config.SECRET_CODE,
};
