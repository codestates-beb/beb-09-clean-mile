const mongoose = require('mongoose');

/**
 * Posts Collection Schema
 */
const postSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  category: {
    // 게시글 카테고리
    type: String,
  },
  event_id: {
    // 이벤트 ID
    type: String,
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
    },
    viewers: {
      // 조회자
      type: Map,
      of: boolean,
    },
  },
  created_at: {
    // 게시글 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 게시글 수정일
    type: Date,
    default: Date.now,
  },
  user: {
    // users collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  event: {
    // events collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
  comment: {
    // comments collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
  },
});

const Posts = mongoose.model('post', postSchema);
module.exports = Posts;
