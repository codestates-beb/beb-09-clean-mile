const Router = require('express');
const multer = require('multer');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const { saveFiles } = require('../../../services/client/postsController');
const { fileValidation } = require('../../middlewares/fileValidation');
const adminNoticesController = require('../../../services/admin/noticesController');
const storage = multer.memoryStorage(); // 이미지를 메모리에 저장
const upload = multer({ storage: storage });

const route = Router();

module.exports = (app) => {
  app.use('/admin/notice', route);

  /**
   * @route POST /admin/notice/list
   * @group Admin - Notice
   * @summary 공지사항 리스트 조회
   */
  route.get('/list', isAdminAuth, async (req, res) => {
    try {
      const { page = 1, limit = 10, title = null, content = null } = req.query;
      const category = 'notice';

      // 공지사항 정보 조회
      const notices = await adminNoticesController.getNotices(
        page,
        limit,
        title,
        content,
        category
      );

      if (!notices) {
        return res.status(400).json({
          success: false,
          message: '공지사항 정보 조회 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '공지사항 정보 조회 성공',
        data: notices,
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
   * @route POST /admin/notice/create
   * @group Admin - Notice
   * @summary 공지사항 생성
   */
  route.post(
    '/create',
    isAdminAuth,
    upload.fields([{ name: 'image' }, { name: 'video' }]),
    fileValidation,
    async (req, res) => {
      try {
        const category = 'notice';
        const { title, content } = req.body;
        if (!title || !content) {
          return res.status(400).json({
            success: false,
            message: '필수 입력값이 없습니다.',
          });
        }

        // 파일 저장
        const files = await saveFiles(req.files);
        if (!files) {
          return res.status(400).json({
            success: false,
            message: '파일 저장에 실패했습니다.',
          });
        }

        // 공지사항 생성
        const result = await adminNoticesController.saveNotice(
          title,
          content,
          req.decoded.user_id,
          category,
          files
        );

        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: '공지사항 생성 실패',
          });
        }

        return res.status(200).json({
          success: true,
          message: '공지사항 생성 성공',
          id: result.data,
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
   * @route PATCH /admin/notice/edit
   * @group Admin - Notice
   * @summary 공지사항 수정
   */
  route.patch('/edit', isAdminAuth, upload.none(), async (req, res) => {
    try {
      const { id, title = null, content = null } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '필수 입력값이 없습니다.',
        });
      }

      // 공지사항 조회
      const notice = await adminNoticesController.getNotice(id);
      if (!notice.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 공지사항입니다.',
        });
      }

      // 관리자 확인
      if (
        notice.data.user_id.toString() !== req.decoded.user_id ||
        !req.decoded.isAdmin
      ) {
        return res.status(400).json({
          success: false,
          message: '권한이 없습니다.',
        });
      }

      // 공지사항 수정
      const result = await adminNoticesController.updateNotice(
        id,
        title,
        content
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '공지사항 수정 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '공지사항 수정 성공',
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
   * @route DELETE /admin/notice/delete/:id
   * @group Admin - Notice
   * @summary 공지사항 삭제
   */
  route.delete('/delete/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // 공지사항 조회
      const notice = await adminNoticesController.getNotice(id);
      if (!notice.success) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 공지사항입니다.',
        });
      }

      // 관리자 확인
      if (
        notice.data.user_id.toString() !== req.decoded.user_id ||
        !req.decoded.isAdmin
      ) {
        return res.status(400).json({
          success: false,
          message: '권한이 없습니다.',
        });
      }

      // 공지사항 삭제
      const result = await adminNoticesController.deleteNotice(id);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: '공지사항 삭제 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '공지사항 삭제 성공',
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
