const mongoose = require("mongoose");

/**
 * Users Collection Schema
 */
const userSchema = new mongoose.Schema({
  email: {
    // 사용자 이메일
    type: String,
    required: true,
  },
  name: {
    // 사용자 이름
    type: String,
    required: true,
  },
  phone_number: {
    // 사용자 전화번호
    type: String,
    required: true,
  },
  user_type: {
    // 사용자 권한
    // 0:일반 사용자, 1:관리자
    type: Number,
    default: 0,
  },
  hashed_pw: {
    // 사용자 비밀번호 (해시)
    type: String,
  },
  nickname: {
    // 사용자 닉네임
    type: String,
  },
  social_provider: {
    // 소셜 로그인
    // noen:없음, kakao:카카오, google:구글
    type: String,
  },
  banner_img_url: {
    // 배너 이미지 URL
    type: String,
  },
  wallet: {
    address: {
      // 사용자 지갑 주소
      type: String,
    },
    hashed_pk: {
      // 사용자 지갑 비밀키 (해시)
      type: String,
    },
    token_amount: {
      // 사용자 토큰 수량
      type: Number,
    },
    badge_amount: {
      // 사용자 뱃지 수량
      type: Number,
    },
    total_badge_score: {
      // 사용자 뱃지 총 점수
      type: Number,
    },
  },
  created_at: {
    // 사용자 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 사용자 정보 수정일
    type: Date,
    default: Date.now,
  },
  post: {
    // posts collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  comment: {
    // comments collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
  dnft: {
    // dnfts collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "dnft",
  },
});

/**
 * 데이터 저장 전에 비밀번호 암호화 처리
 */
userSchema.pre("save", (next) => {
  let user = this;
});

const Users = mongoose.model("user", userSchema);
module.exports = Users;
