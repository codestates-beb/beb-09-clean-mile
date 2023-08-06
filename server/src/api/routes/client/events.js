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
      const {
        last_id = null,
        limit = 10,
        title = null,
        content = null,
        status = null,
      } = req.query;

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
      if (req.cookies.accessToken) {
        const decoded = jwtUtil.verify(req.cookies.accessToken);
        if (!decoded.success) {
          user_id = null;
        } else {
          user_id = decoded.decoded.user_id;
        }
      }

      // 행사 상세 조회
      const result = await eventsController.findEventDetail(
        req,
        event_id,
        user_id
      );
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: '행사가 존재하지 않습니다.',
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
      const result = await eventsController.eventEntry(
        event_id,
        req.decoded.user_id
      );
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
  route.post('/verify', isAuth, upload.none(), async (req, res) => { // 이 부분 돌아가긴 하는데 최적화가 필요함
    try {
      const user_id = req.decoded.user_id;
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '필수 입력 값이 없습니다.',
        });
      }

      /*
      이 부분 함수를 조금 나눕시다

      1. qr 인증
      2. 배지 지급
      3. event entry 업데이트(인증 + 배지 지급 상태)
      4. user 업데이트 (배지 개수 및 총 점수)
      */

      // 행사 참여 인증
      const result = await eventsController.validateQRParticipation(
        token,
        user_id
      );
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
      const tokenResult = jwtAdminUtil.qrVerify(token);
      const event_id = tokenResult.decoded.event_id;

      const transferBadgeResult = await badgeController.transferBadge(
        user_id,
        event_id
      );
      if (!transferBadgeResult.success) {
        return res.status(400).json({
          success: false,
          message: transferBadgeResult.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: '행사 참여 인증 및 뱃지 지급 성공',
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
