const multer = require('multer');
const upload = require('../../loaders/s3');

/**
 * 이미지 파일 크기 체크
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkImageFileSize = (req, res, next) => {
  if (req.files && req.files['image']) {
    upload.array('image', 1)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer 에러 처리
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message:
              '업로드 가능한 이미지 파일 크기를 초과했습니다. (최대 5MB)',
          });
        } else {
          console.error('에러:', err);
          return res.status(500).json({
            success: false,
            message: '서버 오류',
          });
        }
      } else {
        // 파일 크기 체크 통과시 다음 미들웨어 호출
        next();
      }
    });
  } else {
    next();
  }
};

/**
 * 비디오 파일 크기 체크
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkVideoFileSize = (req, res, next) => {
  if (req.files && req.files['video']) {
    upload.array('video', 1)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer 에러 처리
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message:
              '업로드 가능한 비디오 파일 크기를 초과했습니다. (최대 5MB)',
          });
        }
      } else if (err) {
        // 기타 에러 처리
        console.error('Error:', err);
        return res.status(500).json({
          success: false,
          message: '서버 오류',
        });
      }
      next();
    });
  }
  next();
};

module.exports = { checkImageFileSize, checkVideoFileSize };
