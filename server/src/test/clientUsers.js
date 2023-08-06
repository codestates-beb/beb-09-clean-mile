const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  saveAuthCode,
  checkEmail,
  checkEmailAuthCode,
  saveUserData,
  getUser,
  getPosts,
  getProfile,
  changeNickname,
  setTokenCookie,
} = require('../services/client/usersController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
const UserModel = require('../models/Users');
const PostModel = require('../models/Posts');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MongoMemoryServerStart = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  const connection = await mongoose.connect(uri);
  return connection.connection.db;
};

describe('client/usersControllerTest', () => {
  let url; // URI 변수를 선언하여 저장

  before(async function () {
    try {
      const result = await MongoMemoryServerStart(); // URI를 변수에 저장
      url = result.client.s.url;
      console.log(url);

      const userData = new UserModel({
        email: 'test@example.com',
        name: 'Test',
        phone_number: '010-1111-2222',
        user_type: 'user',
        hashed_pw:
          '$2b$10$IspODcbUqPxCaVqZMsBkmOUZxktY1wsnVfW2V0iMQmagmdR0DI1da',
        nickname: 'Test',
        social_provider: 'kakao',
        wallet: {
          address: 'salkdlkasdjlk',
          token_amount: 0,
          badge_amount: 0,
          total_badge_score: 0,
          mileage_amount: 0,
        },
      });

      const newPost = new PostModel({
        user_id: new mongoose.Types.ObjectId('64cd330618b708cebbfccc49'),
        category: 'notice',
        event_id: new mongoose.Types.ObjectId('64cd330618b708cebbfccc3b'),
        title: 'new Post',
        content: 'sakdljasd',
      });

      // 새로운 사용자 데이터를 데이터베이스에 저장
      await userData.save(); // 비동기 작업이 완료될 때까지 기다립니다.
      await newPost.save();
      console.log('create New Data!');
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });

  it('새로운 이메일 인증 데이터를 저장하고 _id를 반환해야 합니다', (done) => {
    const email = 'test@example.com';
    const authCode = 123456;

    saveAuthCode(email, authCode)
      .then((result) => {
        // 결과가 _id 속성을 가져야 합니다.
        expect(result).to.have.property('_id');
        done(); // 비동기 작업이 완료되었음을 알립니다.
      })
      .catch((err) => done(err)); // 에러 발생 시 done에 에러를 전달합니다.
  });

  it('존재하지 않는 이메일에 대해 success가 true를 반환해야 합니다', (done) => {
    const email = 'non_existing@example.com';

    checkEmail(email)
      .then((result) => {
        // 결과가 success 속성이 true여야 합니다.
        expect(result).to.have.property('success').to.be.true;
        done();
      })
      .catch((err) => done(err));
  });

  it('이미 존재하는 이메일에 대해 success가 false를 반환해야 합니다', (done) => {
    const email = 'test@example.com';

    checkEmail(email)
      .then((result) => {
        // 결과가 success 속성이 false여야 합니다.
        expect(result).to.have.property('success').to.be.false;
        done();
      })
      .catch((err) => done(err));
  });

  it('유효한 이메일과 코드에 대해 success가 true를 반환해야 합니다', (done) => {
    const email = 'test@example.com';
    const authCode = 123456;

    // 먼저 인증 코드를 저장한 뒤 테스트합니다.
    saveAuthCode(email, authCode).then((result1) => {
      checkEmailAuthCode(email, authCode)
        .then((result2) => {
          // 결과가 success 속성이 true여야 합니다.
          expect(result2).to.have.property('success').to.be.true;
          done();
        })
        .catch((err) => done(err));
    });
  });

  it('유효하지 않은 이메일이나 코드에 대해 success가 false를 반환해야 합니다', (done) => {
    const email = 'test@example.com';
    const authCode = 111111;
    checkEmailAuthCode(email, authCode)
      .then((result2) => {
        // 결과가 success 속성이 false여야 합니다.
        expect(result2).to.have.property('success').to.be.false;
        done();
      })
      .catch((err) => done(err));
  });

  it('새로운 사용자 데이터를 저장하고 성공 여부를 반환해야 합니다', (done) => {
    // 테스트할 사용자 데이터
    const userData = {
      email: 'testw@example.com',
      name: 'Test User',
      phone_number: '010-1111-2222',
      user_type: 'user',
      password: 'salkdjlasd',
      nickname: 'test2',
      social_provider: 'none',
      wallet_address: '12341321231',
    };

    saveUserData(userData)
      .then((result) => {
        // 결과가 success 속성이 true여야 합니다.
        expect(result).to.have.property('success').to.be.true;
        done();
      })
      .catch((err) => done(err));
  });

  it('pw를 제거한 사용자 정보 조회', async () => {
    try {
      const user = await UserModel.findOne({ email: 'test@example.com' });
      const result = await getUser(user._id);

      // 결과가 success 속성이 true여야 합니다.
      expect(result).to.have.property('success').to.be.true;
      expect(result).to.not.have.property('hashed_pw');
    } catch (err) {
      throw err;
    }
  });

  it('General, Review Posts List 조회', async () => {
    try {
      const userId = new mongoose.Types.ObjectId('64cd330618b708cebbfccc49');
      const page = 1;
      const limit = 10;

      const result = await getPosts(userId, page, limit);

      // 결과가 success 속성이 true여야 합니다.
      expect(result).to.have.property('data');

      // 게시글 리스트가 null이 아닌지 검증합니다.
      const posts = result.data;
      expect(posts).to.not.be.null;

      // 페이징 정보가 올바르게 계산되었는지 검증합니다.
      expect(result).to.have.property('pagination');
      const pagination = result.pagination;
      expect(pagination).to.have.property('totalPages').to.be.a('number');
      expect(pagination).to.have.property('currentPage').to.be.a('number');
    } catch (err) {
      throw err;
    }
  });

  it('유저의 Nickname을 바꾼다', async () => {
    const newName = 'new Name';
    const result = await changeNickname('test@example.com', newName);

    expect(result.data).to.equal(newName);
  });

  after(async function () {
    // 테스트가 끝난 후에 MongoMemoryServer를 종료
    await mongoose.disconnect();
  });
});
