const jwtUtil = require('../../utils/jwtAdminUtil');

const verifyAdminToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.',
    });
  }

  // 토큰 검증
  const result = jwtUtil.adminVerify(accessToken);
  if (!result.success || !result.decoded.isAdmin) {
    return res.status(401).json({
      success: false,
      message: `Access Token : ${result.message}`,
    });
  }

  // 토큰이 유효한 경우
  req.decoded = result.decoded;
  next();
};

module.exports = verifyAdminToken;
