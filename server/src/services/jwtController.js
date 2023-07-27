const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  /**
   * Access 토큰 발급
   * @param {string} email
   * @returns Access token
   */
  sign: (email) => {
    // Access 토큰에 들어갈 페이로드
    const payload = {
      email: email, // custom claims
      isAdmin: false, // custom claims
    };

    // 시크릿 키로 서명된 Access 토큰 발급 후 반환
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '1m', // 만료 시간
      algorithm: 'HS256', // 암호화 알고리즘
      issuer: 'cleanMileServer', // 발행자
      audience: 'http://127.0.0.1/', // 발행 대상
      subject: 'userInfo', // 토큰 발행 목적
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
    // Refresh 토큰에 들어갈 페이로드
    const payload = {
      email: email, // custom claims
    };
    return jwt.sign(payload, config.jwtSecret, {
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '14d', // 만료 시간
      issuer: 'cleanMileServer', // 발행자
      audience: 'http://127.0.0.1/', // 발행 대상
      subject: 'auth', // 토큰 발행 목적
    });
  },

  /**
   * Refresh 토큰 검증
   * @param {string} token
   * @param {string} email
   * @returns 검증 결과
   */
  refreshVerify: (token, decodeData) => {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      return (
        decoded.email === decodeData.email &&
        decoded.issuer === decodeData.issuer
      );
    } catch (err) {
      console.error('Error:', err);
      return {
        success: false,
      };
    }
  },
};
