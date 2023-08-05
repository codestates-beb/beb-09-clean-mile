const PostModel = require('../../models/Posts');
const calcPagination = require('../../utils/calcPagination');
const { getKorDate, escapeRegexChars } = require('../../utils/common');

/**
 * 공지사항 리스트 조회
 * @param {*} page
 * @param {*} limit
 * @param {*} title
 * @param {*} content
 * @param {*} category notice
 * @returns
 */
const getNotices = async (page, limit, title, content, category) => {
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

    //  공지사항 리스트 조회
    const result = await PostModel.find(query)
      .select('-__v -view.viewers')
      .populate('user_id', ['nickname'])
      .sort({ created_at: -1 })
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
 * 공지사항 조회
 * @param {*} notice_id
 * @returns 조회 결과
 */
const getNotice = async (notice_id) => {
  try {
    const notice = await PostModel.findById(notice_id).select('-__v');

    if (!notice) {
      return { success: false };
    }

    return { success: true, data: notice };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 공지사항 저장
 * @param {*} title
 * @param {*} content
 * @param {*} user_id
 * @param {*} category notice
 * @param {*} media
 * @returns
 */
const saveNotice = async (title, content, user_id, category, media) => {
  try {
    const post = new PostModel({
      user_id: user_id,
      category: category,
      title: title,
      content: content,
      media: {
        img: media.imageUrls,
        video: media.videoUrls,
      },
    });

    const result = await post.save();
    if (!result) {
      return { success: false };
    }

    return { success: true, data: result._id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 공지사항 수정
 * @param {*} notice_id
 * @param {*} title
 * @param {*} content
 * @returns 성공 여부
 */
const updateNotice = async (notice_id, title, content) => {
  try {
    // 공지사항 조회
    const notice = await PostModel.findById(notice_id);
    if (!notice) {
      return { success: false };
    }

    // 수정할 내용이 있는 경우에만 수정
    if (title) {
      notice.title = title;
    }

    if (content) {
      notice.content = content;
    }

    notice.updated_at = getKorDate();

    const result = await notice.save();
    if (!result) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 공지사항 삭제
 * @param {*} notice_id
 * @returns 성공 여부
 */
const deleteNotice = async (notice_id) => {
  try {
    const result = await PostModel.deleteOne({ _id: notice_id });

    if (result.deletedCount === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  getNotices,
  getNotice,
  saveNotice,
  updateNotice,
  deleteNotice,
};
