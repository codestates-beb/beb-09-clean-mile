const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/Users');

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
    return jwt.sign(payload, config.jwt.jwtSecret, {
      expiresIn: '15m', // 만료 시간
      algorithm: 'HS256', // 암호화 알고리즘
      issuer: config.jwt.isu, // 발행자
      audience: config.jwt.isu, // 발행 대상
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
      decoded = jwt.verify(token, config.jwt.jwtSecret);
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
    return jwt.sign(payload, config.jwt.jwtSecret, {
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '14d', // 만료 시간
      issuer: config.jwt.isu, // 발행자
      audience: config.jwt.aud, // 발행 대상
      subject: 'auth', // 토큰 발행 목적
    });
  },

  /**
   * Refresh 토큰 검증
   * @param {string} token
   * @returns 검증 결과
   */
  refreshVerify: (token) => {
    try {
      const decoded = jwt.verify(token, config.jwt.jwtSecret);

      // 사용자 확인
      const findUser = UserModel.findOne({ email: decoded.email });
      if (!findUser) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      if (
        decoded.email === findUser.email &&
        decoded.issuer === config.jwt.isu
      ) {
        return {
          success: true,
          decoded: decoded,
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (err) {
      console.error('Error:', err);
      return {
        success: false,
      };
    }
  },
};
