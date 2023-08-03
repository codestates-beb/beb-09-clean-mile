const mongoose = require('mongoose');
const PostModel = require('../../models/Posts');
const CommentModel = require('../../models/Comments');
const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const UserModel = require('../../models/Users');
const calcPagination = require('../../utils/calcPagination');
const { getKorDate, escapeRegexChars } = require('../../utils/common');
const { updateCommentLikes } = require('./commentsController');

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
 * @param {*} user_id
 * @param {*} postData
 * @param {*} media
 * @returns 게시글 id
 */
const savePost = async (user_id, postData, media) => {
  try {
    // 리뷰 게시글을 등록하려고 할 경우
    if (postData.category === 'review') {
      const event = await EventModel.findById(postData.event_id);
      if (!event) {
        return { success: false, message: '존재하지 않는 이벤트입니다.' };
      }

      if (event.status !== 'finished') {
        return {
          success: false,
          message: '이벤트가 종료되어야 후기를 작성할 수 있습니다.',
        };
      }

      // 이벤트 신청자인지 확인
      const entry = await EventEntryModel.findOne({
        event_id: postData.event_id,
        user_id: user_id,
      });
      if (!entry) {
        return {
          success: false,
          message: '이벤트 신청자만 리뷰를 작성할 수 있습니다.',
        };
      }
    }

    const saveData = {
      user_id: userData.data._id,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      media: media,
    };

    // 저장하려는 게시글의 카테고리가 리뷰인 경우 event_id 필드 추가
    if (postData.category === 'review') {
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
 * 게시글의 제목 또는 내용을 수정
 * @param {*} post_id 게시글 ID
 * @param {*} updateFields 수정할 필드와 값을 담은 객체
 * @returns 성공 여부에 따라 객체 반환
 */
const editPostField = async (post_id, updateFields) => {
  try {
    updateFields.updated_at = getKorDate();
    const result = await PostModel.findByIdAndUpdate(
      post_id,
      { $set: updateFields },
      { new: true }
    );

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
const findDetailPost = async (req, postId, user_id) => {
  try {
    // 게시글 상세 정보 조회
    const postResult = await PostModel.findById(postId)
      .populate('user_id', ['nickname'])
      .select('-__v');
    if (!postResult) {
      return { success: false };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, postResult);

    // view.viewers 필드 제거
    let objPost = postResult.toObject();
    delete objPost.view.viewers;

    // 게시글에 달린 댓글 정보 조회
    const updatedComments = await updateCommentLikes(postId, user_id);

    return {
      success: true,
      data: { post: objPost, comment: updatedComments },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 조회수 증가
 * @param {*} req
 * @param {*} postId
 */
const postViews = async (req, postResult) => {
  try {
    // 클라이언트 IP 조회
    const ipAddr = getClientIP(req);

    let result;
    // 조회자 목록에 현재 IP가 없는 경우 조회수 증가
    if (!postResult.view.viewers.includes(ipAddr)) {
      postResult.view.count += 1;
      postResult.view.viewers.push(ipAddr);
      result = await postResult.save();
    } else {
      result = postResult;
    }

    return { success: true, data: result };
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
    const result = await PostModel.find({ category: 'notice' })
      .sort({ created_at: -1 })
      .select('-__v -view.viewers')
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

/**
 * Notice, General 리스트 목록 조회
 * @param {*} page
 * @param {*} limit
 * @param {*} order [desc, view]
 * @param {*} category
 * @param {*} title
 * @param {*} content
 * @returns 조회 결과
 */
const getPosts = async (page, limit, order, category, title, content) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    let query = { category: category };

    // 제목을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(escapeRegexChars(title), 'i') };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(escapeRegexChars(content), 'i') };
    }

    // 정렬 방향에 따라 정렬 객체 생성
    let sort = {};
    if (order === 'desc') {
      sort = { created_at: -1 };
    } else if (order === 'asc') {
      sort = { created_at: 1 };
    } else if (order === 'view') {
      sort = { 'view.count': -1 };
    }

    // 게시글 목록 조회
    const result = await PostModel.find(query)
      .populate('user_id', ['nickname'])
      .select('-view.viewers -__v')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // 결과가 없는 경우
    if (result.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await PostModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return { data: result, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * Event 리스트 목록 조회
 * @param {*} last_id
 * @param {*} limit
 * @param {*} category
 * @param {*} title
 * @param {*} content
 * @param {*} status
 * @returns
 */
const getEvents = async (last_id, limit, title, content, status) => {
  try {
    let query = {};

    // last_id가 존재하면, 마지막 id 이후의 문서 조회
    if (last_id) {
      query._id = { $lt: last_id };
    }

    // 제목을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(escapeRegexChars(title), 'i') };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(escapeRegexChars(content), 'i') };
    }

    // 상태가 존재하면, 해당 상태의 문서 조회
    if (status) {
      query.status = status;
    }

    // 이벤트 ID 배열을 이용해 이벤트 목록 조회
    const events = await EventModel.find(query)
      .populate('host_id', ['name', 'organization'])
      .select('-__v -view.viewers')
      .sort({ created_at: -1 })
      .limit(limit);

    // 결과가 없는 경우
    if (events.length === 0) {
      return { data: null, last_id: null };
    }

    // 마지막 문서의 ID를 가져옴
    const lastId = events[events.length - 1]._id.toString();

    return { data: events, last_id: lastId };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * review 리스트 목록 조회
 * @param {*} last_id
 * @param {*} limit
 * @param {*} title
 * @param {*} content
 * @param {*} order
 * @returns
 */
const getReviews = async (last_id, limit, title, content, order) => {
  try {
    let query = { category: 'review' };

    // 정렬 방향에 따라 정렬 객체 생성
    let sort = {};
    let comparisonOperator = undefined;

    if (order === 'desc') {
      sort = { created_at: -1 };
      comparisonOperator = last_id ? { $lt: last_id } : undefined;
    } else if (order === 'asc') {
      sort = { created_at: 1 };
      comparisonOperator = last_id ? { $gt: last_id } : undefined;
    } else if (order === 'view') {
      // 조회수를 기준으로 정렬하도록 변경
      const viewData = await getPostsByViewCount(last_id, limit);
      const viewIds = viewData.edges.map((item) => item._id.toString());
      query._id = comparisonOperator = { $in: viewIds };
    }

    // last_id가 존재하면, 마지막 id 이후의 문서 조회
    if (comparisonOperator !== undefined) {
      query._id = comparisonOperator;
    }

    // 제목을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(escapeRegexChars(title), 'i') };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(escapeRegexChars(content), 'i') };
    }

    // 게시글 목록 조회
    const result = await PostModel.find(query)
      .populate('user_id', ['nickname'])
      .select('-__v -view.viewers') // 필요없는 필드 제외
      .sort(sort)
      .limit(limit);

    // 결과가 없는 경우
    if (result.length === 0) {
      return { data: null, last_id: null };
    }

    // 마지막 문서의 ID를 가져옴
    const lastId = result[result.length - 1]._id.toString();

    return { data: result, last_id: lastId };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

const getPostsByViewCount = async (next, PAGE_SIZE) => {
  let query = {};

  if (next) {
    const [nextViewCount] = next.split('_');
    query = { 'view.count': { $lt: parseInt(nextViewCount) } };
  }

  const posts = await PostModel.find(query)
    .sort({ 'view.count': -1, _id: -1 }) // 조회수 내림차순으로 정렬
    .limit(PAGE_SIZE + 1) // 한 페이지 크기보다 한 개 더 크게 조회
    .exec();

  const hasNextPage = posts.length > PAGE_SIZE;
  const edges = hasNextPage ? posts.slice(0, -1) : posts;

  const lastItem = edges[edges.length - 1];
  const nextCursor = lastItem ? `${lastItem.view.count}_${lastItem._id}` : null;

  return {
    edges,
    pageInfo: {
      hasNextPage,
      nextCursor: nextCursor,
    },
  };
};

module.exports = {
  savePost,
  editPostField,
  deletePost,
  postViews,
  findDetailPost,
  noticesLatestPost,
  getPosts,
  getEvents,
  getReviews,
};
