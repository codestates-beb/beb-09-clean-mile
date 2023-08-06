const XLSX = require('xlsx');
const config = require('../../config');
const calcPagination = require('../../utils/calcPagination');
const EventModel = require('../../models/Events');
const EventHostModel = require('../../models/EventHosts');
const EventEntryModel = require('../../models/EventEntries');
const BadgeModel = require('../../models/Badges');
const UserModel = require('../../models/Users');
const QRCodeModel = require('../../models/QRCode');
const jwtUtil = require('../../utils/jwtAdminUtil');
const {
  getKorDate,
  escapeRegexChars,
  generateUniqueFileName,
} = require('../../utils/common');
const AWS = require('../../loaders/aws-s3');
const s3 = new AWS.S3();

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
      query.title = { $regex: new RegExp(escapeRegexChars(title), 'i') };
    }

    // 내용을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (content) {
      query.content = { $regex: new RegExp(escapeRegexChars(content), 'i') };
    }

    // 단체명을 검색할 경우 정규표현식 사용 (대소문자 구분 없이 검색)
    if (organization) {
      query.host_id = {
        $in: await EventHostModel.find(
          {
            organization: {
              $regex: new RegExp(escapeRegexChars(organization), 'i'),
            },
          },
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
    const eventResult = await EventModel.findById(event_id)
      .populate({ path: 'host_id', select: '-__v' })
      .select('-__v -view.viewers');

    if (!eventResult) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 배지 정보 조회
    const badge = await BadgeModel.findOne({ event_id: event_id }).select(
      '-__v'
    );

    return { success: true, data: { event: eventResult, badge: badge } };
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

/**
 * 이벤트 주최자 정보 저장
 * @param {*} hostData
 * @returns 저장된 이벤트 주최자의 _id
 */
const saveEventHost = async (hostData) => {
  try {
    // 이벤트 주최자 정보 조회
    const eventHost = await EventHostModel.findOne({ email: hostData.email });
    if (eventHost) {
      return { success: true, id: eventHost._id };
    }

    // 이벤트 주최자 정보 저장
    const eventHostResult = new EventHostModel(hostData);

    const result = await eventHostResult.save();
    if (!result) {
      return { success: false };
    }

    return { success: true, id: result._id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 주최자 정보 수정
 * @param {*} event_id
 * @param {*} name
 * @param {*} email
 * @param {*} phone_number
 * @param {*} wallet_address
 * @param {*} organization
 * @returns 성공 여부
 */
const updateEventHost = async (
  event_id,
  name,
  email,
  phone_number,
  wallet_address,
  organization
) => {
  try {
    // 이벤트 정보 조회
    const event = await EventModel.findById(event_id).select('host_id');
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 이벤트 주최자 정보 조회
    const eventHost = await EventHostModel.findById(event.host_id);
    if (!eventHost) {
      return { success: false, message: '존재하지 않는 이벤트 주최자입니다.' };
    }

    // 이벤트 주최자 정보 수정
    if (name) eventHost.name = name;
    if (email) eventHost.email = email;
    if (phone_number) eventHost.phone_number = phone_number;
    if (wallet_address) eventHost.wallet_address = wallet_address;
    if (organization) eventHost.organization = organization;

    eventHost.updated_at = getKorDate();
    const result = await eventHost.save();

    if (!result) {
      return {
        success: false,
        message: '이벤트 주최자 정보 수정에 실패했습니다.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 정보 저장
 * @param {*} eventData
 * @returns 저장된 이벤트 정보의 _id
 */
const saveEvent = async (eventData) => {
  try {
    // 이벤트 정보 저장
    const event = new EventModel(eventData);

    const result = await event.save();
    if (!result) {
      return { success: false };
    }

    return { success: true, id: result._id };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이미지 파일들 업로드
 * @param {*} images
 * @returns
 */
const saveImages = async (images) => {
  try {
    const imageUrls = [];

    for (const file of images) {
      const fileName = generateUniqueFileName(file.originalname);
      const params = {
        Bucket: config.awsS3.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // 파일 업로드
      const uploadResult = await s3.upload(params).promise();

      imageUrls.push(uploadResult.Location);
    }
    return imageUrls;
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 정보 수정
 * @param {*} event_id
 * @param {*} title
 * @param {*} content
 * @param {*} location
 * @param {*} recruitment_start_at
 * @param {*} recruitment_end_at
 * @param {*} event_start_at
 * @param {*} event_end_at
 * @returns 성공 여부
 */
const updateEvent = async (
  event_id,
  title,
  content,
  location,
  recruitment_start_at,
  recruitment_end_at,
  event_start_at,
  event_end_at
) => {
  try {
    // 이벤트 정보 조회
    const event = await EventModel.findById(event_id);
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 이벤트 상태가 'created'일 때만 수정 가능
    if (event.status !== 'created') {
      return {
        success: false,
        message: `이벤트 상태가 'created'일 때만 수정 가능합니다.`,
      };
    }

    // 모집 시작일 전에만 수정 가능
    if (event.recruitment_start_at < getKorDate()) {
      return {
        success: false,
        message: '모집 시작일이 지나 수정할 수 없습니다.',
      };
    }

    // 이벤트 정보 수정
    if (title) event.title = title;
    if (content) event.content = content;
    if (location) event.location = location;
    if (recruitment_start_at) event.recruitment_start_at = recruitment_start_at;
    if (recruitment_end_at) event.recruitment_end_at = recruitment_end_at;
    if (event_start_at) event.event_start_at = event_start_at;
    if (event_end_at) event.event_end_at = event_end_at;

    event.updated_at = getKorDate();
    const result = await event.save();
    if (!result) {
      return { success: false, message: '이벤트 정보 수정에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 취소
 * @param {*} event_id
 * @returns 성공 여부
 */
const setEventStatusCanceled = async (event_id) => {
  try {
    // 이벤트 정보 조회
    const event = await EventModel.findById(event_id);
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    if (event.status === 'canceled') {
      return { success: false, message: '이미 취소된 이벤트입니다.' };
    }

    // 이벤트 상태가 ‘progressing' 이전 상태일 때만 취소 가능
    if (event.status === 'progressing' || event.status === 'finished') {
      return {
        success: false,
        message: `이벤트 상태가 ‘progressing' 이전 상태일 때만 취소 가능합니다.`,
      };
    }

    // 이벤트 상태 변경
    event.status = 'canceled';
    const result = await event.save();
    if (!result) {
      return { success: false, message: '이벤트 취소에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 이벤트 삭제
 * @param {*} event_id
 * @returns 성공 여부
 */
const deleteEvent = async (event_id) => {
  try {
    // 이벤트 정보 삭제
    const result = await EventModel.deleteOne({ _id: event_id });
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
 * qr코드 생성을 위한 토큰 생성
 * @param {*} event_id
 * @returns 토큰
 */
const createQRcodeJWt = async (event_id) => {
  try {
    // 이벤트 정보 조회
    const event = await EventModel.findById(event_id);
    if (!event) {
      return { success: false, message: '존재하지 않는 이벤트입니다.' };
    }

    // 이벤트 상태가 'progressing'일 때만 QR코드 생성 가능
    if (event.status !== 'progressing') {
      return {
        success: false,
        message: `이벤트 상태가 'progressing'일 때만 QR코드 생성 가능합니다.`,
      };
    }

    // QR코드 생성 여부 확인
    const qrCode = await QRCodeModel.findOne({ event_id: event_id });
    if (qrCode) {
      return { success: true, data: qrCode.token };
    }

    // jwt 토큰 생성
    const token = jwtUtil.qrSign(event_id);
    if (!token) {
      return { success: false, message: 'jwt 토큰 생성 실패' };
    }

    // 데이터 저장
    const qrCodeResult = new QRCodeModel({
      event_id: event_id,
      isActive: true,
      token: token,
    });

    const result = await qrCodeResult.save();
    if (!result) {
      return { success: false, message: 'QR코드 데이터 저장에 실패했습니다.' };
    }

    return { success: true, data: result.token };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

/**
 * 단일 이미지 저장
 * @param {*} image
 * @returns s3에 저장된 Location
 */
const saveImage = async (image) => {
  try {
    // 새로운 이미지 업로드
    const keyName = generateUniqueFileName(image.originalname);
    const uploadParams = {
      Bucket: config.awsS3.bucketName,
      Key: keyName,
      Body: image.buffer,
    };

    // S3 업로드 실행
    const uploadResult = await s3.upload(uploadParams).promise();

    return uploadResult.Location;
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = {
  getEvents,
  getEvent,
  getEventEntries,
  exportToExcel,
  saveEventHost,
  saveEvent,
  updateEventHost,
  updateEvent,
  setEventStatusCanceled,
  deleteEvent,
  createQRcodeJWt,
  saveImage,
  saveImages,
};
