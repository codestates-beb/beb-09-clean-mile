const jwtController = require("../services/jwtController");

/**
 * jwt 인증 미들웨어
 */
const verifyToken = async (req, res, next) => {
  const headers = req.headers;
  if (!headers.hasOwnProperty("authorization")) {
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });
  }

  // 토큰 추출
  const token = headers.authorization.split("Bearer ")[1];
  if (!token || token === "null") {
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });
  }

  // 토큰 검증
  const result = jwtController.verify(token);
  if (!result.success) {
    return res.status(401).json({
      success: false,
      message: "토큰이 일치하지 않습니다.",
    });
  }

  // 토큰이 유효한 경우
  req.decoded = result.decoded;
  next();
};

module.exports = verifyToken;
