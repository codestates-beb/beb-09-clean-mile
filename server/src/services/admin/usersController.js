const calcPagination = require('../../utils/calcPagination');
const clientUsersController = require('../client/usersController');
const commentsController = require('../client/commentsController');
const UserModel = require('../../models/Users');
const CommentModel = require('../../models/Comments');

/**
 * 사용자 정보 조회
 * @param {*} page
 * @param {*} limit
 * @param {*} social_provider
 * @param {*} name
 * @param {*} email
 * @param {*} wallet_address
 * @param {*} last_id
 * @returns
 */
const findUsers = async (
  page,
  limit,
  social_provider,
  name,
  email,
  wallet_address,
  last_id
) => {
  try {
    // 각 변수가 존재하는 경우 쿼리에 추가
    const query = {
      ...(social_provider && { social_provider }),
      ...(name && { name }),
      ...(email && { email }),
      ...(wallet_address && { wallet_address }),
      ...(last_id && { _id: { $lt: last_id } }),
    };

    // 사용자 정보 조회
    const usersResult = await UserModel.find(query)
      .select('-password -__v ')
      .sort({ _id: -1 })
      .limit(limit);

    if (!usersResult.length) {
      // 더이상 결과가 없는 경우
      return { data: null, last_id: null };
    }

    // 마지막 문서의 ID를 가져옴
    const lastId = usersResult[usersResult.length - 1]._id.toString();

    // 전체 데이터 수 조회 후 페이징 계산
    delete query._id;
    const total = await UserModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return { data: usersResult, last_id: lastId, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자별 댓글 조회 (페이지네이션)
 * @param {*} user_id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
const getComments = async (user_id, page, limit) => {
  try {
    let query = { user_id: user_id };

    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    const commentsResult = await CommentModel.find(query)
      .populate('user_id', ['nickname'])
      .populate('post_id', ['title'])
      .select('-__v -likes.likers')
      .sort({ created_at: -1 })
      .skip(skip) // 스킵
      .limit(limit);

    if (commentsResult.length === 0) {
      return { data: null, pagination: null };
    }

    // 전체 데이터 수 조회 후 페이징 계산
    const total = await CommentModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return {
      data: commentsResult,
      pagination: paginationResult,
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 상세 정보 조회 (사용자 정보, 게시글, 이벤트, 댓글)
 * @param {*} user_id
 * @param {*} post_page
 * @param {*} post_last_id
 * @param {*} event_page
 * @param {*} event_last_id
 * @param {*} comment_page
 * @param {*} comment_last_id
 * @param {*} limit
 * @returns
 */
const getUserDetail = async (user_id, page = 1, limit = 5) => {
  try {
    // 사용자 정보 조회
    const user = await clientUsersController.getUser(user_id);
    if (!user) {
      return { success: false, message: '사용자 정보가 존재하지 않습니다.' };
    }

    // 사용자가 작성한 게시글 목록 조회 (review, general)
    const posts = await clientUsersController.getPosts(user_id, page, limit);

    // 사용자가 참여한 이벤트 목록 조회
    const events = await clientUsersController.getEvents(user_id, page, limit);

    // 작성한 댓글 목록 조회
    const commentsResult = await getComments(user_id, page, limit);

    return {
      success: true,
      data: {
        user: user.data,
        posts: posts,
        events: events,
        comments: commentsResult,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 사용자 삭제
 * @param {*} user_id
 * @returns 성공 여부
 */
const deleteUser = async (user_id) => {
  try {
    const userResult = await UserModel.findByIdAndDelete(user_id);
    if (!userResult) {
      return { success: false, message: '사용자 정보가 존재하지 않습니다.' };
    }

    // 사용자 정보 삭제
    const delUserResult = await UserModel.deleteOne({ _id: user_id });
    if (!delUserResult) {
      return { success: false, message: '사용자 정보 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { findUsers, getUserDetail, getComments, deleteUser };
