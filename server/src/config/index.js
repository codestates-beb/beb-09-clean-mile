const config = require('./config.json');

module.exports = {
  // port
  port: config.PORT,

  // mongodb
  databaseURL: config.DATABASE_URL,

  // mongodb test
  testDatabaseURL: config.TEST_MONGO_URL,

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
  jwt: {
    jwtSecret: config.SECRET_CODE,
    jwtRefreshSecret: config.REFRESH_SECRET_CODE,
    jwtAdminSecret: config.ADMIN_SECRET_CODE,
    jwtAdminRefreshSecret: config.ADMIN_REFRESH_SECRET_CODE,
    isu: config.ISSUER,
    aud: config.AUDIENCE,
  },

  // QR code JWT
  qrCodeJwt: {
    jwtSecret: config.EVENT_QR_SECRET_CODE,
  },

  // AWS - S3
  awsS3: {
    region: 'ap-northeast-2',
    accessKey: config.S3_ACCESS_KEY,
    secretKey: config.S3_SECRET_KEY,
    bucketName: config.S3_BUCKET_NAME,
  },
};
