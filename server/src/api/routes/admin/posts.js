const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminPostsController = require('../../../services/admin/postsController');
const { getUser } = require('../../../services/client/usersController');
const tokenController = require("../../../services/contract/tokenController");

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

  /**
   * @route POST /admin/posts/delete/:id
   * @group Admin - Post
   * @summary 게시물(general, review) 삭제
   */
  route.delete('/delete/:post_id', isAdminAuth, async (req, res) => {
    try {
      const { post_id } = req.params;

      // 게시물 조회
      const post = await adminPostsController.getPost(post_id);
      if (!post.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
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

      // 게시물 삭제
      const result = await adminPostsController.deletePost(post_id);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '게시글 삭제에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '게시글을 삭제했습니다.',
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
   * @route POST /admin/posts/reward
   * @group Admin - Post
   * @summary 후기 작성 보상
   */
  route.post('/reward', /*isAdminAuth*/ async (req ,res) => {
    const {userId, eventId} = req.body;
    
    const tokenTransfer = await tokenController.mileageReward(userId, eventId);
    if (!tokenTransfer.success){
      return res.status(400).json({success: false, message: tokenTransfer.message});
    }
    return res.status(200).json({success:true, message: '토큰 보상 지급 성공'});
  })
};
