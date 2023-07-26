const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  /**
   * Access 토큰 발급
   * @param {string} email
   * @returns Access token
   */
  sign: (email) => {
    /**
     * @todo  수정 필요
     * Access 토큰에 들어갈 페이로드
     */
    const payload = {
      iss: 'cleanMile', // 토큰 발급자
      sub: email, // 사용자 식별
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 토큰의 만료 시간 (UNIX 타임스탬프 형식)
      iat: Math.floor(Date.now() / 1000), // 토큰 발급 시간 (UNIX 타임스탬프 형식)
    };

    // 시크릿 키로 서명된 Access 토큰 발급 후 반환
    return jwt.sign(payload, config.jwtSecret, {
      algorithm: 'HS256', // 암호화 알고리즘
    });
  },

  /**
   * Access 토큰 검증
   * @param {string} token
   * @returns 검증 결과
   */
  verify: (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
      return {
        success: true,
        decoded: decoded,
      };
    } catch (err) {
      console.error('Error:', err);
      return {
        success: false,
        message: err.message,
      };
    }
  },

  /**
   * Refresh 토큰 발급
   * @returns Refresh token
   */
  refresh: (email) => {
    /**
     * @todo  수정 필요
     * Refresh 토큰에 들어갈 페이로드
     */
    const payload = {
      iss: 'cleanMile', // 토큰 발급자
      sub: email, // 사용자 식별
      exp: Math.floor(Date.now() / 1000) + 60 * 24 * 14, // 토큰의 만료 시간 (UNIX 타임스탬프 형식)
      iat: Math.floor(Date.now() / 1000), // 토큰 발급 시간 (UNIX 타임스탬프 형식)
    };
    return jwt.sign(payload, config.jwtSecret, {
      algorithm: 'HS256', // 암호화 알고리즘
    });
  },

  /**
   * Refresh 토큰 검증
   * @param {string} token
   * @param {string} email
   * @returns 검증 결과
   */
  refreshVerify: (token, email) => {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      return decoded.email === email;
    } catch (err) {
      console.error('Error:', err);
      return {
        success: false,
      };
    }
  },
};
