const request = require('supertest');
const mongoose = require('mongoose');
const app = require('express');
const expressLoader = require('../../loaders/express');
const config = require('../../config');
const { reqUserLogin } = require('./data/clientEventData');

const expressApp = app(); // Rename the variable to 'expressApp'

let accessTokenCookie, refreshTokenCookie;
beforeAll(async () => {
  try {
    await expressLoader(expressApp); // Use the renamed variable here

    // DB 연결
    await mongoose.connect(config.testDatabaseURL);
    console.log(`🥭 Test MongoDB connected... 🥭`);
  } catch (err) {
    console.error(err);
  }
});

describe('GET /events/list 클라이언트 이벤트 리스트 조회', () => {
  it('이벤트 리스트 조회 10개', (done) => {
    request(expressApp) // Use the renamed variable here
      .get('/events/list')
      .query({
        page: 1,
        limit: 10,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // 예상되는 응답 확인
          console.log(res.body);
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('행사 리스트 조회 성공');
          expect(res.body.data).toBeDefined();

          done();
        }
      });
  });
});

afterAll(async () => {
  // DB 연결 해제
  await mongoose.connection.close();
});
