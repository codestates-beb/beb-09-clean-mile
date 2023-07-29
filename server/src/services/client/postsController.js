const PostModel = require('../../models/Posts');
const CommentModel = require('../../models/Comments');
const EventModel = require('../../models/Events');
const { findUserEmail } = require('./usersController');
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
 * 게시글의 제목 또는 내용을 수정
 * @param {*} post_id 게시글 ID
 * @param {*} updateFields 수정할 필드와 값을 담은 객체
 * @returns 성공 여부에 따라 객체 반환
 */
const editPostField = async (post_id, updateFields) => {
  try {
    updateFields.updated_at = new Date();
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
    const postResult = await PostModel.findById(postId).populate('user_id', [
      'nickname',
    ]);
    if (!postResult) {
      return { success: false };
    }

    // 조회 수 증가
    const viewResult = await postViews(req, postResult);

    // 게시글에 달린 댓글 정보 조회
    const updatedComments = await updateCommentLikes(postId, user_id);

    return {
      success: true,
      data: { post: viewResult, comment: updatedComments },
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
    let cursor;
    if (category === 'Event') {
      delete query.category;
      cursor = EventModel.find(query)
        .populate('host_id', ['name', 'organization'])
        .limit(limit);
      console.log(cursor);
    } else {
      cursor = PostModel.find(query)
        .populate('user_id', ['nickname'])
        .limit(limit);
    }

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

module.exports = {
  savePost,
  editPostField,
  deletePost,
  postViews,
  findDetailPost,
  noticesLatestPost,
  findPost,
};
