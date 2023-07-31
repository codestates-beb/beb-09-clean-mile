const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminCommentController = require('../../../services/admin/commentsController');

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
};
