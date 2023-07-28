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
    return { success: false };
  }
};

const findComment = async (commentId) => {
  try {
    const result = await CommentModel.findById(commentId);
    if (!result) {
      return { success: false };
    }
    return { success: true, data: result };
  } catch (err) {
    console.error('Error:', err);
    return { success: false };
  }
};

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
    return { success: false };
  }
};

module.exports = { saveComment, findComment, editComment };
