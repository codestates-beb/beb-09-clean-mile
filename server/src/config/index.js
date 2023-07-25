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
    serviceName: "Naver",
    adminEmail: config.ADMIN_EMAIL,
    mailId: config.MAIL_ID,
    mailPassword: config.MAIL_PW,
  },
};
