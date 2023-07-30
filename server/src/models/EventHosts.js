const mongoose = require('mongoose');

/**
 * EventHosts Collection Schema
 */
const eventHostSchema = new mongoose.Schema({
  name: {
    // 주최측 이름
    type: String,
  },
  email: {
    // 주최측 이메일
    type: String,
  },
  phone_number: {
    // 주최측 전화번호
    type: String,
  },
  wallet_addrss: {
    // 주최측 지갑 주소
    type: String,
  },
  organization: {
    // 주최측 단체명
    type: String,
  },
  created_at: {
    // 호스트 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 호스트 정보 수정일
    type: Date,
    default: Date.now,
  },
});

const EventHost = mongoose.model('eventHost', eventHostSchema);
module.exports = EventHost;