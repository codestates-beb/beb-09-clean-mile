const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * DNFTs Collection Schema
 */
const dnftSchema = new mongoose.Schema({
  token_id: {
    // 토큰 ID
    type: Number,
  },
  user_id: {
    // 사용자 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    //변동 가능
    type: String,
  },
  description: {
    //변동 가능
    type: String,
  },
  token_uri: {
    //변동 가능
    type: String,
  },
  dnft_level: {
    //변동 가능
    type: Number,
  },
  created_at: {
    // DNFT 정보 생성일
    type: Date,
    default: getKorDate,
  },
  updated_at: {
    // DNFT 정보 수정일
    type: Date,
    default: getKorDate,
  },
});

const DNFT = mongoose.model('dnft', dnftSchema);
module.exports = DNFT;
