const jwt = require("jsonwebtoken");
const jwtController = require("../../services/jwtController");

/**
 * 토큰 재발급 시나리오
 * access token이 만료되고, refresh token도 만료된 경우 => 재 로그인
 * access token이 만료되고, refresh token은 만료되지 않았을 경우 => 새로운 access token을 발급.
 * access token이 만료되지 않은 경우 => refresh 할 필요 없음.
 */
const refresh = async (req, res) => {
  try {
    // access token과 refresh token의 존재 확인
    if (!req.headers.authorization && !req.headers.refresh) {
      return res.status(400).json({
        success: false,
        message: "Access Token과 Refresh Token이 필요합니다.",
      });
    }

    // 액세스 토큰과 리프레시 토큰을 헤더에서 추출
    const authToken = req.headers.authorization.split("Bearer ")[1];
    const refreshToken = req.headers.refresh;

    // access token 검증 (만료여부 확인)
    const authResult = jwtController.verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);
    if (!decoded) {
      return res.status(401).send({
        success: false,
        message: "권한이 없습니다!",
      });
    }

    // access token이 만료된 경우
    if (!authResult.success && authResult.message === "jwt expired") {
      // refresh token 검증 (만료여부 확인)
      const refreshResult = jwtController.refreshVerify(
        refreshToken,
        decoded.email
      );
      // refresh token이 만료된 경우
      if (!refreshResult.success) {
        return res.status(401).send({
          success: false,
          message: "새로 로그인해야 합니다.",
        });
      }

      // refresh token이 만료되지 않은 경우
      const newAccessToken = jwtController.sign(decoded.email);
      res.setHeader("Authorization", "Bearer " + newAccessToken);
      return res.status(200).json({
        success: true,
        message: "토큰이 갱신되었습니다.",
        token: {
          accessToken: newAccessToken,
        },
      });
    } else {
      // access token이 만료되지 않은 경우
      return res.status(200).json({
        success: true,
        message: "토큰이 유효합니다.",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
};

module.exports = refresh;
