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
};
