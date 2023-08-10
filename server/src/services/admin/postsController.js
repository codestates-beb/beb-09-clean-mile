const PostModel = require('../../models/Posts');
const UserModel = require('../../models/Users');
const CommentModel = require('../../models/Comments');
const calcPagination = require('../../utils/calcPagination');
const { escapeRegexChars } = require('../../utils/common');

/**
 * 게시글 정보 조회
 * @param {*} category
 * @param {*} page
 * @param {*} title
 * @param {*} content
 * @param {*} writer
 * @returns
 */
const getPosts = async (category, page, title, content, writer, limit) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    let query = {};

    // 카테고리를 검색할 경우
    if (category) {
      query.category = category;
    }

    // 제목을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(escapeRegexChars(title), 'i') };
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

    // 게시글 목록 조회
    const result = await PostModel.find(query)
      .populate('user_id', ['nickname'])
      .select('-__v -view.viewers')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // 결과가 없는 경우
    if (result.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await PostModel.countDocuments(query);
    const pagination = await calcPagination(total, limit, page);

    return { data: result, pagination: pagination };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 아이디로 게시글 조회
 * @param {*} post_id
 * @returns
 */
const getPost = async (post_id) => {
  try {
    // 게시글 조회
    const post = await PostModel.findById(post_id);

    // 게시글이 없는 경우
    if (!post) {
      return { success: false };
    }

    return { success: true, data: post };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

const getPostWithComments = async (post_id) => {
  try {
    // 게시글 조회
    const post = await PostModel.findById(post_id)
      .populate('user_id', ['nickname'])
      .select('-__v -view.viewers');

    // 게시글이 없는 경우
    if (!post) {
      return { success: false, message: '게시글 조회에 실패했습니다.' };
    }

    // 댓글 조회
    const comments = await CommentModel.find({ post_id: post_id })
      .populate('user_id', ['nickname'])
      .select('-__v -post_id -likes.likers');

    if (!comments) {
      return { success: false, message: '댓글 조회에 실패했습니다.' };
    }

    return { success: true, data: { post, comments } };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 게시글 삭제
 * @param {*} post_id
 * @returns
 */
const deletePost = async (post_id) => {
  try {
    // 게시글 삭제
    const result = await PostModel.deleteOne({ _id: post_id });
    if (result.deletedCount === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { getPosts, getPost, deletePost, getPostWithComments };
