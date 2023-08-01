const fs = require('fs');
const XLSX = require('xlsx');
const calcPagination = require('../../utils/calcPagination');
const EventModel = require('../../models/Events');
const EventHostModel = require('../../models/EventHosts');
const EventEntryModel = require('../../models/EventEntries');
const BadgeModel = require('../../models/Badges');
const UserModel = require('../../models/Users');

/**
 * 이벤트 리스트 조회
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

/**
 * 이벤트 상세 조회
 * @param {*} event_id
 * @returns 조회 결과
 */
const getEvent = async (event_id) => {
  try {
    // 이벤트 정보 조회
    const event = await EventModel.findById(event_id)
      .populate({ path: 'host_id', select: '-__v' })
      .select('-__v -view.viewers');
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 배지 정보 조회
    const badges = await BadgeModel.find({ event_id: event_id }).select('-__v');
    if (!badges) {
      return { success: false, message: '뱃지 정보를 가져올 수 없습니다.' };
    }

    if (badges.length === 0) {
      return { success: true, data: { event: event, badges: null } };
    }

    return { success: true, data: { event: event, badges: badges } };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 참여자 리스트 조회
 * @param {*} event_id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
const getEventEntries = async (event_id, page, limit) => {
  try {
    // 페이지 번호와 페이지당 아이템 수로 스킵하는 개수 계산
    const skip = (page - 1) * limit;

    // 이벤트 참여자 정보 조회
    const eventEntries = await EventEntryModel.find({ event_id: event_id })
      .populate('user_id', [
        'email',
        'name',
        'phone_number',
        'nickname',
        'wallet.address',
      ])
      // .populate('event_id', ['title'])
      .select('-__v')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    if (eventEntries.length === 0) {
      return { data: null, pagination: null };
    }

    // 페이지네이션 정보 계산
    const total = await EventEntryModel.countDocuments({ event_id: event_id });
    const paginationResult = await calcPagination(total, limit, page);

    return { entries: eventEntries, pagination: paginationResult };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 참여자 리스트 엑셀로 내보내기
 * @param {*} req
 * @param {*} res
 * @returns 엑셀 파일
 */
const exportToExcel = async (req, res) => {
  try {
    const { event_id } = req.params;

    // 이벤트 참여자 정보 조회
    const eventEntries = await EventEntryModel.find({
      event_id: event_id,
    }).select('user_id');

    // 참여자가 없는 경우
    if (eventEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: '참여자가 없습니다.',
      });
    }

    // user_id만 추출
    const userIds = eventEntries.map((entry) => entry.user_id);

    // user_id를 이용해 사용자 정보 조회
    const users = await UserModel.find({
      _id: { $in: userIds },
    }).select('email name phone_number nickname wallet.address');

    // 사용자 정보에서 필요한 정보만 추출
    const modifiedUsers = users.map((user) => {
      const { email, name, phone_number, nickname, wallet } = user;
      const { address } = wallet;
      return [email, name, phone_number, nickname, address]; // Convert object to array
    });

    // 엑셀 객체(workbook)를 생성
    const workbook = XLSX.utils.book_new();

    // 출력하려는 데이터를 json 형태로 변환하여 새로운 시트(Worksheet)를 생성
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        '사용자 이메일',
        '사용자 이름',
        '사용자 핸드폰 번호',
        '사용자 닉네임',
        '사용자 지갑 주소',
      ], // 상단에 이름을 지정하는 배열 추가
      ...modifiedUsers, // 사용자 정보 데이터 배열 추가
    ]);

    // 생성된 시트를 앞서 생성한 엑셀 객체에 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '사용자 정보');

    // 엑셀 객체(workbook)를 바이너리 버퍼(Buffer) 형태로 변환
    const excelBuffer = XLSX.write(workbook, { type: 'buffer' });

    // 다운로드될 파일의 이름과 확장자를 설정
    res.setHeader('Content-Disposition', 'attachment; filename=user_list.xlsx');

    //다운로드될 파일의 Content-Type을 설정
    res.setHeader('Content-Type', 'application/vnd.ms-excel');

    // 엑셀 파일을 클라이언트에게 전송하여 다운로드
    res.status(200).send(excelBuffer);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
};

module.exports = { getEvents, getEvent, getEventEntries, exportToExcel };
