const config = require("./config.json");

module.exports = {
  // port
  port: config.PORT,

  // database
  databaseURL: config.DATABASE_URL,

  // node environment
  nodeEnv: process.env.NODE_ENV,
};
