const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const QRCodeModel = require('../../models/QRCode');
const UserModel = require('../../models/Users');
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
      .populate('host_id', [
        'name',
        'email',
        'phone_number',
        'wallet_address',
        'organization',
      ])
      .select('-__v');
    if (!eventResult) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, eventResult);
    if (!viewResult || !viewResult.success) {
      return { success: false, message: '조회수 증가에 실패하였습니다.' };
    }

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
    if (event.remaining <= 0 || currentTime > event.recruitment_end_at) {
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
 * qr 인증
 * @param {*} token
 * @param {*} user_id
 * @returns 참여 인증이 확인된 이벤트 아이디
 */
const verifyQRAuth = async (token, user_id) => {
  try {
    // 토큰 유효성 확인
    const tokenResult = jwtAdminUtil.qrVerify(token);
    if (!tokenResult.success) {
      return { success: false, message: '유효하지 않은 토큰입니다.' };
    }

    const event_id = tokenResult.decoded.event_id;

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

    // QR 코드 조회
    const qrResult = await QRCodeModel.findOne({ event_id: event_id });
    if (!qrResult) {
      return { success: false, message: '존재하지 않는 QR 코드입니다.' };
    }

    return { success: true, event_id: event_id, entry_id: entry._id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * event entry 업데이트(인증 + 배지 지급 상태)
 * @param {*} entry_id
 * @returns
 */
const updateEventEntry = async (entry_id) => {
  try {
    const entry = await EventEntryModel.findById(entry_id);
    if (!entry) {
      return { success: false, message: '존재하지 않는 데이터입니다.' };
    }

    entry.is_confirmed = true; // 참여 인증
    entry.is_nft_issued = true; // NFT 발급
    entry.updated_at = getKorDate(); // 업데이트 시간

    const result = await entry.save();
    if (!result) {
      return { success: false, message: '데이터 수정에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * user 업데이트 (배지 개수 및 총 점수)
 * @param {*} user_id
 * @param {*} badge_score
 * @returns 성공 여부
 */
const updateUserBadge = async (user_id, badge_score) => {
  try {
    // 사용자 정보 조회
    const user = await UserModel.findById(user_id);
    if (!user) {
      return { success: false, message: '존재하지 않는 사용자입니다.' };
    }

    user.wallet.badge_amount += 1;
    user.wallet.total_badge_score += badge_score;

    const result = await user.save();
    if (!result) {
      return { success: false, message: '데이터 수정에 실패했습니다.' };
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
  verifyQRAuth,
  updateEventEntry,
  updateUserBadge,
};
