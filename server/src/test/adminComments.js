const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  getComments,
  getComment,
  deleteComment,
} = require('../services/admin/commentsController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
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
  let url;

  before(async function () {
    try {
      const result = await MongoMemoryServerStart();
      url = result.client.s.url;
      console.log(url);

      const user = await UserModel.create({
        email: 'test@example.com',
        name: 'Test',
        phone_number: '010-1111-2222',
        user_type: 'user',
        hashed_pw:
          '$2b$10$IspODcbUqPxCaVqZMsBkmOUZxktY1wsnVfW2V0iMQmagmdR0DI1da',
        nickname: 'nickname1',
        social_provider: 'kakao',
        wallet: {
          address: 'salkdlkasdjlk',
          token_amount: 0,
          badge_amount: 0,
          total_badge_score: 0,
          mileage_amount: 0,
        },
      });

      const post = await PostModel.create({
        user_id: user._id,
        category: 'notice',
        event_id: new mongoose.Types.ObjectId('64cd330618b708cebbfccc3b'),
        title: 'new Post',
        content: 'sakdljasd',
      });

      const newComment1 = await CommentModel.create({
        user_id: user._id,
        post_id: post._id,
        content: 'comment1',
      });
      const newComment2 = await CommentModel.create({
        user_id: user._id,
        post_id: post._id,
        content: 'comment2',
      });
      await newComment1.save();
      await newComment2.save();
      console.log('create New Data!');
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });

  it('getComments 함수 테스트 : should return comments based on given filters', async () => {
    const category = 'notice';
    const page = 1;
    const title = 'new Post';
    const content = 'sakdljasd';
    const writer = 'nickname1';
    const limit = 10;

    const result = await getComments(category, null, null, null, null, null);
    expect(result.data).to.be.an('array');
    expect(result.pagination).to.not.be.null;
    expect(result.data.length).to.equal(2);
  });

  it('getComments 함수 테스트 : should return no comments when filters do not match', async () => {
    const category = 'nonexistent';
    const page = 1;
    const title = 'nonexistent post';
    const content = 'nonexistent comment';
    const writer = 'nonexistent_user';
    const limit = 10;

    const result = await getComments(category, null, title, null, null, null);

    expect(result.data).to.be.null;
    expect(result.pagination).to.be.null;
  });

  it('should delete the comment with the given ID', async () => {
    const comment = await CommentModel.findOne({ content: 'comment1' });
    const result = await deleteComment(comment._id);
    expect(result.success).to.be.true;

    const deletedComment = await CommentModel.findById(comment._id);
    expect(deletedComment).to.be.null;
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
