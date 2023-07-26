const mongoose = require("mongoose");

/**
 * DNFTs Collection Schema
 */
const dnftSchema = new mongoose.Schema({
  token_id: {
    // 토큰 ID
    type: String,
  },
  user_id: {
    // 사용자 ID
    type: String,
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
    default: Date.now,
  },
  updated_at: {
    // DNFT 정보 수정일
    type: Date,
    default: Date.now,
  },
  user: {
    // users collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const DNFT = mongoose.model("dnft", dnftSchema);
module.exports = DNFT;
