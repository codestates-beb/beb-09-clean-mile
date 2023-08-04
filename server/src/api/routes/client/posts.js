const Router = require('express');
const multer = require('multer');
const isAuth = require('../../middlewares/isAuth');
const jwtUtil = require('../../../utils/jwtUtil');
const PostModel = require('../../../models/Posts');
const postsController = require('../../../services/client/postsController');
const { fileValidation } = require('../../middlewares/fileValidation');
const storage = multer.memoryStorage(); // 이미지를 메모리에 저장
const upload = multer({ storage: storage });

const route = Router();

module.exports = (app) => {
  app.use('/posts', route);

  /**
   * @router POST /posts/create
   * @group Posts
   * @Summary 게시글 생성
   */
  route.post(
    '/create',
    isAuth,
    upload.fields([{ name: 'image' }, { name: 'video' }]),
    fileValidation,
    async (req, res) => {
      try {
        const postData = req.body;
        if (
          !postData.category ||
          !postData.title ||
          !postData.content ||
          (postData.category === 'review' && !postData.event_id)
        ) {
          return res.status(400).json({
            success: false,
            message: '필수 입력값이 없습니다.',
          });
        }

        // 파일 저장
        const saveFiles = await postsController.saveFiles(req.files);
        if (!saveFiles) {
          return res.status(400).json({
            success: false,
            message: '파일 저장에 실패했습니다.',
          });
        }

        // 게시글 저장
        const result = await postsController.savePost(
          req.decoded.user_id,
          postData,
          saveFiles
        );
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: result.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: '게시글을 저장했습니다.',
          postId: result.data,
        });
      } catch (err) {
        // 기타 에러 처리
        console.error('Error:', err);
        return res.status(500).json({
          success: false,
          message: '서버 오류',
        });
      }
    }
  );

  /**
   * @router POST /posts/edit
   * @group Posts
   * @Summary 게시글 수정
   */
  route.patch('/edit', isAuth, upload.none(), async (req, res) => {
    try {
      const { post_id, title, content } = req.body;

      if (!post_id || (!title && !content)) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      const postData = await PostModel.findById(post_id);
      if (!postData) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
        });
      }

      // 게시글 작성자 확인
      if (postData.user_id.toString() !== req.decoded.user_id) {
        return res.status(400).json({
          success: false,
          message: '게시글 작성자가 아닙니다.',
        });
      }

      // 게시글 수정
      let editTitleResult = { success: true };
      let editContentResult = { success: true };

      if (title && title !== postData.title) {
        editTitleResult = await postsController.editPostField(post_id, {
          title,
        });
      }

      if (content && content !== postData.content) {
        editContentResult = await postsController.editPostField(post_id, {
          content,
        });
      }

      if (!editTitleResult.success || !editContentResult.success) {
        return res.status(400).json({
          success: false,
          message: '게시글 수정에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '게시글을 수정했습니다.',
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
   * @router DELETE /posts/delete
   * @group Posts
   * @Summary 게시글 삭제
   */
  route.delete('/delete/:post_id', isAuth, async (req, res) => {
    try {
      const post_id = req.params.post_id;
      if (!post_id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      const postData = await PostModel.findById(post_id);
      if (!postData) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
        });
      }

      // 게시글 작성자 확인
      if (
        postData.user_id.toString() === req.decoded.user_id ||
        req.decoded.isAdmin
      ) {
        // 게시글 삭제
        const deleteResult = await postsController.deletePost(post_id);
        if (!deleteResult.success) {
          return res.status(400).json({
            success: false,
            message: '게시글 삭제에 실패했습니다.',
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: '게시글 작성자가 아닙니다.',
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
   * @router GET /posts/lists
   * @group Posts
   * @Summary 게시글 목록 조회
   */
  route.get('/lists/:category', upload.none(), async (req, res) => {
    try {
      const category = req.params.category;
      const {
        page = 1,
        limit = 10,
        last_id = null,
        order = 'desc',
        title = null,
        content = null,
      } = req.query;

      let result;

      // General -> list
      if (category === 'general') {
        result = await postsController.getPosts(
          page, // 조회할 페이지 번호
          limit,
          order, // 정렬 순서
          category,
          title,
          content
        );
      }

      // Review -> infinite scroll
      if (category === 'review') {
        result = await postsController.getReviews(
          last_id, // 마지막 게시글 id
          limit,
          title,
          content,
          order
        );
      }

      return res.status(200).json({
        success: true,
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
   * @router GET /posts/list/notice
   * @group Posts
   * @Summary 공지사항 목록 조회 (list)
   */
  route.get('/list/notice', async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        order = 'desc',
        title = null,
        content = null,
      } = req.query;

      const category = 'notice';
      const result = await postsController.getPosts(
        page, // 조회할 페이지 번호
        limit,
        order, // 정렬 순서
        category,
        title,
        content
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '공지사항 정보 조회 실패',
        });
      }

      return res.status(200).json({
        success: true,
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
   * @router GET /posts/detail
   * @group Posts
   * @Summary 게시글 상세 조회
   */
  route.get('/detail/:post_id', async (req, res) => {
    try {
      const post_id = req.params.post_id;
      let user_id = null;

      if (req.cookies.accessToken) {
        const decoded = jwtUtil.verify(req.cookies.accessToken);
        if (!decoded.success) {
          return res.status(401).json({
            success: false,
            message: `Access Token : ${result.message}`,
          });
        }
        user_id = decoded.decoded.user_id;
      }

      // 게시글 상세 조회
      const postDetailResult = await postsController.findDetailPost(
        req,
        post_id,
        user_id
      );
      if (!postDetailResult.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '게시글 상세 조회에 성공했습니다.',
        data: postDetailResult.data,
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
   * @router GET /posts/notices_latest
   * @group Posts
   * @Summary 최신 공지사항 조회 (1개)
   */
  route.get('/notices_latest', async (req, res) => {
    try {
      const result = await postsController.noticesLatestPost();
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '최신 공지사항 조회에 성공했습니다.',
        data: result.data[0],
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
