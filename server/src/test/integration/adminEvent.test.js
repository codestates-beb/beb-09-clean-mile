const request = require('supertest');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const stream = require('stream');
const app = require('express');
const expressLoader = require('../../loaders/express');
const config = require('../../config');
const { saveImages } = require('../../services/admin/eventsController');
const userController = require('../../services/client/usersController');
const jwtUtil = require('../../utils/jwtAdminUtil');
const path = require('path');

/************* 샘플 데이터 ***************/
const {
  reqAdminLogin,
  reqCreateEvent,
  reqCreateEventFile,
} = require('./data/adminEventData');
const exp = require('constants');

// Rename the variable to 'expressApp'
const expressApp = app();

// 쿠키
let accessTokenCookie, refreshTokenCookie;
const invalidFilePtah = path.join(__dirname, '/data/test.xlsx');
const filePtah = path.join(__dirname, '/data/test.jpg');

beforeAll(async () => {
  try {
    await expressLoader(expressApp);

    // DB 연결
    await mongoose.connect(config.testDatabaseURL);
    console.log(`🥭 Test MongoDB connected... 🥭`);
  } catch (err) {
    console.error(err);
  }

  // 로그인 요청
  const res = await request(expressApp).post('/admin/login').send({
    email: reqAdminLogin.email,
    password: reqAdminLogin.password,
  });

  // 응답을 검증
  expect(res.status).toBe(200);

  // 쿠키 값을 추출
  const cookies = res.headers['set-cookie'];
  expect(cookies).toBeDefined();

  cookies.forEach((cookie) => {
    if (cookie.startsWith('accessToken=')) {
      accessTokenCookie = cookie.replace(/^accessToken=|; Path=\/$/g, '');
    } else if (cookie.startsWith('refreshToken=')) {
      refreshTokenCookie = cookie.replace(/^refreshToken=|; Path=\/$/g, '');
    }
  });

  // 쿠기 값이 존재하는지 검증
  expect(accessTokenCookie).toBeDefined();
  expect(refreshTokenCookie).toBeDefined();
});

