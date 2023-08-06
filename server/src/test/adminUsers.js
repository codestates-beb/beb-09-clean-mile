const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  findUsers,
  getUserDetail,
  getComments,
  deleteUser,
} = require('../services/admin/usersController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
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

      await userData.save();
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });
  it('getPosts 함수 테스트 : should find users by social provider', async () => {
    // Call the function with social_provider parameter
    const result = await findUsers(1, 10, 'kakao', null, null, null);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].social_provider).to.equal('kakao');
  });

  it('getPosts 함수 테스트 : should find users by name', async () => {
    // Call the function with name parameter
    const result = await findUsers(1, 10, null, 'Test', null, null);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].name).to.equal('Test');
  });

  it('getPosts 함수 테스트 : should find users by email', async () => {
    // Call the function with email parameter
    const result = await findUsers(1, 10, null, null, 'test@example.com', null);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].email).to.equal('test@example.com');
  });

  it('getUserDetail 함수 테스트', async () => {
    const user = await UserModel.findOne({ name: 'Test' });

    const result = await getUserDetail(user._id);

    expect(result.success).to.be.true;
    expect(result.data.user.name).to.equal('Test');
    expect(result.data).to.have.property('posts');
    expect(result.data).to.have.property('events');
    expect(result.data).to.have.property('comments');
  });

  it('deleteUser 함수 테스트', async () => {
    const user = await UserModel.findOne({ name: 'Test' });

    await deleteUser(user._id);

    const result = await UserModel.find();

    expect(result.length).to.equal(0);
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
