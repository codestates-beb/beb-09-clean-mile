const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  updateCommentLikes,
  saveComment,
  findComment,
  editComment,
  deleteComment,
  likeComment,
} = require('../services/client/commentsController'); // Replace this with the actual path to your commentsController module
const CommentModel = require('../models/Comments');
const UserModel = require('../models/Users');
const PostModel = require('../models/Posts');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MongoMemoryServerStart = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  const connection = await mongoose.connect(uri);
  return connection.connection.db;
};

describe('client/commentsController', () => {
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

  it('updateCommentLikes 함수 테스트', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });
    const user = await UserModel.findOne({ name: 'Test' });

    const user_id = user._id;
    const post_id = post._id;

    // Call the function and get the result
    const updatedComments = await updateCommentLikes(post_id, user_id);

    // Convert _id and post_id to strings for comparison
    const plainUpdatedComments = updatedComments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      post_id: comment.post_id.toString(),
    }));

    // Assertion - Check the updatedComments array for the expected changes
    expect(plainUpdatedComments[0].user_id.nickname).to.equal('nickname1');
    expect(plainUpdatedComments[1].user_id.nickname).to.equal('nickname1');
    expect(plainUpdatedComments[0].user_id._id.toString()).to.equal(
      user._id.toString()
    );
    expect(plainUpdatedComments[1].user_id._id.toString()).to.equal(
      user._id.toString()
    );
    expect(plainUpdatedComments[0].post_id).to.equal(post._id.toString());
    expect(plainUpdatedComments[1].post_id).to.equal(post._id.toString());
    expect(plainUpdatedComments[0].likes.count).to.equal(0);
    expect(plainUpdatedComments[1].likes.count).to.equal(0);
  });

  it('saveComment 함수 테스트', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });
    const user = await UserModel.findOne({ name: 'Test' });
    const user_id = user._id;
    const post_id = post._id;
    const content = 'This is a test comment';

    // Call the saveComment function
    const result = await saveComment(user_id, post_id, content);

    // Check if the result indicates success
    expect(result.success).to.be.true;

    // Check if the result data contains the comment's _id
    expect(result.data).to.exist;

    // Retrieve the saved comment from the database
    const savedComment = await CommentModel.findById(result.data);

    // Check if the saved comment matches the input data
    expect(savedComment.user_id.toString()).to.equal(user_id.toString());
    expect(savedComment.post_id.toString()).to.equal(post_id.toString());
    expect(savedComment.content).to.equal(content);
  });

  it('findComment 함수 테스트', async () => {
    const comment = await CommentModel.findOne({ content: 'comment1' });
    const commentId = comment._id;

    const result = await findComment(commentId);

    expect(result.data).to.have.property('_id').to.deep.equal(comment._id);
    expect(result.data).to.have.property('content', 'comment1');
  });

  it('editComment 함수 테스트', async () => {
    const comment = await CommentModel.findOne({ content: 'comment1' });
    const commentId = comment._id;

    const result = await editComment(commentId, 'new content1');

    expect(result.success).to.be.true;
  });

  it('deleteComment 함수 테스트', async () => {
    const comment = await CommentModel.findOne({ content: 'new content1' });
    const commentId = comment._id;

    const result = await deleteComment(commentId);

    expect(result.success).to.be.true;
    const len = await CommentModel.find();
    expect(len.length).to.equal(2);
  });

  it('likeComment 함수 테스트: 좋아요 누르기', async () => {
    const post = await PostModel.findOne({ title: 'new Post' });
    const user = await UserModel.findOne({ name: 'Test' });
    const comment = await CommentModel.findOne({ content: 'comment2' });

    // Call the function and get the result for unliking the comment
    const unlikeResult = await likeComment({ data: comment }, user._id);

    // Assertion - Check if the comment is unliked successfully
    expect(unlikeResult.success).to.be.true;
    expect(unlikeResult.data.likes.count).to.equal(1);
    expect(unlikeResult.data.likes.likers).to.not.include([user._id]);
  });

  it('likeComment 함수 테스트: 좋아요 취소', async () => {
    const user = await UserModel.findOne({ name: 'Test' });
    const comment = await CommentModel.findOne({ content: 'comment2' });

    // Call the function and get the result for unliking the comment
    const unlikeResult = await likeComment({ data: comment }, user._id);

    // Assertion - Check if the comment is unliked successfully
    expect(unlikeResult.success).to.be.true;
    expect(unlikeResult.data.likes.count).to.equal(0);
    expect(unlikeResult.data.likes.likers).to.not.include([]);
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
