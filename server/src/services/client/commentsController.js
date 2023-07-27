const CommentModel = require('../../models/Comments');

/**
 * 댓글 저장
 * @param {*} user_id
 * @param {*} post_id
 * @param {*} content
 * @returns 저장된 댓글 id
 */
const saveComment = async (user_id, post_id, content) => {
  try {
    const comment = new CommentModel({
      user_id: user_id,
      post_id: post_id,
      content: content,
    });

    const result = await comment.save();
    if (!result) {
      return { success: false };
    }

    return { success: true, data: result._id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 댓글 조회
 * @param {*} commentId
 * @returns 조회 결과
 */
const findComment = async (commentId) => {
  try {
    const result = await CommentModel.findById(commentId);
    if (!result) {
      return { success: false };
    }
    return { success: true, data: result };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 댓글 수정
 * @param {*} commentId
 * @param {*} content
 * @returns 성공 여부
 */
const editComment = async (commentId, content) => {
  try {
    const result = await CommentModel.findByIdAndUpdate(
      { _id: commentId },
      { $set: { content: content } }
    );
    if (!result) {
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 댓글 삭제
 * @param {*} commentId
 * @returns 성공 여부
 */
const deleteComment = async (commentId) => {
  try {
    const result = await CommentModel.findByIdAndDelete(commentId);
    if (!result) {
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    throw Error(err);
  }
};

/**
 * 댓글 좋아요 등록/취소
 * @param {*} user_id
 * @param {*} commentId
 */
const likeComment = async (commentData, user_id) => {
  try {
    if (!commentData.data.likes.likers.includes(user_id)) {
      // likes.likers에 user_id가 없으면 추가
      commentData.data.likes.count += 1; // 좋아요 수 증가
      commentData.data.likes.likers.push(user_id); // 좋아요 누른 사람 목록에 추가
    } else {
      // likes.likers에 user_id가 있으면 삭제
      commentData.data.likes.count -= 1; // 좋아요 수 감소
      // 좋아요 누른 사람 목록에서 삭제
      commentData.data.likes.likers = commentData.data.likes.likers.filter(
        (ele) => ele !== user_id
      );
    }

    const result = await commentData.data.save();
    if (!result) {
      return { success: false };
    }
    return { success: true, data: result };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  saveComment,
  findComment,
  editComment,
  deleteComment,
  likeComment,
};