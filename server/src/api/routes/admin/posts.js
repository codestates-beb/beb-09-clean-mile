const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminPostsController = require('../../../services/admin/postsController');

const route = Router();

module.exports = (app) => {
  app.use('/admin/posts', route);

  /**
   * @route POST /admin/posts/list
   * @group Admin - Post
   * @summary 게시물(general, review) 리스트 확인
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
        category = null;
      }

      // 게시물 정보 조회
      const posts = await adminPostsController.getPosts(
        category,
        page,
        title,
        content,
        writer,
        limit
      );

      return res.status(200).json({
        success: true,
        message: '게시물 정보 조회 성공',
        data: posts,
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
