const Router = require('express');
const multer = require('multer');
const jwtUtil = require('../../../utils/jwtUtil');
const isAuth = require('../../middlewares/isAuth');
const eventsController = require('../../../services/client/eventsController');
const postsController = require('../../../services/client/postsController');
const badgeController = require('../../../services/contract/badgeController');
const storage = multer.memoryStorage(); // 이미지를 메모리에 저장
const upload = multer({ storage: storage });

const route = Router();

module.exports = (app) => {
  app.use('/events', route);

  /**
   * @router POST /events/list
   * @group Events
   * @Summary 행사 목록 조회
   */
  route.get('/list', async (req, res) => {
    try {
      const { last_id = null, limit = 10, title = null, content = null, status = null } = req.query;

      // 행사 리스트 조회
      const result = await postsController.getEvents(
        last_id, // 마지막 게시글 id
        limit,
        title,
        content,
        status
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '행사 리스트 조회 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '행사 리스트 조회 성공',
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
   * @router GET /events/detail/:_id
   * @group Events
   * @Summary 행사 내용 상세 조회
   */
  route.get('/detail/:_id', async (req, res) => {
    try {
      const event_id = req.params;
      let user_id = null;

      // 행사 참여 여부 확인
      if (req.cookies.clientAccessToken) {
        const decoded = jwtUtil.verify(req.cookies.clientAccessToken);
        if (!decoded.success) {
          user_id = null;
        } else {
          user_id = decoded.decoded.user_id;
        }
      }

      // 행사 상세 조회
      const result = await eventsController.findEventDetail(req, event_id, user_id);
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
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
   * @router POST /events/entry/:event_id
   * @group Events
   * @Summary 행사 참여 신청
   */
  route.post('/entry/:event_id', isAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // 행사 참여 신청
      const result = await eventsController.eventEntry(event_id, req.decoded.user_id);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '행사 참여 신청 성공',
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
   * @router POST /events/entry
   * @group Events
   * @Summary 행사 참여 인증 및 뱃지 지급
   */
  route.post('/verify', isAuth, upload.none(), async (req, res) => {
    try {
      const user_id = req.decoded.user_id;
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '필수 입력 값이 없습니다.',
        });
      }

      // 행사 참여 인증 후 이벤트 아이디 반환
      const verify_token = await eventsController.verifyQRAuth(token, user_id);
      console.log(verify_token);
      if (!verify_token.success) {
        return res.status(400).json({
          success: false,
          message: verify_token.message,
        });
      }

      console.log(user_id, verify_token.event_id);

      // 뱃지 지급 후 뱃지 점수 반환
      const transferBadgeResult = await badgeController.transferBadge(user_id, verify_token.event_id);
      if (!transferBadgeResult.success) {
        return res.status(400).json({
          success: false,
          message: transferBadgeResult.message,
        });
      }

      // event entry 업데이트(인증 + 배지 지급 상태)
      const updateEventEntryResult = await eventsController.updateEventEntry(verify_token.entry_id);
      if (!updateEventEntryResult.success) {
        return res.status(400).json({
          success: false,
          message: updateEventEntryResult.message,
        });
      }

      // user 업데이트 (배지 개수 및 총 점수)
      const updateUserResult = await eventsController.updateUserBadge(user_id, transferBadgeResult.badge_score);
      if (!updateUserResult.success) {
        return res.status(400).json({
          success: false,
          message: updateUserResult.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '행사 참여 인증 및 뱃지 지급 성공',
        badge: transferBadgeResult.data,
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
