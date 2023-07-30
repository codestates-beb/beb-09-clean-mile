const Router = require('express');
const isAuth = require('../../middlewares/isAuth');
const commentsController = require('../../../services/client/commentsController');
const upload = require('../../../loaders/s3');
const route = Router();

module.exports = (app) => {
  app.use('/comments', route);

  /**
   * @router POST /comments/create
   * @group Posts
   * @Summary 댓글 생성
   */
  route.post('/create', isAuth, upload.none(), async (req, res) => {
    try {
      const user_id = req.decoded.user_id;

      const { post_id, content } = req.body;
      if (!post_id || !content) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 댓글 저장
      const result = await commentsController.saveComment(
        user_id,
        post_id,
        content
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '댓글을 저장에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '댓글을 저장했습니다.',
        id: result.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @router POST /comments/edit
   * @group Posts
   * @Summary 댓글 수정
   */
  route.post('/edit', isAuth, upload.none(), async (req, res) => {
    try {
      const user_id = req.decoded.user_id;

      const { comment_id, content } = req.body;
      if (!comment_id || !content) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      const commentResult = await commentsController.findComment(comment_id);
      if (!commentResult) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 댓글입니다.',
        });
      }

      // 댓글 작성자 확인
      if (
        commentResult.data.user_id.toString() === user_id ||
        req.decoded.isAuth
      ) {
        // 댓글 수정
        if (commentResult.content !== content) {
          const commentSaveResult = await commentsController.editComment(
            comment_id,
            content
          );
          if (!commentSaveResult) {
            return res.status(400).json({
              success: false,
              message: '댓글 수정에 실패했습니다.',
            });
          }
        }
      } else {
        return res.status(400).json({
          success: false,
          message: '댓글 작성자가 아닙니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '댓글을 수정했습니다.',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @router POST /comments/delete
   * @group Posts
   * @Summary 댓글 삭제
   */
  route.delete('/delete/:comment_id', isAuth, async (req, res) => {
    try {
      const user_id = req.decoded.user_id;

      const { comment_id } = req.params;
      if (!comment_id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      const commentResult = await commentsController.findComment(comment_id);
      if (!commentResult) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 댓글입니다.',
        });
      }

      // 댓글 작성자 확인
      if (
        commentResult.data.user_id.toString() === user_id ||
        req.decoded.isAuth
      ) {
        // 댓글 삭제
        const commentDeleteResult = await commentsController.deleteComment(
          comment_id
        );
        if (!commentDeleteResult) {
          return res.status(400).json({
            success: false,
            message: '댓글 삭제에 실패했습니다.',
          });
        }

        return res.status(200).json({
          success: true,
          message: '댓글을 삭제했습니다.',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: '댓글 작성자가 아닙니다.',
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });

  /**
   * @router POST /comments/like
   * @group Posts
   * @Summary 댓글 좋아요
   */
  route.post('/like/:comment_id', isAuth, async (req, res) => {
    try {
      const user_id = req.decoded.user_id;

      const { comment_id } = req.params;
      if (!comment_id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      const commentResult = await commentsController.findComment(comment_id);
      if (!commentResult) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 댓글입니다.',
        });
      }

      // 댓글 좋아요
      const commentLikeResult = await commentsController.likeComment(
        commentResult,
        user_id
      );
      if (!commentLikeResult) {
        return res.status(400).json({
          success: false,
          message: '실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '성공했습니다.',
        data: commentLikeResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  });
};
