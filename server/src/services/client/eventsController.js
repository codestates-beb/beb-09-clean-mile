const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const { updateCommentLikes } = require('./commentsController');
const { postViews } = require('./postsController');

/**
 * 행상 상세 정보, 댓글 조회
 * @param {*} event_id
 * @param {*} user_id
 * @returns
 */
const findEventDetail = async (req, event_id, user_id) => {
  try {
    // 이벤트 정보 조회
    const eventResult = await EventModel.findById(event_id).populate('host_id');
    if (!eventResult) {
      return { success: false };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, eventResult);

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
        event: viewResult,
        comments: updatedComments,
        is_eventEntry: is_Entry,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { findEventDetail };
