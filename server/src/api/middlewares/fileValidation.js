// 파일 존재 여부 검사 미들웨어
const checkFileExistence = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: '파일이 존재하지 않습니다.',
    });
  }
  // 파일이 존재할 경우 다음 미들웨어 또는 핸들러로 넘어갑니다.
  next();
};

const checkFilesExistence = (req, res, next) => {
  const files = req.files;
  if (files.length === 0 || !files) {
    return res.status(400).json({
      success: false,
      message: '파일이 존재하지 않습니다.',
    });
  }
  // 파일이 존재할 경우 다음 미들웨어 또는 핸들러로 넘어갑니다.
  next();
};

// 파일 검사 미들웨어 (확장자 확인, 파일 크기 확인)
function fileValidation(req, res, next) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/*'];

  console.log(req.files);
  console.log(req.file);

  let files = [];
  if (req.files && Array.isArray(req.files)) {
    files = req.files;
  } else if (req.file) {
    files.push(req.file);
  }

  console.log(files);

  for (const file of files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: '업로드 할 수 없는 파일 형식입니다.',
      });
    }

    // 파일 크기 검사 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.',
      });
    }
  }

  next();
}

module.exports = { checkFileExistence, fileValidation, checkFilesExistence };
