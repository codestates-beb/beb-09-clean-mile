const PostModel = require('../../models/Posts');
const { findUserEmail } = require('./usersController');

/**
 * 자유 게시글 저장
 * @param {*} email
 * @param {*} postData
 * @param {*} media
 * @returns 게시글 id
 */
const savePost = async (email, postData, media) => {
  try {
    const userData = await findUserEmail(email);
    const saveData = {
      user_id: userData._id,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      media: media,
    };

    // 저장하려는 게시글의 카테고리가 리뷰인 경우 event_id 필드 추가
    if (postData.category === 'Review') {
      saveData.event_id = postData.event_id;
    }

    // 게시글 저장
    const saveResult = new PostModel(saveData);
    const result = await saveResult.save();
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result._id };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 제목 수정
 * @param {*} postId
 * @param {*} title
 * @returns 성공여부
 */
const editPostTitle = async (postId, title) => {
  try {
    const result = await PostModel.updateOne({ _id: postId }, { title: title });
    if (!result) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 내용 수정
 * @param {*} postId
 * @param {*} content
 * @returns 성공여부
 */
const editPostContent = async (postId, content) => {
  try {
    const result = await PostModel.updateOne(
      { _id: postId },
      { content: content }
    );
    if (!result) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 삭제
 * @param {*} postId
 * @returns 성공여부
 */
const deletePost = async (postId) => {
  try {
    const result = await PostModel.deleteOne({ _id: postId });
    if (!result) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { savePost, editPostTitle, editPostContent, deletePost };
