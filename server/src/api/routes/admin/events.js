const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminEventsController = require('../../../services/admin/eventsController');
const badgeController = require('../../../services/contract/badgeController');
const dnftController = require('../../../services/contract/dnftController');

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
   * @route POST /admin/events/createBadge
   * @group Admin - Event
   * @summary 이벤트 관련 뱃지 생성(민팅)
   */
  route.post(
    '/createBadge',
    /*isAdminAuth*/ async (req, res) => {
      try {
        const { name, description, imageUrl, badgeType, amount, eventTitle } =
          req.body;
        const createBadge = await badgeController.createBadge(
          name,
          description,
          imageUrl,
          badgeType,
          amount,
          eventTitle
        );
        if (createBadge.success) {
          return res.status(200).json({
            success: true,
            message: '뱃지 생성 성공',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: '뱃지 생성 실패',
          });
        }
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
   * @route POST /admin/events/transferBadges
   * @group Admin - Event
   * @summary 참여 인증 완료 사용자에게 뱃지 전송
   */
  route.post(
    '/transferBadges',
    /*isAdminAuth*/ async (req, res) => {
      try {
        const { eventId, eventTitle } = req.body;

        const recipients = await badgeController.isConfirmedUser(eventId);
        if (!recipients.success) {
          return res
            .status(400)
            .json({ success: false, message: '뱃지 전송 실패' });
        }
        console.log(recipients.data);
        const transferBadges = await badgeController.transferBadges(
          recipients.data,
          eventId
        );
        if (transferBadges.success) {
          //email
          for (const userId of recipients.data) {
            const updateDescription = await dnftController.updateDescription(
              userId,
              eventTitle
            );
            if (!updateDescription.success)
              return res.status(400).json({ success: false });
          }
          return res.status(200).json({
            success: true,
            message: '뱃지 전송 성공',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: '뱃지 전송 실패',
          });
        }
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
          success: false,
          message: '서버 오류',
        });
      }
    }
  );
};
