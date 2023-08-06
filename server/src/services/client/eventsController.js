const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const QRCodeModel = require('../../models/QRCode');
const { updateCommentLikes } = require('./commentsController');
const { postViews } = require('./postsController');
const { getKorDate } = require('../../utils/common');
const jwtAdminUtil = require('../../utils/jwtAdminUtil');

/**
 * 행사 상세 정보, 댓글 조회
 * @param {*} event_id
 * @param {*} user_id
 * @returns
 */
const findEventDetail = async (req, event_id, user_id) => {
  try {
    // 이벤트 정보 조회
    const eventResult = await EventModel.findById(event_id)
      .populate('host_id', ['name', 'email', 'phone_number', 'wallet_address', 'organization'])
      .select('-__v');
    if (!eventResult) {
      return { success: false };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, eventResult); // 예외 처리 필요

    // view.viewers 필드 제거
    let objEvent = eventResult.toObject();
    delete objEvent.view.viewers;

    // 로그인을 한 경우
    let is_Entry = false;
    if (user_id) {
      // 행사 신청 여부 조회
      const entryResult = await EventEntryModel.findOne({
        event_id: event_id,
        user_id: user_id,
        is_confirmed: true,
      });

      if (entryResult) {
        is_Entry = true;
      }
    }

    // 게시글에 달린 댓글 정보 조회
    const updatedComments = await updateCommentLikes(event_id, user_id);

    return {
      success: true,
      data: {
        event: objEvent,
        comments: updatedComments,
        is_eventEntry: is_Entry,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 참가 신청
 * @param {*} event_id
 * @param {*} user_id
 * @returns 성공 여부
 */
const eventEntry = async (event_id, user_id) => {
  try {
    // 이벤트 조회
    const event = await EventModel.findById(event_id);
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    if (event.status !== 'recruiting') {
      return { success: false, message: '참가자 모집중인 이벤트가 아닙니다.' };
    }

    const currentTime = getKorDate();
    if (event.remaining <= 0 || event.event_end_at <= currentTime) { // event_end_at 대신 currentTime > recruitment_end_at 인지 체크
      return { success: false, message: '참가자 모집이 마감된 이벤트입니다.' };
    }

    // 이벤트 신청 여부 확인
    const entry = await EventEntryModel.findOne({
      event_id: event_id,
      user_id: user_id,
    });
    if (entry) {
      return { success: false, message: '이미 신청한 이벤트입니다.' };
    }

    // 이벤트 신청
    const eventEntry = new EventEntryModel({
      event_id: event_id,
      user_id: user_id,
    });
    const result = await eventEntry.save();
    if (!result) {
      return { success: false, message: '이벤트 신청에 실패하였습니다.' };
    }

    // 이벤트 remaining 감소
    event.remaining -= 1;
    const eventResult = await event.save();
    if (!eventResult) {
      return {
        success: false,
        message: '이벤트 데이터 수정에 실패했습니다.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * event_id로 이벤트 조회
 * @param {*} event_id
 * @returns 조회 결과
 */
const getEventById = async (event_id) => {
  try {
    // 이벤트 조회
    const result = await EventModel.findById(event_id);
    if (!result) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 행사 참여 인증
 * @param {*} token
 * @param {*} user_id
 * @returns 성공 여부
 */
const validateQRParticipation = async (token, user_id) => {
  try {
    // 토큰 유효성 확인
    console.log(token);
    const tokenResult = jwtAdminUtil.qrVerify(token);
    if (!tokenResult.success) {
      return { success: false, message: '유효하지 않은 토큰입니다.' };
    }

    const event_id = tokenResult.decoded.event_id;

    // QR 코드 조회
    const qrResult = await QRCodeModel.findOne({ event_id: event_id });
    if (!qrResult) {
      return { success: false, message: '존재하지 않는 QR 코드입니다.' };
    }

    // 이벤트 조회
    const event = await EventModel.findById(event_id);
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    if (event.status !== 'progressing') {
      return {
        success: false,
        message: '이벤트가 진행중일 때만 인증할 수 있습니다.',
      };
    }

    // 이벤트 신청 여부 확인
    const entry = await EventEntryModel.findOne({
      event_id: event_id,
      user_id: user_id,
    });
    if (!entry) {
      return { success: false, message: '이벤트에 참가하지 않았습니다.' };
    }

    // 이미 인증한 경우
    if (entry.is_confirmed) {
      return { success: false, message: '이미 인증한 이벤트입니다.' };
    }

    // 참여 인증 정보 업데이트
    entry.is_confirmed = true;
    const result = await entry.save();
    if (!result) {
      return { success: false, message: '인증에 실패하였습니다.' };
    }

    // 마지막 스캔 시간 저장 // 이 부분 빼고 entry 스키마에 인증 시간을 추가할까요?
    qrResult.last_scanned_at = getKorDate();
    const updateQrData = await qrResult.save();
    if (!updateQrData) {
      return { success: false, message: 'QR 데이터 수정에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  findEventDetail,
  eventEntry,
  getEventById,
  validateQRParticipation,
};
