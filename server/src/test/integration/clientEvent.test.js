const request = require('supertest');
const mongoose = require('mongoose');
const app = require('express');
const expressLoader = require('../../loaders/express');
const config = require('../../config');
const eventsController = require('../../services/client/eventsController');
const { reqUserLogin } = require('./data/clientEventData');

const expressApp = app(); // Rename the variable to 'expressApp'

let accessTokenCookie, refreshTokenCookie; // token
let event_id; // 행사 id
beforeAll(async () => {
  try {
    await expressLoader(expressApp); // Use the renamed variable here

    // DB 연결
    await mongoose.connect(config.testDatabaseURL);
    console.log(`🥭 Test MongoDB connected... 🥭`);
  } catch (err) {
    console.error(err);
  }

  // 로그인 요청
  const res = await request(expressApp).post('/users/login').send({
    email: reqUserLogin.email,
    password: reqUserLogin.password,
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

describe('GET /events/list 이벤트 리스트 조회', () => {
  it('이벤트 리스트 조회 :default', async () => {
    const res = await request(expressApp) // Use the renamed variable here
      .get('/events/list')
      .query({
        page: 1,
        limit: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('행사 리스트 조회 성공');
    expect(res.body.data).toBeDefined();

    event_id = res.body.data.data[0]._id;
  });

  it('이벤트 리스트 조회 : 제목 검색', async () => {
    const res = await request(expressApp).get('/events/list').query({
      page: 1,
      limit: 10,
      title: '딥디크',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('행사 리스트 조회 성공');
    expect(res.body.data.data[0].title).toBe('딥디크 플로깅 행사');
  });

  it('이벤트 리스트 조회 : 내용 검색', async () => {
    const res = await request(expressApp).get('/events/list').query({
      page: 1,
      limit: 10,
      content: '딥디크에서',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('행사 리스트 조회 성공');
    expect(res.body.data.data[0].content).toBe(
      '딥디크에서 플로깅 행사를 주최합니다.'
    );
  });

  it('이벤트 리스트 조회 : status', async () => {
    const res = await request(expressApp).get('/events/list').query({
      page: 1,
      limit: 10,
      status: 'recruiting',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('행사 리스트 조회 성공');
    expect(res.body.data.data[0].status).toBe('recruiting');
  });
});

describe('GET /events/detail/:_id 이벤트 내용 상세 조회', () => {
  it('행사가 존재하지 않음', async () => {
    const nonExistentEventId = new mongoose.Types.ObjectId(1234);
    const res = await request(expressApp).get(
      `/events/detail/${nonExistentEventId}`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('행사가 존재하지 않습니다.');
  });

  it('행사가 조회 성공', async () => {
    const res = await request(expressApp).get(`/events/detail/${event_id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});

describe('POST /events/entry/:event_id 이벤트 참여 신청', () => {
  it('행사가 존재하지 않음', async () => {
    const nonExistentEventId = new mongoose.Types.ObjectId(1234);

    const res = await request(expressApp)
      .post(`/events/entry/${nonExistentEventId}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('존재하지 않는 이벤트입니다.');
  });

  it('모집중인 행사가 아님', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0bc9b159f50258cb9b09'
    );

    const res = await request(expressApp)
      .post(`/events/entry/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('참가자 모집중인 이벤트가 아닙니다.');
  });

  it('참가자 모집이 마감된 행사', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0ca47a573bb7d1a334d8'
    );

    const res = await request(expressApp)
      .post(`/events/entry/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('참가자 모집이 마감된 이벤트입니다.');
  });

  it('이미 신청한 행사', async () => {
    const test_event_id = new mongoose.Types.ObjectId(
      '64ce0cd53c036dc9d82bf895'
    );

    const res = await request(expressApp)
      .post(`/events/entry/${test_event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('이미 신청한 이벤트입니다.');
  });

  it('참가 신청 성공', async () => {
    console.log(event_id);

    const res = await request(expressApp)
      .post(`/events/entry/${event_id}`)
      .set('Cookie', `accessToken=${accessTokenCookie}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('행사 참여 신청 성공');
  });
});

describe('POST /events/verify 행사 참여 인증', () => {
  it('필수 입력 값이 없음', async () => {
    const res = await request(expressApp)
      .post('/events/verify')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('token', '');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('필수 입력 값이 없습니다.');
  });
});

afterAll(async () => {
  // DB 연결 해제
  await mongoose.connection.close();
});
