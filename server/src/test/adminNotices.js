const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  getNotices,
  getNotice,
  saveNotice,
  updateNotice,
  deleteNotice,
} = require('../services/admin/noticesController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
const UserModel = require('../models/Users');
const PostModel = require('../models/Posts');
const CommentModel = require('../models/Comments');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MongoMemoryServerStart = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  const connection = await mongoose.connect(uri);
  return connection.connection.db;
};

describe('admin/noticesControllerTest', () => {
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

      const user = await UserModel.findOne({ name: 'Test' });

      const postData = await PostModel.create({
        user_id: user._id,
        category: 'notice',
        event_id: new mongoose.Types.ObjectId('64cd330618b708cebbfccc3b'),
        title: 'new Post',
        content: 'content',
      });

      await postData.save();

      const post = await PostModel.findOne({ title: 'new Post' });

      const commentData = await CommentModel.create({
        content: 'This is a sample comment.',
        post_id: post._id,
        user_id: user._id,
        created_at: new Date(),
      });

      await commentData.save();
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });

  it('getNotices 함수 테스트 : should get notices list', async () => {
    const page = 1;
    const limit = 10;
    const category = 'notice';
    const title = 'new Post';
    const content = 'content';
    const result = await getNotices(page, limit, title, content, category);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data).to.have.lengthOf.at.most(limit);
    expect(result.pagination).to.be.an('object');
  });

  it('getNotices 함수 테스트 : should return empty data for non-existent notices', async () => {
    // Call the function with non-existent category
    const page = 1;
    const limit = 10;
    const category = 'nonexistent'; // A category that doesn't exist in the database
    const result = await getNotices(page, limit, '', '', category);

    // Assertion - Check the returned result
    expect(result.data).to.be.null;
    expect(result.pagination).to.be.null;
  });

  after(async function () {
    await mongoose.disconnect();
  });

  it('getNotice 함수 테스트 : should get the notice data by id', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });
    const result = await getNotice(post._id);

    expect(result.success).to.be.true;
    expect(result.data).to.be.an('object');
    expect(result.data.title).to.equal(post.title);
    expect(result.data.content).to.equal(post.content);
  });

  it('getNotice 함수 테스트 : should return false for non-existent notice', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const result = await getNotice(nonExistentId);

    expect(result.success).to.be.false;
  });

  it('should save a new notice', async () => {
    const user = await UserModel.findOne({ name: 'Test' });

    const result = await saveNotice(
      'new Notice',
      'hello',
      user._id,
      'notice',
      {}
    );

    // Assertion - Check the returned result
    expect(result.success).to.be.true;
  });

  it('updateNotice 함수 테스트 : should update the notice with the given notice_id, title, and content', async () => {
    const notice = await PostModel.findOne({ title: 'new Post' });
    const updatedTitle = 'Updated Notice Title';
    const updatedContent = 'This is the updated notice content.';
    const result = await updateNotice(notice._id, updatedTitle, updatedContent);

    // Assertion - Check the returned result
    expect(result.success).to.be.true;

    // Check if the notice has been updated in the database
    const updatedNotice = await PostModel.findById(notice._id);
    expect(updatedNotice.title).to.equal(updatedTitle);
    expect(updatedNotice.content).to.equal(updatedContent);
  });

  it('deleteNotice 함수 테스트 : should delete the notice with the given notice_id', async () => {
    const notice = await PostModel.findOne({ title: 'Updated Notice Title' });
    const result = await deleteNotice(notice._id);

    expect(result.success).to.be.true;

    const deletedNotice = await PostModel.findById(notice._id);
    expect(deletedNotice).to.be.null;
  });
  after(async function () {
    await mongoose.disconnect();
  });
});
