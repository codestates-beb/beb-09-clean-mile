const Router = require('express');
const upload = require('../../../loaders/s3');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminEventsController = require('../../../services/admin/eventsController');
const badgeController = require('../../../services/contract/badgeController');
const dnftController = require('../../../services/contract/dnftController');
const { getUser } = require('../../../services/client/usersController');

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
      if (!events) {
        return res.status(400).json({
          success: false,
          message: '이벤트 정보 조회 실패',
        });
      }

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
        return res.status(400).json({
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

  /**
   * @route POST /admin/events/entry/download/:event_id
   * @group Admin - Event
   * @summary 이벤트 참여자 리스트 다운로드
   */
  route.get(
    '/entry/download/:event_id',
    isAdminAuth,
    adminEventsController.exportToExcel
  );

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

  /**
   * @route POST /admin/events/create
   * @group Admin - Event
   * @summary 이벤트 생성 (+ 호스트 생성)
   */
  route.post(
    '/create',
    isAdminAuth,
    upload.single('poster_image'),
    async (req, res) => {
      try {
        const {
          name, // (Host) 주최측 이름
          email, // (Host) 주최측 이메일
          phone_number, // (Host) 주최측 전화번호
          wallet_address, // (Host) 주최측 지갑 주소
          organization, // (Host) 주최측 단체명
          title, // 이벤트명
          content, // 이벤트 내용
          location, // 개최지 (도, 특별시 단위)
          capacity, // 모집 인원
          event_type, // 이벤트 타입 ['fcfs', 'random']
          recruitment_start_at, // 모집 시작일
          recruitment_end_at, // 모집 마감일
          event_start_at, // 이벤트 시작일
          event_end_at, // 이벤트 종료일
        } = req.body;

        // 필수 정보 체크 (host)
        if (
          !name ||
          !email ||
          !phone_number ||
          !wallet_address ||
          !organization
        ) {
          return res.status(400).json({
            success: false,
            message: '주최측 필수 정보를 입력해주세요.',
          });
        }

        // 필수 정보 체크 (event)
        if (
          !title ||
          !content ||
          !location ||
          !capacity ||
          !event_type ||
          !recruitment_start_at ||
          !recruitment_end_at ||
          !event_start_at ||
          !event_end_at
        ) {
          return res.status(400).json({
            success: false,
            message: '이벤트 필수 정보를 입력해주세요.',
          });
        }

        /**
         ******** 주최측 생성 ********
         */
        const hostData = {
          name: name,
          email: email,
          phone_number: phone_number,
          wallet_address: wallet_address,
          organization: organization,
        };

        const host = await adminEventsController.saveEventHost(hostData);
        if (!host) {
          return res.status(400).json({
            success: false,
            message: '주최측 데이터 저장 실패',
          });
        }

        /**
         ******** 이벤트 생성 ********
         */
        const eventData = {
          title: title,
          host_id: host.id,
          content: content,
          location: location,
          capacity: capacity,
          event_type: event_type,
          recruitment_start_at: recruitment_start_at,
          recruitment_end_at: recruitment_end_at,
          event_start_at: event_start_at,
          event_end_at: event_end_at,
        };

        // 이미지 파일
        const imageUrl = req.file;
        if (imageUrl) {
          eventData.poster_url = imageUrl.location;
        }

        const event = await adminEventsController.saveEvent(eventData);
        if (!event) {
          return res.status(400).json({
            success: false,
            message: '이벤트 데이터 저장 실패',
          });
        }

        return res.status(200).json({
          success: true,
          message: '이벤트 데이터 저장 성공',
          event_id: event.id,
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
   * @route PATCH /admin/events/edit
   * @group Admin - Event
   * @summary 이벤트 수정 (+ 호스트 정보 수정)
   */
  route.patch('/edit', isAdminAuth, upload.none(), async (req, res) => {
    try {
      const {
        event_id, // 이벤트 id
        name = null, // (Host) 주최측 이름
        email = null, // (Host) 주최측 이메일
        phone_number = null, // (Host) 주최측 전화번호
        wallet_address = null, // (Host) 주최측 지갑 주소
        organization = null, // (Host) 주최측 단체명
        title = null, // 이벤트명
        content = null, // 이벤트 내용
        location = null, // 개최지 (도, 특별시 단위)
        recruitment_start_at = null, // 모집 시작일
        recruitment_end_at = null, // 모집 마감일
        event_start_at = null, // 이벤트 시작일
        event_end_at = null, // 이벤트 종료일
      } = req.body;

      if (!event_id) {
        return res.status(400).json({
          success: false,
          message: '이벤트 id를 입력해주세요.',
        });
      }

      /**
       ******** 주최측 데이터 수정 ********
       */
      if (name || email || phone_number || wallet_address || organization) {
        const host = await adminEventsController.updateEventHost(
          event_id,
          name,
          email,
          phone_number,
          wallet_address,
          organization
        );

        if (!host.success) {
          return res.status(400).json({
            success: false,
            message: host.message,
          });
        }
      }

      /**
       ******** 이벤트 데이터 수정 ********
       */
      if (
        title ||
        content ||
        location ||
        recruitment_start_at ||
        recruitment_end_at ||
        event_start_at ||
        event_end_at
      ) {
        const event = await adminEventsController.updateEvent(
          event_id,
          title,
          content,
          location,
          recruitment_start_at,
          recruitment_end_at,
          event_start_at,
          event_end_at
        );

        if (!event.success) {
          return res.status(400).json({
            success: false,
            message: event.message,
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: '데이터 수정 성공',
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
   * @route PATCH /admin/events//cancel/:event_id
   * @group Admin - Event
   * @summary 이벤트 취소 (status 수정)
   */
  route.patch('/cancel/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // 관리자 확인
      const admin = await getUser(req.decoded.user_id);
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 사용자입니다.',
        });
      }

      if (!req.decoded.isAdmin || admin.data.user_type !== 'admin') {
        return res.status(400).json({
          success: false,
          message: '관리자만 접근 가능합니다.',
        });
      }

      // 이벤트 취소
      const event = await adminEventsController.updateEventStatus(event_id);
      if (!event.success) {
        return res.status(400).json({
          success: false,
          message: event.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: '이벤트 취소 성공',
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
   * @route DELETE /admin/events/delete/:event_id
   * @group Admin - Event
   * @summary 이벤트 삭제
   */
  route.delete('/delete/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // 관리자 확인
      const admin = await getUser(req.decoded.user_id);
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 사용자입니다.',
        });
      }

      if (!req.decoded.isAdmin || admin.data.user_type !== 'admin') {
        return res.status(400).json({
          success: false,
          message: '관리자만 접근 가능합니다.',
        });
      }

      // 이벤트 삭제
      const event = await adminEventsController.deleteEvent(event_id);
      if (!event.success) {
        return res.status(400).json({
          success: false,
          message: '이벤트 삭제에 실패했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '이벤트 삭제 성공',
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
