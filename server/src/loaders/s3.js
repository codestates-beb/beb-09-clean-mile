const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/index');

// AWS S3 설정
const s3 = new aws.S3({
  region: config.awsS3.region,
  accessKeyId: config.awsS3.accessKey,
  secretAccessKey: config.awsS3.secretKey,
});

// Multer-S3 스토리지 엔진 생성
upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.awsS3.bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()); // 파일 이름을 고유하게 설정할 수 있습니다.
    },
  }),
});

module.exports = upload;