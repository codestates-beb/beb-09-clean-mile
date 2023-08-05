const jwtUtil = require('../../utils/jwtUtil');

/**
 * jwt 인증 미들웨어
 */
const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.',
    });
  }

  // 토큰 검증
  const result = jwtUtil.verify(accessToken);
  if (!result.success) {
    return res.status(401).json({
      success: false,
      message: `Access Token : ${result.message}`,
    });
  }

  // 토큰이 유효한 경우
  req.decoded = result.decoded;
  next();
};

module.exports = verifyToken;
