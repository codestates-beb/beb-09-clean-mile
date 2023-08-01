const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminEventsController = require('../../../services/admin/eventsController');

const route = Router();

module.exports = (app) => {
  app.use('/admin/events', route);

  /**
   * @route POST /admin/events/list
   * @group Admin - Event
   * @summary 이벤트 리스트 확인
   */
  route.get('/list', isAdminAuth, async (req, res) => {
    try {
      const {
        status = null, // 이벤트 상태 ['created', 'recruiting', 'progressing', 'finished', 'canceled']
        page = 1,
        limit = 10,
        title = null,
        content = null,
        organization = null,
      } = req.query;

      // 이벤트 정보 조회
      const events = await adminEventsController.getEvents(
        status,
        page,
        limit,
        title,
        content,
        organization
      );

      return res.status(200).json({
        success: true,
        message: '이벤트 정보 조회 성공',
        data: events,
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
   * @route POST /admin/events/detail/:event_id
   * @group Admin - Event
   * @summary 이벤트 정보 상세 조회
   */
  route.get('/detail/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // 이벤트 정보 조회
      const event = await adminEventsController.getEvent(event_id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: event.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '이벤트 정보 조회 성공',
        data: event.data,
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
   * @route POST /admin/events/detail/entry/:event_id
   * @group Admin - Event
   * @summary 이벤트 참여자 리스트 조회
   */
  route.get('/detail/entry/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // 이벤트 참여자 리스트 조회
      const entries = await adminEventsController.getEventEntries(
        event_id,
        page,
        limit
      );
      if (!entries) {
        return res.status(404).json({
          success: false,
          message: '이벤트 참여자 리스트 조회 실패',
        });
      }

      return res.status(200).json({
        success: true,
        message: '이벤트 참여자 리스트 조회 성공',
        data: entries,
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
