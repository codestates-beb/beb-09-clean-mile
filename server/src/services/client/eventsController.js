const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const { updateCommentLikes } = require('./commentsController');
const { postViews } = require('./postsController');

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
      return { success: false };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, eventResult);

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

    if (event.remaining <= 0) {
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

module.exports = { findEventDetail, eventEntry, getEventById };
