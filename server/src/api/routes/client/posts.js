const Router = require('express');
const upload = require('../../../loaders/s3');
const isAuth = require('../../middlewares/isAuth');
const {
  savePost,
  editPostTitle,
  editPostContent,
  deletePost,
  findDetailPost,
  postViews,
  noticesLatestPost,
  findPost,
  paginationPostList,
} = require('../../../services/client/postsController');
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
    upload.fields([{ name: 'image' }, { name: 'video' }]),
    isAuth,
    async (req, res) => {
      try {
        // 이미지 파일
        const imgUrl = req.files['image']
          ? req.files['image'][0].location
          : null;
        // 비디오 파일
        const videoUrl = req.files['video']
          ? req.files['video'][0].location
          : null;

        const postData = req.body;
        if (
          !postData.category ||
          !postData.title ||
          !postData.content ||
          (postData.category === 'Review' && !postData.event_id)
        ) {
          return res.status(400).json({
            success: false,
            message: '필수 입력값이 없습니다.',
          });
        }

        // 미디어 파일
        const media = {
          img: imgUrl,
          video: videoUrl,
        };

        // 게시글 저장
        const result = await savePost(req.decoded.email, postData, media);
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: '게시글을 저장에 실패했습니다.',
          });
        }

        return res.status(200).json({
          success: true,
          message: '게시글을 저장했습니다.',
          postId: result.data,
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
   * @router POST /posts/edit
   * @group Posts
   * @Summary 게시글 수정
   */
  route.post('/edit', upload.none(), isAuth, async (req, res) => {
    try {
      const { post_id, title, content } = req.body;
      if (!post_id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 게시글 수정
      if (title) {
        const editTitleResult = await editPostTitle(post_id, title);
        if (!editTitleResult.success) {
          return res.status(400).json({
            success: false,
            message: '게시글 제목 수정에 실패했습니다.',
          });
        }
      }

      if (content) {
        const editContentResult = await editPostContent(post_id, content);
        if (!editContentResult.success) {
          return res.status(400).json({
            success: false,
            message: '게시글 내용 수정에 실패했습니다.',
          });
        }
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

      // 게시글 삭제
      const deleteResult = await deletePost(post_id);
      if (!deleteResult.success) {
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
      } = req.query;
      const { title = null, content = null } = req.body;

      //데이터 조회
      const result = await findPost(
        category,
        limit,
        last_id,
        order,
        title,
        content
      );

      // 결과 반환
      const resultData = {
        success: true,
        message: '게시글 리스트 조회에 성공했습니다.',
        data: result.data,
        last_id: result.last_id,
      };

      // list일 경우 페이지 계산
      if (category === 'Notice' || category === 'General') {
        const pageResult = await paginationPostList(category, limit, page);
        resultData.pagination = pageResult.pagination;
      }

      return res.status(200).json(resultData);
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
      if (!post_id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 게시글 상세 조회
      const result = await findDetailPost(post_id);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 게시글입니다.',
        });
      }

      // 조회수 증가
      const viewResult = await postViews(req, post_id);

      return res.status(200).json({
        success: true,
        message: '게시글 상세 조회에 성공했습니다.',
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
   * @router GET /posts/notices_latest
   * @group Posts
   * @Summary 최신 공지사항 조회 (1개)
   */
  route.get('/notices_latest', async (req, res) => {
    try {
      const result = await noticesLatestPost();
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
