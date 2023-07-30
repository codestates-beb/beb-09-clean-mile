const Router = require('express');
const upload = require('../../../loaders/s3');
const jwtController = require('../../../services/jwtController');
const eventsController = require('../../../services/client/eventsController');
const isAuth = require('../../middlewares/isAuth');
const { postViews } = require('../../../services/client/postsController');

const route = Router();

module.exports = (app) => {
  app.use('/events', route);

  /**
   * @router POST /events/detail/:_id
   * @group Events
   * @Summary 행사 내용 상세 조회
   */
  route.get('/detail/:_id', async (req, res) => {
    try {
      const event_id = req.params;
      let user_id = null;

      // 행사 참여 여부 확인
      if (req.cookies.accessToken) {
        const decoded = jwtController.verify(req.cookies.accessToken);
        if (!decoded.success) {
          return res.status(401).json({
            success: false,
            message: `Access Token : ${result.message}`,
          });
        }

        user_id = decoded.decoded.user_id;
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
   * @router POST /events/subscribe
   * @group Events
   * @Summary 행사 참여
   */
  route.post('/subscribe', isAuth, upload.none(), async (req, res) => {});
};