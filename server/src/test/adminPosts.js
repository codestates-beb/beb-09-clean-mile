const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  getPosts,
  getPost,
  deletePost,
  getPostWithComments,
} = require('../services/admin/postsController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
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

describe('admin/postsControllerTest', () => {
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
        category: 'review',
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

  it('getPosts 함수 테스트 : should find posts by category', async () => {
    // Call the function with category parameter
    const result = await getPosts('review', 1, null, null, null, 10);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].category).to.equal('review');
  });

  it('getPosts 함수 테스트 : should find posts by title', async () => {
    // Call the function with title parameter
    const result = await getPosts(null, 1, 'new Post', null, null, 10);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].title).to.equal('new Post');
  });

  it('getPosts 함수 테스트 : should find posts by content', async () => {
    // Call the function with content parameter
    const result = await getPosts(null, 1, null, 'content', null, 10);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].content).to.contain('content');
  });

  it('getPosts 함수 테스트 : should find posts by writer', async () => {
    // Call the function with writer parameter
    const result = await getPosts(null, 1, null, null, 'Test', 10);

    // Assertion - Check the returned result
    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].user_id.nickname).to.equal('Test');
  });

  it('getPosts 함수 테스트 : should return null data for non-existent query', async () => {
    // Call the function with a non-existent query
    const result = await getPosts(
      'nonexistent',
      1,
      'Non Existent Post',
      'nonexistent content',
      'nonexistentwriter',
      10
    );

    // Assertion - Check the returned result
    expect(result.success).to.be.false;
  });

  it('getPostWithComments 함수 테스트 : should find a post with comments by ID', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });

    const result = await getPostWithComments(post._id);

    expect(result.success).to.be.true;
    expect(result.data).to.be.an('object');
    expect(result.data.post.title).to.equal('new Post');
    expect(result.data.comments).to.be.an('array');
    expect(result.data.comments[0].content).to.equal(
      'This is a sample comment.'
    );
  });

  it('getPostWithComments 함수 테스트 : should return false for non-existent post ID', async () => {
    const result = await getPostWithComments(new mongoose.Types.ObjectId());

    expect(result.success).to.be.false;
    expect(result.message).to.equal('게시글 조회에 실패했습니다.');
  });

  it('should delete a post by ID', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });
    const result = await deletePost(post._id);

    // Assertion - Check the returned result
    expect(result.success).to.be.true;
    const result2 = await PostModel.findOne({ title: 'new Post' });
    expect(result2).to.be.null;
  });

  it('should return false for non-existent post ID', async () => {
    // Call the function with a non-existent post ID
    const result = await deletePost(new mongoose.Types.ObjectId());

    // Assertion - Check the returned result
    expect(result.success).to.be.false;
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
