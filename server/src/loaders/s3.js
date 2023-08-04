const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/index');
const uuid = require('uuid'); // Universally Unique IDentifier 범용 고유 식별자

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
      const uniqueId = uuid.v4();
      const fileName = `${uniqueId}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
  // 업로드 파일 용량 제한 (5MB)
  limits: { fileSize: 5 * 1024 * 1024 },

  // 파일 검사
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/*'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // 유효한 파일 형식일 경우 업로드
    } else {
      cb(new Error('업로드 할 수 없는 파일 형식입니다.'), false);
    }
  },
});

module.exports = upload;
