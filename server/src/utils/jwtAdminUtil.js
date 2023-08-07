const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/Users');

module.exports = {
  /**
   * 관리자 Access 토큰 발급
   * @param {*} email
   * @param {*} user_id
   * @returns
   */
  adminSign: (email, user_id) => {
    // admin Access 토큰에 들어갈 페이로드
    const payload = {
      email: email, // custom claims
      user_id: user_id, // custom claims
      isAdmin: true, // custom claims
    };

    // 시크릿 키로 서명된 Access 토큰 발급 후 반환
    return jwt.sign(payload, config.jwt.jwtAdminSecret, {
      expiresIn: '15m', // 만료 시간
      algorithm: 'HS256', // 암호화 알고리즘
      issuer: config.jwt.isu, // 발행자
      audience: config.jwt.aud, // 발행 대상
      subject: 'admin', // 토큰 발행 목적
    });
  },

  /**
   * 관리자 Access 토큰 검증
   * @param {string} token
   * @returns 검증 결과
   */
  adminVerify: (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.jwtAdminSecret);
      if (!decoded.isAdmin) {
        return {
          success: false,
          message: '관리자가 아닙니다.',
        };
      }

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
   * 관리자 Refresh 토큰 발급
   * @returns Refresh token
   */
  adminRefresh: (email, user_id) => {
    // Refresh 토큰에 들어갈 페이로드
    const payload = {
      email: email, // custom claims
      user_id: user_id, // custom claims
    };
    return jwt.sign(payload, config.jwt.jwtAdminRefreshSecret, {
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
  adminRefreshVerify: async (token) => {
    try {
      const decoded = jwt.verify(token, config.jwt.jwtAdminRefreshSecret);
      console.log(decoded.email);

      const findUser = await UserModel.findOne({ email: decoded.email });
      if (!findUser) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      if (
        decoded.email === findUser.email &&
        decoded.iss === config.jwt.isu &&
        findUser.user_type === 'admin'
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

  /**
   * QR 토큰 발급
   * @param {*} event_id
   * @returns
   */
  qrSign: (event_id) => {
    // QR 토큰에 들어갈 페이로드
    const payload = {
      event_id: event_id, // custom claims
    };

    // 시크릿 키로 서명된 QR 토큰 발급 후 반환
    return jwt.sign(payload, config.qrCodeJwt.jwtSecret, {
      expiresIn: '2h', // 만료 시간
      algorithm: 'HS256', // 암호화 알고리즘
      issuer: config.jwt.isu, // 발행자
      audience: config.jwt.aud, // 발행 대상
      subject: 'eventAuth', // 토큰 발행 목적
    });
  },

  /**
   * QR 토큰 검증
   * @param {*} token
   * @returns
   */
  qrVerify: (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.qrCodeJwt.jwtSecret);
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
};
