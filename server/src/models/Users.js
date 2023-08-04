const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/index');

/**
 * Users Collection Schema
 */
const userSchema = new mongoose.Schema({
  email: {
    // 사용자 이메일
    type: String,
    required: true,
    unique: true,
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
    type: String,
    enum: ['user', 'admin'],
  },
  hashed_pw: {
    // 사용자 비밀번호 (해시)
    type: String,
  },
  nickname: {
    // 사용자 닉네임
    type: String,
    unique: true,
  },
  social_provider: {
    // 소셜 로그인
    type: String,
    enum: ['none', 'kakao', 'google'],
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
    private_key: {
      // 사용자 지갑 비밀키 (해시)
      type: String,
    },
    mileage_amount: {
      // 사용자 마일리지 수량
      type: Number,
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
});

/**
 * 사용자 비밀번호 암호화 함수
 */
userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('hashed_pw')) {
    bcrypt.genSalt(config.saltRounds, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.hashed_pw, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.hashed_pw = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * 사용자 비밀번호 비교 함수
 * @param {string} plainPW
 * @returns 일치 여부
 */
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.hashed_pw);
};

const Users = mongoose.model('user', userSchema);
module.exports = Users;
