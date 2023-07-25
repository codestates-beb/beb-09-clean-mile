const mongoose = require("mongoose");

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
    default: Date.now,
  },
});

const Mails = mongoose.model("mail", mailSchema);
module.exports = Mails;
