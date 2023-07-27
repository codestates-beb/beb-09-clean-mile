const mongoose = require('mongoose');
const PostModel = require('../../models/Posts');
const CommentModel = require('../../models/Comments');
const { findUserEmail } = require('./usersController');

/**
 * 클라이언트 IP 조회
 * @param {*} req
 * @returns ip
 */
const getClientIP = (req) => {
  // expressjs의 req.ip 사용
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

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

/**
 * 게시글 상세 정보, 댓글 조회
 * @param {*} postId
 * @returns 조회 결과
 */
const findDetailPost = async (postId) => {
  try {
    // 게시글 상세 정보 조회
    const postResult = await PostModel.findById(postId).populate('user_id', [
      'nickname',
    ]);
    if (!postResult) {
      return { success: false };
    }

    // 게시글에 달린 댓글 조회
    const commentResult = await CommentModel.find({
      post_id: postId,
    }).populate('user_id', ['nickname']);

    return {
      success: true,
      data: { post: postResult, comment: commentResult },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 조회수 증가
 * @param {*} req
 * @param {*} postId
 */
const postViews = async (req, postId) => {
  try {
    // 클라이언트 IP 조회
    const ipAddr = getClientIP(req);

    // 게시글 조회
    const postResult = await PostModel.findById(postId);

    // 조회자 목록에 현재 IP가 없는 경우 조회수 증가
    if (!postResult.view.viewers.includes(ipAddr)) {
      console.log('조회수 증가');
      postResult.view.count += 1;
      postResult.view.viewers.push(ipAddr);
      await postResult.save();
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 최신 공지사항 게시글 조회 (1개)
 * @returns 조회 결과
 */
const noticesLatestPost = async () => {
  try {
    const result = await PostModel.find({ category: 'Notice' })
      .sort({ created_at: -1 })
      .limit(1);
    if (!result) {
      return { success: false };
    } else {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  savePost,
  editPostTitle,
  editPostContent,
  deletePost,
  findDetailPost,
  postViews,
  noticesLatestPost,
};
