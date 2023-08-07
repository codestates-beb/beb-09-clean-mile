const Router = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const isAdminAuth = require('../../middlewares/isAdminAuth');
const adminEventsController = require('../../../services/admin/eventsController');
const badgeController = require('../../../services/contract/badgeController');
const dnftController = require('../../../services/contract/dnftController');
const { getUser } = require('../../../services/client/usersController');
const { getEventById } = require('../../../services/client/eventsController');
const {
  checkFileExistence,
  checkFilesExistence,
  fileValidation,
} = require('../../middlewares/fileValidation');
const storage = multer.memoryStorage(); // 이미지를 메모리에 저장
const upload = multer({ storage: storage });

const route = Router();

module.exports = (app) => {
  app.use('/admin/events', route);

  /**
   * @route GET /admin/events/list
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
   * @route GET /admin/events/detail/:event_id
   * @group Admin - Event
   * @summary 이벤트 정보 상세 조회
   */
  route.get('/detail/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // 이벤트 정보 조회
      const event = await adminEventsController.getEvent(event_id);
      if (!event.success) {
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
   * @route GET /admin/events/detail/entry/:event_id
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
        return res.status(400).json({
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
  /**
   * @Author: Lee jisu
   * @Date: 2023-08-02
   * @Desc: 아래의 내용을 수정함
   * - 이미지 파일을 저장 후 파일 url을 얻는 코드 추가
   * - 이벤트 상태가 ‘finished' 이전 상태일 때만 민팅 가능
   * - amount를 이벤트를 조회해 얻은 참여자 수로 설정
   * - 예외 처리 추가
   */
  route.post(
    '/createBadge',
    isAdminAuth,
    upload.single('image'),
    checkFileExistence,
    fileValidation,
    async (req, res) => {
      try {
        const { event_id, name, description, type } = req.body;

        if (!event_id || !name || !description || !type) {
          return res.status(400).json({
            success: false,
            message: '필수 정보를 입력해주세요.',
          });
        }

        // 이벤트 정보 조회
        const event = await getEventById(event_id);
        if (!event) {
          return res.status(400).json({
            success: false,
            message: event.message,
          });
        }

        if (event.status === 'finished' || event.status === 'canceled') {
          return res.status(400).json({
            success: false,
            message: '이미 종료된 이벤트입니다.',
          });
        }

        // 이미지 파일 저장
        const saveImage = await adminEventsController.saveImage(req.file);
        if (!saveImage) {
          return res.status(400).json({
            success: false,
            message: '이미지 파일 저장 실패',
          });
        }

        // 뱃지 생성
        const createBadge = await badgeController.createBadge(
          name,
          description,
          saveImage,
          Number(type), // badgeType
          event.data.capacity, // amount
          event_id
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
  /**
   * @Author: Lee jisu
   * @Date: 2023-08-02
   * @Desc: 아래의 내용을 수정함
   * - 엔드 포인트 수정
   * - 이벤트 상태가 ‘finished' 상태일 때만 배포 가능
   * - 예외처리 추가
   */
  /**
   * 아직 사용하지 않는 엔드 포인트
   */
  // route.post('/transferBadges/:event_id', isAdminAuth, async (req, res) => {
  //   try {
  //     const { event_id } = req.params;

  //     // 이벤트 정보 조회
  //     const event = await getEventById(event_id);
  //     if (!event) {
  //       return res.status(400).json({
  //         success: false,
  //         message: event.message,
  //       });
  //     }

  //     if (event.data.status !== 'finished') {
  //       return res.status(400).json({
  //         success: false,
  //         message: '뱃지 전송은 finished 상태의 이벤트에서만 가능합니다.',
  //       });
  //     }

  //     // 행사 참여 후 인증 완료한 사용자 조회
  //     const recipients = await badgeController.isConfirmedUser(event_id);
  //     if (!recipients.success) {
  //       return res
  //         .status(400)
  //         .json({ success: false, message: recipients.message });
  //     }

  //     // 뱃지 전송
  //     const transferBadges = await badgeController.transferBadges(
  //       recipients.data,
  //       event_id
  //     );
  //     if (transferBadges.success) {
  //       //email
  //       for (const userId of recipients.data) {
  //         const updateDescription = await dnftController.updateDescription(
  //           userId,
  //           event.data.title
  //         );
  //         if (!updateDescription.success)
  //           return res.status(400).json({ success: false });
  //       }
  //       return res.status(200).json({
  //         success: true,
  //         message: '뱃지 전송 성공',
  //       });
  //     } else {
  //       return res.status(400).json({
  //         success: false,
  //         message: '뱃지 전송 실패',
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     return res.status(500).json({
  //       success: false,
  //       message: '서버 오류',
  //     });
  //   }
  // });

  /**
   * @route POST /admin/events/create
   * @group Admin - Event
   * @summary 이벤트 생성 (+ 호스트 생성)
   */
  route.post(
    '/create',
    isAdminAuth,
    upload.array('poster_image'),
    checkFilesExistence,
    fileValidation,
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

        //@todo 이벤트 타입 체크 확인해보기 (테스트 중)

        // 이벤트 시간 체크
        // if (
        //   !(
        //     recruitment_start_at <
        //     recruitment_end_at <
        //     event_start_at <
        //     event_end_at
        //   )
        // ) {
        //   return res.status(400).json({
        //     success: false,
        //     message: '이벤트 시간을 다시 확인해주세요.',
        //   });
        // }

        // 이미지 파일 저장
        const imageUrls = await adminEventsController.saveImages(req.files);
        if (!imageUrls) {
          return res.status(400).json({
            success: false,
            message: '이미지 파일 저장 실패',
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
          poster_url: imageUrls,
          content: content,
          location: location,
          capacity: capacity,
          remaining: capacity,
          event_type: event_type,
          recruitment_start_at: recruitment_start_at,
          recruitment_end_at: recruitment_end_at,
          event_start_at: event_start_at,
          event_end_at: event_end_at,
        };

        // @todo 이벤트 시간이 어드민 클라이언트에서 입력한 값이 왜 다른지 확인 필요

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

      console.log(content);

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
   * @route PATCH /admin/events/cancel/:event_id
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
      const event = await adminEventsController.setEventStatusCanceled(
        event_id
      );
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

  /**
   * @route POST /admin/events/qrcode/:event_id
   * @group Admin - Event
   * @summary 이벤트 인증 QR코드 생성
   */
  route.post('/qrcode/:event_id', isAdminAuth, async (req, res) => {
    try {
      const { event_id } = req.params;

      // jwt 토큰 생성
      const qrCodeJwt = await adminEventsController.createQRCodeJwt(event_id);
      if (!qrCodeJwt.success) {
        return res.status(400).json({
          success: false,
          message: qrCodeJwt.message,
        });
      }

      // QR 코드 생성 옵션 설정
      const options = {
        errorCorrectionLevel: 'M', // QR 코드의 오류 정정 수준
        type: 'image/png', // 파일 형식
        quality: 0.92, // QR 코드 이미지의 품질 (1에 가까울수록 높음)
        margin: 3, // QR 코드 주변의 여백 설정
      };

      QRCode.toDataURL(qrCodeJwt.data, options, (err, url) => {
        if (err) {
          console.error(err);
          return res.status(400).json({
            success: false,
            message: 'QR 코드 생성 실패',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'QR 코드 생성 성공',
          data: url,
        });
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
