const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * Mails Collection Schema
 */
const mailSchema = new mongoose.Schema({
  email: {
    // 인증 코드를 받은 사용자 이메일
    type: String,
  },
  code: {
    // 인증 코드
    type: String,
  },
  authenticated: {
    // 인증 여부
    type: Boolean,
    default: false,
  },
  expiry: {
    // 인증 코드 만료 시간
    type: Date,
  },
  created_at: {
    // 데이터 생성일
    type: Date,
    default: getKorDate,
  },
});

const Mails = mongoose.model('mail', mailSchema);
module.exports = Mails;
