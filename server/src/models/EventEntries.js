const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * EventEntries Collection Schema
 */
const eventEntrySchema = new mongoose.Schema({
  event_id: {
    // 이벤트 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
    required: true
  },
  user_id: {
    // 사용자 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  is_confirmed: {
    // 참가 인증 여부
    type: Boolean,
    default: false,
  },
  is_nft_issued: {
    // nft 지급 여부
    type: Boolean,
    default: false,
  },
  is_token_rewarded: {
    // 후기 작성 보상 지급 여부
    type: Boolean,
    default: false,
  },
  created_at: {
    // 이벤트 참가자 데이터 생성일
    type: Date,
    default: getKorDate,
  },
  updated_at: {
    // 이벤트 참가자 데이터 수정일
    type: Date,
    default: getKorDate,
  },
});

const EventEntry = mongoose.model('eventEntry', eventEntrySchema);
module.exports = EventEntry;
