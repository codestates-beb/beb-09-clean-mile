const Router = require('express');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const clientUsersController = require('../../../services/client/usersController');
const adminUsersController = require('../../../services/admin/usersController');
const dnftController = require('../../../services/contract/dnftController');
const badgeController = require('../../../services/contract/badgeController');

const route = Router();

module.exports = (app) => {
  app.use('/admin/users', route);

  /**
   * @route POST /admin/users/list
   * @group Admin - User
   * @summary 사용자 리스트 확인
   */
  route.get('/list', isAdminAuth, async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        social_provider = null,
        name = null,
        email = null,
        wallet_address = null,
        last_id = null,
      } = req.query;

      // 사용자 정보 조회
      const result = await adminUsersController.findUsers(
        page,
        limit,
        social_provider,
        name,
        email,
        wallet_address,
        last_id
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '사용자 정보 조회 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '사용자 정보 조회 성공',
        data: {
          users: result.data,
          pagination: result.pagination,
        },
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
   * @todo 토큰, dnft 관련 코드 추가 필여
   * @route POST /admin/users/detail/:id
   * @group Admin - User
   * @summary 사용자 상세 정보 확인
   */
  route.get('/detail/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // 사용자 상세 정보 조회
      const result = await adminUsersController.getUserDetail(id);
      if (!result) {
        return res.status(400).json({
          success: false,
          message: '사용자 상세 정보 조회 실패',
        });
      }

      const dnftData = await dnftController.userDnftData(id);
      if (!dnftData.success)
        return res
          .status(400)
          .json({ success: false, message: '사용자 상세 정보 조회 실패' });
      result.data.dnft = dnftData.data;

      return res.status(200).json({
        success: true,
        message: '사용자 상세 정보 조회 성공',
        data: result.data,
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
   * @route POST /admin/users/detail/eventPagination/:id
   * @group Admin - User
   * @summary 사용자가 참가한 이벤트 리스트
   */
  route.get('/detail/eventPagination/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 5, last_id = null } = req.query;

      // 사용자가 참가한 이벤트 리스트 조회
      const result = await clientUsersController.getEvents(id, page, limit);

      return res.status(200).json({
        success: true,
        message: '사용자가 참가한 이벤트 리스트 조회 성공',
        data: result,
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
   * @route POST /admin/users/detail/postPagination/:id
   * @group Admin - User
   * @summary 사용자가 작성한 게시글 리스트
   */
  route.get('/detail/postPagination/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 5, last_id = null } = req.query;

      // 사용자가 작성한 게시글 리스트 조회
      const result = await clientUsersController.getPosts(id, page, limit);

      return res.status(200).json({
        success: true,
        message: '사용자가 작성한 게시글 리스트 조회 성공',
        data: result,
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
   * @route POST /admin/users/detail/commentPagination/:id
   * @group Admin - User
   * @summary 사용자가 작성한 댓글 리스트
   */
  route.get(
    '/detail/commentPagination/:id',
    isAdminAuth,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { page = 1, limit = 5, last_id = null } = req.query;

        // 사용자가 작성한 댓글 리스트 조회
        const result = await adminUsersController.getComments(id, page, limit);

        return res.status(200).json({
          success: true,
          message: '사용자가 작성한 댓글 리스트 조회 성공',
          data: result,
        });
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
          success: false,
          message: '서버 오류',
        });
      }
    }
  );

  /**
   * @route POST /admin/users/delete/:id
   * @group Admin - User
   * @summary 사용자 계정 삭제
   */
  route.delete('/delete/:id', isAdminAuth, async (req, res, next) => {
    try {
      const { id } = req.params;

      // 사용자 계정 삭제
      const result = await adminUsersController.deleteUser(id);
      if (!result) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '사용자 계정 삭제 성공',
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
