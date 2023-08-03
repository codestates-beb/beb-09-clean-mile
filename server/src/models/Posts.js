const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * Posts Collection Schema
 */
const postSchema = new mongoose.Schema({
  user_id: {
    // users collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  category: {
    // 게시글 카테고리
    type: String,
    enum: ['notice', 'general', 'review'],
  },
  event_id: {
    // events collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
  title: {
    // 게시글 제목
    type: String,
  },
  content: {
    // 게시글 내용
    type: String,
  },
  media: {
    // 게시글 미디어
    img: {
      // 이미지
      type: Array,
    },
    video: {
      // 비디오
      type: Array,
    },
  },
  view: {
    count: {
      // 조회수
      type: Number,
      default: 0,
    },
    viewers: {
      // 조회자
      type: Array,
    },
  },
  created_at: {
    // 게시글 생성일
    type: Date,
    default: getKorDate,
  },
  updated_at: {
    // 게시글 수정일
    type: Date,
    default: getKorDate,
  },
});

const Posts = mongoose.model('post', postSchema);
module.exports = Posts;
