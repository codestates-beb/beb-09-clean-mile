const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badge_id: {
    //뱃지 ID(TokenID)
    type: String,
  },
  name: {
    // 뱃지 이름
    type: String,
  },
  description: {
    // 뱃지 설명
    type: String,
  },
  type: {
    // 뱃지 타입
    // 0, 1, 2
    type: Number,
  },
  image_url: {
    // 뱃지 이미지 URL
    type: String,
  },
  token_Uri: {
    // 뱃지 토큰 Uri
    type: String,
  }
  ,
  event_id: {
    // 이벤트 ID
    type: String,
  },
  initial_quantity: {
    // 뱃지 초기 발행량
    type: Number,
  },
  remain_quantity: {
    // 뱃지 잔여 발행량
    type: Number,
  },
  owners: [
    // 뱃지 소유자 [address]
    {
      address: {
        type: String,
      },
    },
  ],
  created_at: {
    // 뱃지 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 뱃지 수정일
    type: Date,
    default: Date.now,
  },
  event: {
    // events collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
});

const Badge = mongoose.model('badge', badgeSchema);
module.exports = Badge;
