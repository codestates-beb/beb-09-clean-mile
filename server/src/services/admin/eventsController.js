const calcPagination = require('../../utils/calcPagination');
const EventModel = require('../../models/Events');
const EventHostModel = require('../../models/EventHosts');

/**
 * 이벤트 목록 조회
 * @param {*} status
 * @param {*} page
 * @param {*} limit
 * @param {*} title
 * @param {*} content
 * @param {*} organization
 * @returns 조회 결과
 */
const getEvents = async (status, page, limit, title, content, organization) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    let query = {};

    // status가 존재하면, 해당 status의 이벤트만 조회
    if (status) {
      query.status = status;
    }

    // 제목을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(content, 'i') };
    }

    // 단체명을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (organization) {
      query.host_id = {
        $in: await EventHostModel.find(
          { organization: { $regex: new RegExp(organization, 'i') } },
          '_id'
        ),
      };
    }

    // 이벤트 정보 조회
    const events = await EventModel.find(query)
      .populate('host_id', ['name', 'organization'])
      .select('-__v -view.viewers')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // 결과가 없는 경우
    if (events.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await EventModel.countDocuments(query);
    const paginationResult = await calcPagination(total, limit, page);

    return { data: events, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = { getEvents };
