const mongoose = require("mongoose");

/**
 * Comments Collection Schema
 */
const commentSchema = new mongoose.Schema({
  user_id: {
    // 사용자 ID
    type: String,
  },
  post_id: {
    // 게시글 ID
    type: String,
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
    },
    likers: {
      // 좋아요 누른 사용자
      type: Map,
      of: Boolean,
    },
  },
  created_at: {
    // 댓글 생성일
    type: Date,
    default: Date.now,
  },
  updated_at: {
    // 댓글 수정일
    type: Date,
    default: Date.now,
  },
  user: {
    // users collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post: {
    // posts collection의 _id를 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
