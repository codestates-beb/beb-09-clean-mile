const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * Comments Collection Schema
 */
const commentSchema = new mongoose.Schema({
  user_id: {
    // users collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  post_id: {
    // posts collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  content: {
    // 댓글 내용
    type: String,
  },
  likes: {
    // 좋아요
    count: {
      // 좋아요 수
      type: Number,
      default: 0,
    },
    likers: {
      // 좋아요 누른 사용자
      type: Array,
    },
  },
  created_at: {
    // 댓글 생성일
    type: Date,
    default: getKorDate,
  },
  updated_at: {
    // 댓글 수정일
    type: Date,
    default: getKorDate,
  },
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
