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
      user_id: userData.data._id,
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

/**
 * 게시글 목록 조회
 * @param {*} category
 * @param {*} page_size
 * @param {*} last_id
 * @returns 조회결과
 */
const findPost = async (category, limit, last_id, order, title, content) => {
  try {
    let cursor;
    const query = { category: category };

    // last_id가 존재하면, 마지막 id 이후의 문서 조회
    if (last_id) {
      query._id = { $gt: last_id };
    }

    // title이 존재하면 정규 표현식으로 검색에 추가 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    // content가 존재하면 정규 표현식으로 검색에 추가 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(content, 'i') };
    }

    // 데이터 조회 실행
    cursor = PostModel.find(query).limit(limit);

    // 정렬
    if (order === 'desc') {
      cursor = cursor.sort({ created_at: -1 });
    }

    // 배열 형태로 데이터 가져오기
    const result = await cursor.exec();

    // 더 이상 문서가 없는 경우
    if (!result.length) {
      return { data: null, last_id: null };
    }

    // 마지막 문서의 ID를 가져옴
    const lastDoc = result[result.length - 1];
    last_id = lastDoc._id.toString();

    // 데이터와 다음 페이지를 위한 마지막 ID 반환
    return { data: result, last_id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

const paginationPostList = async (category, limit, page) => {
  try {
    // 전체 게시물 수 조회
    const totalPosts = await PostModel.countDocuments({ category: category });

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalPosts / limit);

    // 현재 페이지
    const currentPage = parseInt(page);

    // 페이징 시작 숫자 계산
    //  페이징 UI를 구성 -> 현재 페이지를 중심으로 좌우로 5개의 페이지 링크
    const startPage = Math.max(1, currentPage - 5);

    // 페이징 끝 숫자 계산
    const endPage = Math.min(startPage + 9, totalPages);

    // 이전 페이지 및 다음 페이지 계산
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      pagination: {
        totalPosts,
        totalPages,
        currentPage,
        startPage,
        endPage,
        prevPage,
        nextPage,
      },
    };
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
  findPost,
  paginationPostList,
};
