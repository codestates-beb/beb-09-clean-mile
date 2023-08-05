const Router = require('express');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminCommentController = require('../../../services/admin/commentsController');
const { getUser } = require('../../../services/client/usersController');
const route = Router();

module.exports = (app) => {
  app.use('/admin/comments', route);

  /**
   * @route POST /admin/comments/list
   * @group Admin - Comment
   * @summary 댓글 리스트 조회
   */
  route.get('/list', isAdminAuth, async (req, res) => {
    try {
      let {
        category,
        page = 1,
        title = null,
        content = null,
        writer = null,
        limit = 10,
      } = req.query;

      if (category === 'all') {
        category = { $in: ['general', 'event', 'review'] };
      }

      // 댓글 정보 조회
      const comments = await adminCommentController.getComments(
        category,
        page,
        title,
        content,
        writer,
        limit
      );

      return res.status(200).json({
        success: true,
        message: '댓글 정보 조회 성공',
        data: comments,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  route.get('/detail/:comment_id', isAdminAuth, async (req, res) => {
    try {
      const { comment_id } = req.params;

      // 댓글 조회
      const comment = await adminCommentController.getComment(comment_id);
      if (!comment.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 댓글입니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '댓글 조회 성공',
        data: comment.data,
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  route.delete('/delete/:comment_id', isAdminAuth, async (req, res) => {
    try {
      const { comment_id } = req.params;

      // 댓글 조회
      const comment = await adminCommentController.getComment(comment_id);
      if (!comment.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 댓글입니다.',
        });
      }

      // 관리자 확인
      const user = await getUser(req.decoded.user_id);
      if (!user.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 사용자입니다.',
        });
      }

      if (!req.decoded.isAdmin || user.data.user_type !== 'admin') {
        return res.status(401).json({
          success: false,
          message: '관리자 권한이 없습니다.',
        });
      }

      // 댓글 삭제
      const result = await adminCommentController.deleteComment(comment_id);
      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: '댓글 삭제 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '댓글 삭제 성공',
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
