const mongoose = require("mongoose");

/**
 * Events Collection Schema
 */
const eventSchema = new mongoose.Schema({
  title: {
    // 이벤트명
    type: String,
  },
  poster_url: {
    // 포스터 이미지 URL
    type: String,
  },
  content: {
    // 이벤트 내용
    type: String,
  },
  area: {
    // 개최지 (도, 특별시 단위)
    type: String,
  },
  capacity: {
    // 모집 인원
    type: Number,
  },
  status: {
    // 이벤트 진행 상태
    // 0:모집 전, 1:모집 중, 2:모집 마감
    type: Number,
    default: 0,
  },
  host: {
    //주최측 정보
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
  },
  recruitment_start_at: {
    // 모집 시작일
    type: Date,
  },
  recruitment_end_at: {
    // 모집 마감일
    type: Date,
  },
  event_start_at: {
    // 이벤트 시작일
    type: Date,
  },
  event_end_at: {
    // 이벤트 종료일
    type: Date,
  },
  users: {
    // 참여자 정보
    type: Map,
    of: {
      is_confirmed: {
        // 참가 확정 여부
        type: Boolean,
      },
      is_nft_issued: {
        // nft 지급 여부
        type: Boolean,
      },
      is_token_rewarded: {
        // 후기 작성 보상 지급 여부
        type: Boolean,
      },
    },
  },
  created_at: {
    // 이벤트 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 이벤트 정보 수정일
    type: Date,
    default: Date.now,
  },
  post: {
    // posts collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  badge: {
    // badges collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "badge",
  },
});

const Events = mongoose.model("event", eventSchema);
module.exports = Events;
