const AWS = require('aws-sdk');
const config = require('../config/index');

// AWS 자격증명 정보
AWS.config.update({
  accessKeyId: config.awsS3.accessKey,
  secretAccessKey: config.awsS3.secretKey,
  region: config.awsS3.region,
});

module.exports = AWS;
