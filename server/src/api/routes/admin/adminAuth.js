const Router = require('express');
const jwt = require('jsonwebtoken');
const jwtController = require('../../../services/jwtController');
const adminAuthController = require('../../../services/admin/adminAuthController');
const userController = require('../../../services/client/usersController');
const isAuth = require('../../middlewares/isAuth');
const upload = require('../../../loaders/s3');

const route = Router();

module.exports = (app) => {
  app.use('/admin', route);

  /**
   * @router POST /admin/login
   * @group Admin
   * @Summary 관리자 로그인
   */
  route.post('/login', upload.none(), async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 이메일로 정보 조회
      const adminResult = await userController.findUserEmail(email);
      if (!adminResult.success) {
        return res.status(400).json({
          success: false,
          message: '등록되지 않은 이메일입니다.',
        });
      }

      // 비밀번호 확인
      const isMatchPw = await adminResult.data.comparePassword(password);
      if (!isMatchPw) {
        return res.status(400).json({
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
      adminResult.data.hashed_pw = ''; // pw hash값 삭제

      // 토큰 생성
      const accessToken = jwtController.adminSign(email, adminResult.data._id);
      const refreshToken = jwtController.refresh(email, adminResult.data._id);

      // 쿠키에 토큰 저장
      userController.setTokenCookie(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: '로그인 성공',
        data: adminResult,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @router POST /admin/logout
   * @group Admin
   * @Summary 관리자 로그아웃
   */
  route.post('/logout', isAuth, async (req, res) => {
    try {
      // 쿠키를 삭제하여 로그아웃 처리
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(200).json({
        success: true,
        message: '로그아웃 되었습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @router POST /admin/refresh
   * @group Admin
   * @Summary 관리자 토큰 갱신
   */
  route.post('/refresh', async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.',
        });
      }

      // Refresh 토큰 검증
      const refreshVerify = await jwtController.refreshVerify(refreshToken);
      if (!refreshVerify.success) {
        return res.status(401).json({
          success: false,
          message: 'Refresh Token 검증에 실패했습니다.',
        });
      }

      const email = refreshVerify.decoded.email;
      const user_id = refreshVerify.decoded.user_id;

      // Access 토큰 재발급
      const newAccessToken = jwtController.adminSign(email, user_id);
      const newRefreshToken = jwtController.refresh(email, user_id);

      // 쿠키에 토큰 저장
      userController.setTokenCookie(res, newAccessToken, newRefreshToken);

      return res.status(200).json({
        success: true,
        message: '토큰이 갱신되었습니다.',
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });
};
