const mongoose = require('mongoose');
const config = require('../../config');
const PostModel = require('../../models/Posts');
const EventModel = require('../../models/Events');
const EventEntryModel = require('../../models/EventEntries');
const calcPagination = require('../../utils/calcPagination');
const { updateCommentLikes } = require('./commentsController');
const tokenController = require('../contract/tokenController');
const {
  getKorDate,
  escapeRegexChars,
  generateUniqueFileName,
} = require('../../utils/common');
const AWS = require('../../loaders/aws-s3');
const s3 = new AWS.S3();

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
 * 파일 저장 (이미지, 동영상)
 * @param {*} files
 * @returns 저장된 파일 url (array)
 */
const saveFiles = async (files) => {
  try {
    const imageUrls = [];
    const videoUrls = [];

    // files.image와 files.video가 존재하는지 확인 후 각각 처리
    if (files.image) {
      for (const file of files.image) {
        const fileName = generateUniqueFileName(file.originalname);
        const params = {
          Bucket: config.awsS3.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        // 파일 업로드
        const uploadResult = await s3.upload(params).promise();

        if (file.mimetype.includes('image')) {
          const imageUrl = config.cloudfront + uploadResult.Key;
          imageUrls.push(imageUrl);
        }
      }
    }

    if (files.video) {
      for (const file of files.video) {
        const fileName = generateUniqueFileName(file.originalname);
        const params = {
          Bucket: config.awsS3.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        // 파일 업로드
        const uploadResult = await s3.upload(params).promise();

        if (file.mimetype.includes('video')) {
          const videoUrl = config.cloudfront + uploadResult.Key;
          videoUrls.push(videoUrl);
        }
      }
    }

    return {
      imageUrls: imageUrls,
      videoUrls: videoUrls,
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 자유 게시글 저장
 * @param {*} user_id
 * @param {*} postData
 * @param {*} media
 * @returns 게시글 id
 */
const savePost = async (user_id, postData, files) => {
  try {
    if (postData.category !== 'general') {
      return { success: false, message: '잘못된 카테고리입니다.' };
    }

    // 파일 저장
    const saveFilesResult = await saveFiles(files);
    if (!saveFilesResult) {
      return res.status(400).json({
        success: false,
        message: '파일 저장에 실패했습니다.',
      });
    }

    // 게시글 저장
    const saveResult = new PostModel({
      user_id: user_id,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      media: {
        img: saveFilesResult.imageUrls,
        video: saveFilesResult.videoUrls,
      },
    });
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
 * 이벤트 참여 후기 저장
 * @param {*} user_id
 * @param {*} postData
 * @param {*} files
 * @returns
 */
const saveReview = async (user_id, postData, files) => {
  try {
    if (postData.category !== 'review') {
      return { success: false, message: '잘못된 카테고리입니다.' };
    }

    // 이벤트 정보 조회
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

    // 이벤트 참가 정보 조회
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

    if (entry.is_token_rewarded) {
      return {
        success: false,
        message: '이미 리뷰를 작성했습니다.',
      };
    }

    // 파일 저장
    const saveFilesResult = await saveFiles(files);
    if (!saveFilesResult) {
      return res.status(400).json({
        success: false,
        message: '파일 저장에 실패했습니다.',
      });
    }

    // 리뷰 게시글 저장
    const saveResult = new PostModel({
      user_id: user_id,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      event_id: postData.event_id,
      media: {
        img: saveFilesResult.imageUrls,
        video: saveFilesResult.videoUrls,
      },
    });

    const result = await saveResult.save();
    if (!result) {
      return { success: false };
    }

    return { success: true, data: result._id, entry: entry };
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
const editPostField = async (post_id, title, content) => {
  try {
    const updateFields = {};

    if (title) {
      // 제목 수정
      updateFields.title = title;
    }

    if (content) {
      // 내용 수정
      updateFields.content = content;
    }

    // 수정일자 추가
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
    if (!viewResult || !viewResult.success) {
      return { success: false, message: '조회수 증가에 실패하였습니다.' };
    }

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
    if (last_id && mongoose.Types.ObjectId.isValid(last_id)) {
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
const getReviews = async (last_data, limit, title, content, order) => {
  try {
    let query = { category: 'review' };

    let nextViewCount = null;
    let nextId = null;

    if (last_data.includes('_')) {
      [nextViewCount, nextId] = last_data.split('_');
    } else if (last_data && mongoose.Types.ObjectId.isValid(last_data)) {
      nextId = last_data;
    }

    // 정렬 방향에 따라 정렬 객체 생성
    let sort = {};
    let comparisonOperator = undefined;

    if (order === 'desc') {
      sort = { created_at: -1 };
      comparisonOperator = nextId ? { $lt: nextId } : undefined;
    } else if (order === 'asc') {
      sort = { created_at: 1 };
      comparisonOperator = nextId ? { $gt: nextId } : undefined;
    } else if (order === 'view') {
      comparisonOperator = undefined;

      // 조회수를 기준으로 정렬하도록 변경
      sort = { 'view.count': -1, _id: -1 };

      if (nextViewCount) {
        query.$or = [
          { 'view.count': { $lt: parseInt(nextViewCount) } },
          { 'view.count': nextViewCount, _id: { $gt: nextId } },
        ];
      }
    }

    // last_id가 존재하면, 마지막 id 이후의 문서 조회
    if (comparisonOperator !== undefined && order !== 'view') {
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
      return { data: null, last_item: null };
    }

    // 마지막 문서의 ID를 가져옴
    const last_item = result[result.length - 1];
    const next = `${last_item.view.count}_${last_item._id}`;

    return { data: result, last_item: next };
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
  getPosts,
  getEvents,
  getReviews,
  saveFiles,
  saveReview,
};
