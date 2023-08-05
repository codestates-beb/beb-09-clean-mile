const request = require('supertest');
const mongoose = require('mongoose');
const app = require('express');
const expressLoader = require('../../loaders/express');
const config = require('../../config');
const adminEventsController = require('../../services/admin/eventsController');
const userController = require('../../services/client/usersController');
const jwtUtil = require('../../utils/jwtAdminUtil');
const path = require('path');

/************* 샘플 데이터 ***************/
const {
  reqAdminLogin,
  reqCreateEvent,
  reqCreateEventFile,
} = require('./data/adminEventData');

// Rename the variable to 'expressApp'
const expressApp = app();

// 쿠키
let accessTokenCookie, refreshTokenCookie;
const filePtah = path.join(__dirname, '/data/test.xlsx'); // 테스트 파일의 경로를 설정하세요.

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
      .field('name', 'John Doe')
      .attach('file', filePtah);

    console.log(filePtah);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: '업로드 할 수 없는 파일 형식입니다.',
    });
  });

  it('파일 크기가 너무 클 때', async () => {
    const oversizedFile = [
      {
        fieldname: 'poster_image',
        originalname: 'oversized_image.jpg',
        mimetype: 'image/jpeg',
        size: 6 * 1024 * 1024,
      },
    ];
    const response = await request(expressApp)
      .post('/admin/events/create')
      .set('Cookie', `accessToken=${accessTokenCookie}`)
      .set('Content-Type', 'multipart/form-data') // form-data 헤더를 설정
      .field('name', 'John Doe');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.',
    });
  });
});

afterAll(async () => {
  // DB 연결 해제
  await mongoose.connection.close();
});