describe('GET /admin/events/list 이벤트 리스트 조회', () => {
  it('관리자가 아닐 경우', async () => {
    const res = await request(expressApp).get('/admin/events/list').query({
      page: 1,
      limit: 10,
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('이벤트 리스트 조회 성공 : default', async () => {
    const res = await request(expressApp)
      .get('/admin/events/list')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 정보 조회 성공');
    expect(res.body.data).toBeDefined();
  });

  it('이벤트 리스트 조회 성공 : title 검색', async () => {
    const res = await request(expressApp)
      .get('/admin/events/list')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
        title: '딥디크',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 정보 조회 성공');
    expect(res.body.data.data[0].title).toBe('딥디크 플로깅 행사');
  });

  it('이벤트 리스트 조회 성공 : content 검색', async () => {
    const res = await request(expressApp)
      .get('/admin/events/list')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
        content: '딥디크',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 정보 조회 성공');
    expect(res.body.data.data[0].content).toBe(
      '딥디크에서 플로깅 행사를 주최합니다.'
    );
  });

  it('이벤트 리스트 조회 성공 : organization 검색', async () => {
    const res = await request(expressApp)
      .get('/admin/events/list')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
        organization: 'Manzanita Capital',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 정보 조회 성공');
    expect(res.body.data.data[0].host_id.organization).toBe(
      'Manzanita Capital'
    );
  });
});

describe('GET /admin/events/detail/:event_id 이벤트 상세 조회', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );
    const res = await request(expressApp).get(
      `/admin/events/detail/${test_event_id}`
    );
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('행사가 존재하지 않을 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cce6f0ca2e2e8f7bc5dcc4'
    );

    const res = await request(expressApp)
      .get(`/admin/events/detail/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('존재하지 않는 이벤트입니다.');
  });
});

describe('GET /admin/events/detail/entry/:event_id 이벤트 참여자 리스트 조회', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );
    const res = await request(expressApp)
      .get(`/admin/events/detail/entry/${test_event_id}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('참가자가 없을 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );

    const res = await request(expressApp)
      .get(`/admin/events/detail/entry/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 참여자 리스트 조회 성공');
    expect(res.body.data.data).toBe(null);
    expect(res.body.data.pagination).toBe(null);
  });

  it('리스트 조회 성공', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0d0b4fbfcaf8d4ede0d9'
    );

    const res = await request(expressApp)
      .get(`/admin/events/detail/entry/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('이벤트 참여자 리스트 조회 성공');
    expect(res.body.data).toBeDefined();
  });
});

describe('POST /admin/events/createBadge 이벤트 관련 뱃지 생성(민팅)', () => {
  it('관리자가 아닐 경우', async () => {
    const res = await request(expressApp).post('/admin/events/createBadge');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /admin/events/transferBadges/:event_id 참여 인증 완료 사용자에게 뱃지 전송', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );
    const res = await request(expressApp).post(
      `/admin/events/transferBadges/${test_event_id}`
    );
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // it('이벤트가 존재하지 않을 경우', async () => {
  //   const test_event_id = new mongoose.Types.ObjectId(
  //     '64ce0bc9b159f50258cb9b07'
  //   );

  //   const res = await request(expressApp)
  //     .post(`/admin/events/transferBadges/${test_event_id}`)
  //     .set('Cookie', `accessToken=${accessTokenCookie}`);

  //   console.log('************* : ', res.body);

  //   expect(res.status).toBe(400);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.message).toBe('존재하지 않는 이벤트입니다.');
  // });

  it('행사가 finished 상태가 아닌데 뱃지를 전송할 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );

    const res = await request(expressApp)
      .post(`/admin/events/transferBadges/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      '뱃지 전송은 finished 상태의 이벤트에서만 가능합니다.'
    );
  });

  // 뱃지 전송 mock test 필요
});

describe('POST /admin/events/admin/events/create 호스트 생성, 이벤트 생성', () => {
  it('파일이 존재하지 않을 때', async () => {
    const res = await request(expressApp)
      .post('/admin/events/create')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('name', reqCreateEvent.name)
      .field('email', reqCreateEvent.email)
      .field('phone_number', reqCreateEvent.phone_number)
      .field('wallet_address', reqCreateEvent.wallet_address)
      .field('organization', reqCreateEvent.organization)
      .field('title', reqCreateEvent.title)
      .field('content', reqCreateEvent.content)
      .field('location', reqCreateEvent.location)
      .field('capacity', reqCreateEvent.capacity)
      .field('event_type', reqCreateEvent.event_type)
      .field('recruitment_start_at', reqCreateEvent.recruitment_start_at)
      .field('recruitment_end_at', reqCreateEvent.recruitment_end_at)
      .field('event_start_at', reqCreateEvent.event_start_at)
      .field('event_end_at', reqCreateEvent.event_end_at);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: '파일이 존재하지 않습니다.',
    });
  });

  it('허용되지 않는 파일 형식', async () => {
    const response = await request(expressApp)
      .post('/admin/events/create')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('name', reqCreateEvent.name)
      .field('email', reqCreateEvent.email)
      .field('phone_number', reqCreateEvent.phone_number)
      .field('wallet_address', reqCreateEvent.wallet_address)
      .field('organization', reqCreateEvent.organization)
      .field('title', reqCreateEvent.title)
      .field('content', reqCreateEvent.content)
      .field('location', reqCreateEvent.location)
      .field('capacity', reqCreateEvent.capacity)
      .field('event_type', reqCreateEvent.event_type)
      .field('recruitment_start_at', reqCreateEvent.recruitment_start_at)
      .field('recruitment_end_at', reqCreateEvent.recruitment_end_at)
      .field('event_start_at', reqCreateEvent.event_start_at)
      .field('event_end_at', reqCreateEvent.event_end_at)
      .attach('poster_image', invalidFilePtah);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: '업로드 할 수 없는 파일 형식입니다.',
    });
  });

  // it('용량이 큰 파일', async () => {
  //   // 가짜 이미지 데이터 생성
  //   const fakeImage1 = {
  //     originalname: 'image1.jpg',
  //     buffer: Buffer.from('Fake image data 1'),
  //     mimetype: 'image/jpeg',
  //     size: 1024 * 1024 * 10, // 10MB
  //   };

  //   // 가짜 파일 스트림 생성
  //   const fileStream = new stream.PassThrough();
  //   fileStream.end(fakeImage1.buffer);

  //   const response = await request(expressApp)
  //     .post('/admin/events/create')
  //     .set('Cookie', `accessToken=${accessTokenCookie}`)
  //     .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
  //     .field('name', reqCreateEvent.name)
  //     .field('email', reqCreateEvent.email)
  //     .field('phone_number', reqCreateEvent.phone_number)
  //     .field('wallet_address', reqCreateEvent.wallet_address)
  //     .field('organization', reqCreateEvent.organization)
  //     .field('title', reqCreateEvent.title)
  //     .field('content', reqCreateEvent.content)
  //     .field('location', reqCreateEvent.location)
  //     .field('capacity', reqCreateEvent.capacity)
  //     .field('event_type', reqCreateEvent.event_type)
  //     .field('recruitment_start_at', reqCreateEvent.recruitment_start_at)
  //     .field('recruitment_end_at', reqCreateEvent.recruitment_end_at)
  //     .field('event_start_at', reqCreateEvent.event_start_at)
  //     .field('event_end_at', reqCreateEvent.event_end_at)
  //     .attach('poster_image', fileStream, {
  //       filename: fakeImage1.originalname,
  //       contentType: fakeImage1.mimetype,
  //     });

  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({
  //     success: false,
  //     message: '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.',
  //   });
  // });

  it('주최즉 필수 정보 확인', async () => {
    const response = await request(expressApp)
      .post('/admin/events/create')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('title', reqCreateEvent.title)
      .field('content', reqCreateEvent.content)
      .field('location', reqCreateEvent.location)
      .field('capacity', reqCreateEvent.capacity)
      .field('event_type', reqCreateEvent.event_type)
      .field('recruitment_start_at', reqCreateEvent.recruitment_start_at)
      .field('recruitment_end_at', reqCreateEvent.recruitment_end_at)
      .field('event_start_at', reqCreateEvent.event_start_at)
      .field('event_end_at', reqCreateEvent.event_end_at)
      .attach('poster_image', filePtah);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: '주최측 필수 정보를 입력해주세요.',
    });
  });
});

describe('PATCH /admin/events/edit 이벤트, 호스트 정보 수정', () => {
  it('관리자가 아닐 경우', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64cd1f6d615828562ea368e1');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('이벤트 id를 넘기지 않았을 경우', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('content', '이벤트 내용 수정')
      .field('name', '이벤트 수정 테스트');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('이벤트 id를 입력해주세요.');
  });

  it('존재하지 않는 이벤트', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64ce0bc9b159f50258cb9b07')
      .field('content', '이벤트 내용 수정')
      .field('name', '이벤트 수정 테스트');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('존재하지 않는 이벤트입니다.');
  });

  it('존재하지 않는 이벤트 주최자', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64ce0bc9b159f50258cb9b09')
      .field('content', '이벤트 내용 수정')
      .field('name', '이벤트 수정 테스트');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('존재하지 않는 이벤트 주최자입니다.');
  });

  it('이벤트 상태가 created 일 때만 수정 가능', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64cd1f6d615828562ea368e1')
      .field('content', '이벤트 내용 수정')
      .field('name', '이벤트 수정 테스트');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      `이벤트 상태가 'created'일 때만 수정 가능합니다.`
    );
  });

  it('모집 시작일 전에만 수정 가능', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64cf4a1cb8beca93bdfe684d')
      .field('content', '이벤트 내용 수정')
      .field('name', '이벤트 수정 테스트');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      '모집 시작일이 지나 수정할 수 없습니다.'
    );
  });

  it('데이터 수정 성공', async () => {
    const response = await request(expressApp)
      .patch(`/admin/events/edit`)
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('event_id', '64cf5b58b8beca93bdfe6850')
      .field('content', '이벤트 내용 수정!!!!!')
      .field('name', '주최자 이름 수정!!!!');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('데이터 수정 성공');
  });
});

describe('PATCH /admin/events/cancel/:event_id 이벤트 취소', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cf5c75b8beca93bdfe6851'
    );

    const response = await request(expressApp).patch(
      `/admin/events/cancel/${test_event_id}`
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('존재하지 않는 이벤트', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64bf7bc956f39e4a46e181b7'
    );

    const response = await request(expressApp)
      .patch(`/admin/events/cancel/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('존재하지 않는 이벤트입니다.');
  });

  it('이미 취소된 이벤트', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cf5db6b8beca93bdfe6856'
    );

    const response = await request(expressApp)
      .patch(`/admin/events/cancel/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('이미 취소된 이벤트입니다.');
  });

  it('이벤트 상태가 progressing 이전 상태일 때만 취소 가능', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0bc9b159f50258cb9b09'
    );

    const response = await request(expressApp)
      .patch(`/admin/events/cancel/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      `이벤트 상태가 ‘progressing' 이전 상태일 때만 취소 가능합니다.`
    );
  });

  // it('이벤트 취소 성공', async () => {
  //   const test_event_id = new mongoose.Types.ObjectId(
  //     '64cf5c75b8beca93bdfe6851'
  //   );

  //   const response = await request(expressApp)
  //     .patch(`/admin/events/cancel/${test_event_id}`)
  //     .set('Cookie', `accessToken=${accessTokenCookie}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.success).toBe(true);
  //   expect(response.body.message).toBe('이벤트 취소 성공');
  // });
});

describe('DELETE /admin/events/delete/:event_id 이벤트 삭제', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cf5c75b8beca93bdfe6851'
    );

    const response = await request(expressApp).delete(
      `/admin/events/delete/${test_event_id}`
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /admin/events/qrcode/:event_id 이벤트 인증 QR코드 생성', () => {
  it('관리자가 아닐 경우', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cf5c75b8beca93bdfe6851'
    );

    const response = await request(expressApp).post(
      `/admin/events/qrcode/${test_event_id}`
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('존재하지 않는 이벤트', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce7cda33955893e1e9a093'
    );

    const response = await request(expressApp)
      .post(`/admin/events/qrcode/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('존재하지 않는 이벤트입니다.');
  });

  it('이벤트 상태가 progressing 일 때만 QR코드 생성 가능', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64cd1f6d615828562ea368e1'
    );

    const response = await request(expressApp)
      .post(`/admin/events/qrcode/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      `이벤트 상태가 'progressing'일 때만 QR코드 생성 가능합니다.`
    );
  });

  it('이벤트 인증 QR코드 생성 성공', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0bc9b159f50258cb9b09'
    );

    const response = await request(expressApp)
      .post(`/admin/events/qrcode/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('QR 코드 생성 성공');
  });
});

afterAll(async () => {
  // DB 연결 해제
  await mongoose.connection.close();
});
