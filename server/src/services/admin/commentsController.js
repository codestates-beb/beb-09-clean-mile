const CommentModel = require('../../models/Comments');
const PostModel = require('../../models/Posts');
const UserModel = require('../../models/Users');
const calcPagination = require('../../utils/calcPagination');
const { escapeRegexChars } = require('../../utils/common');

/**
 * 댓글 리스트 조회
 * @param {*} category
 * @param {*} page
 * @param {*} title
 * @param {*} content
 * @param {*} writer
 * @param {*} limit
 * @returns 리스트 조회 결과, 페이지네이션 정보
 */
const getComments = async (category, page, title, content, writer, limit) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    let query = {};

    // 카테고리를 검색할 경우
    let postIds;
    if (category) {
      postIds = await PostModel.find({ category }).select('_id title');
    }

    // 제목을 검색할 경우 (대소문자 구분 없이 검색)
    if (title) {
      const filterPosts = postIds.filter((postId) => {
        if (postId.title.toLowerCase().includes(title.toLowerCase())) {
          return postId._id;
        }
      });

      query.post_id = { $in: filterPosts };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(escapeRegexChars(content), 'i') };
    }

    // 작성자를 검색할 경우
    if (writer) {
      // nickname으로 검색
      const user = await UserModel.findOne({ nickname: writer }).select('_id');
      if (!user) {
        return { success: false };
      }

      query.user_id = user._id;
    }

    // 댓글 목록 조회
    const result = await CommentModel.find(query)
      .populate('user_id', ['nickname'])
      .populate('post_id', ['title', 'category'])
      .select('-__v -likes.likers')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // 결과가 없는 경우
    if (result.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await CommentModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return { data: result, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 댓글 아이디를 통한 댓글 조회
 * @param {*} comment_id
 * @returns 조회 결과
 */
const getComment = async (comment_id) => {
  try {
    // 댓글 조회
    const comment = await CommentModel.findById(comment_id)
      .select('-__v -likes.likers')
      .populate('user_id', ['nickname'])
      .populate('post_id', ['title', 'category']);
    if (!comment) {
      return { success: false };
    }

    return { success: true, data: comment };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 댓글 삭제
 * @param {*} comment_id
 * @returns 성공 여부
 */
const deleteComment = async (comment_id) => {
  try {
    // 댓글 삭제
    const result = await CommentModel.findByIdAndDelete(comment_id);
    if (!result) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { getComments, getComment, deleteComment };
