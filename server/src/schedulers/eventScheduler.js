const EventModel = require('../models/Events');
const QRCodeModel = require('../models/QRCode');
const { getKorDate } = require('../utils/common');

/**
 * 이벤트 상태 변경
 * @param {*} event
 * @returns
 */
const updateEventStatus = async (event) => {
  try {
    const currentTime = getKorDate();

    // status = 'created' -> 'recruiting'
    if (
      event.status === 'created' &&
      event.recruitment_start_at <= currentTime
    ) {
      event.status = 'recruiting';
    }

    // status = 'recruiting' -> 'progressing'
    if (event.status === 'recruiting' && event.event_start_at <= currentTime) {
      event.status = 'progressing';
    }

    // status = 'progressing' -> 'finished'
    if (event.status === 'progressing' && event.event_end_at <= currentTime) {
      event.status = 'finished';

      // QRCode isActive = true -> false
      const qrCode = await QRCodeModel.findOne({ event_id: event._id });
      if (qrCode && qrCode.isActive) {
        qrCode.isActive = false;
        await qrCode.save();
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트의 상태를 업데이트하는 스케줄링 함수
 * @returns
 */
module.exports = async () => {
  try {
    // status 값이 'created', 'recruiting', 'progressing'인 이벤트만 조회
    const events = await EventModel.find({
      status: { $nin: ['finished', 'canceled'] },
    });
    if (events.length === 0) {
      console.log('No matching data found. Exiting schedule.');
      return;
    }

    // 이벤트 상태 변경
    events.forEach(async (event) => {
      const result = await updateEventStatus(event);
      if (!result.success) {
        console.error('이벤트 상태 변경에 실패하였습니다.');
      }
    });

    console.log('Event status update schedule completed.');
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};
