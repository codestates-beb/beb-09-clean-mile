const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  savePost,
  editPostField,
  deletePost,
  postViews,
  findDetailPost,
  noticesLatestPost,
  getPosts,
  getEvents,
  getReviews,
  saveFiles,
} = require('../services/client/postsController');

const UserModel = require('../models/Users');
const PostModel = require('../models/Posts');
const EventEntryModel = require('../models/EventEntries');
const EventModel = require('../models/Events');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MongoMemoryServerStart = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  const connection = await mongoose.connect(uri);
  return connection.connection.db;
};

describe('client/postsControllerTest', () => {
  let url; // URI 변수를 선언하여 저장
  // 테스트용 사용자 ID로 가정합니다.
  const files = {
    image: [
      {
        originalname: 'image1.jpg',
        buffer: Buffer.from('image_data_1'),
        mimetype: 'image/jpeg',
      },
      {
        originalname: 'image2.png',
        buffer: Buffer.from('image_data_2'),
        mimetype: 'image/png',
      },
    ],
    video: [
      {
        originalname: 'video1.mp4',
        buffer: Buffer.from('video_data_1'),
        mimetype: 'video/mp4',
      },
    ],
  };

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

      const postData = await PostModel.create({
        user_id: userData._id,
        category: 'review',
        event_id: new mongoose.Types.ObjectId('64cd330618b708cebbfccc3b'),
        title: 'new Post',
        content: 'content',
      });

      await postData.save();
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });

  it('saveFiles 함수 테스트', async () => {
    const result = await saveFiles(files);

    expect(result)
      .to.have.property('imageUrls')
      .to.be.an('array')
      .with.lengthOf(2);
    expect(result)
      .to.have.property('videoUrls')
      .to.be.an('array')
      .with.lengthOf(1);
  });

  it('savePost 함수 테스트', async () => {
    // 테스트 데이터로 사용할 postData와 event 정보

    const newEvent = new EventModel({
      title: '더미 이벤트',
      host_id: new mongoose.Types.ObjectId(), // ObjectId를 생성하거나 기존에 존재하는 host_id를 사용해주세요.
      poster_url: ['poster_url_1', 'poster_url_2'],
      content: '더미 이벤트 내용입니다.',
      location: '더미 이벤트 장소',
      capacity: 100,
      remaining: 100,
      status: 'finished',
      event_type: 'fcfs',
      recruitment_start_at: new Date('2023-08-07T00:00:00Z'),
      recruitment_end_at: new Date('2023-08-14T00:00:00Z'),
      event_start_at: new Date('2023-09-01T10:00:00Z'),
      event_end_at: new Date('2023-09-01T18:00:00Z'),
      view: {
        count: 0,
        viewers: [],
      },
    });
    await newEvent.save();

    const event = await EventModel.findOne({ title: '더미 이벤트' });
    const user = await UserModel.findOne({ email: 'test@example.com' });

    // 이벤트에 사용자 등록
    const eventEntry = new EventEntryModel({
      event_id: event._id, // ObjectId를 생성하거나 기존에 존재하는 event_id를 사용해주세요.
      user_id: user._id, // ObjectId를 생성하거나 기존에 존재하는 user_id를 사용해주세요.
      is_confirmed: true,
      is_nft_issued: false,
      is_token_rewarded: false,
    });
    await eventEntry.save();

    const postData = {
      category: 'review',
      title: 'Test Post',
      content: 'Test content',
      event_id: event._id,
    };

    const result = await savePost(user._id, postData, files);

    expect(result).to.have.property('success').to.be.true;
    // 게시글이 실제로 데이터베이스에 저장되었는지 확인
    const savedPost = await PostModel.findById(result.data);
    expect(savedPost).to.not.be.null;
    // expect(savedPost).to.have.property('user_id', user._id);
    expect(savedPost).to.have.property('category', 'review');
    expect(savedPost).to.have.property('title', 'Test Post');
    expect(savedPost).to.have.property('content', 'Test content');
    // expect(savedPost).to.have.property('event_id', event._id);
    expect(savedPost)
      .to.have.nested.property('media.img')
      .to.be.an('array')
      .with.lengthOf(2);
    expect(savedPost)
      .to.have.nested.property('media.video')
      .to.be.an('array')
      .with.lengthOf(1);
  });

  it('editPostField 함수 테스트', async () => {
    const post = await PostModel.findOne({ title: 'Test Post' });
    const postId = post._id;

    // editPostField 함수를 테스트하기 위해 업데이트할 필드를 정의
    const updateFields = {
      title: 'Updated Test Post',
      content: 'Updated Test content',
    };

    const result = await editPostField(postId, updateFields);

    expect(result).to.have.property('success').to.be.true;

    // 수정된 포스트를 데이터베이스에서 가져와서 결과를 확인
    const updatedPost = await PostModel.findById(postId);

    expect(updatedPost).to.not.be.null;
    expect(updatedPost).to.have.property('title', 'Updated Test Post');
    expect(updatedPost).to.have.property('content', 'Updated Test content');
  });

  it('findDetailPost 및 postViews 함수 테스트', async () => {
    const post = await PostModel.findOne({ category: 'review' });
    const user = await UserModel.findOne({ email: 'test@example.com' });
    const req = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    };
    const result = await findDetailPost(req, post._id, user._id);

    expect(result).to.have.property('success').to.be.true;
    expect(result).to.have.property('data');
    expect(result.data).to.have.property('post');
    expect(result.data).to.have.property('comment');

    expect(result.data.post).to.have.property('title', 'new Post');
    expect(result.data.post).to.have.property('content', 'content');

    expect(result.data.post.view).to.not.have.property('viewers');
  });

  it('noticesLatestPost 함수 테스트', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    // 테스트용 공지사항 데이터 생성 및 저장
    const noticeData = new PostModel({
      user_id: user._id,
      category: 'notice',
      title: 'Test Notice',
      content: 'Test notice content',
    });
    await noticeData.save();

    // noticesLatestPost 함수 실행
    const result = await noticesLatestPost();

    expect(result).to.have.property('success').to.be.true;
    expect(result).to.have.property('data').to.be.an('array').with.lengthOf(1);
    expect(result.data[0]).to.have.property('category', 'notice');
    expect(result.data[0]).to.have.property('title', 'Test Notice');
    expect(result.data[0]).to.have.property('content', 'Test notice content');
  });

  it('getPosts 함수 - 정렬 순서가 올바른지 확인', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    // 테스트용 공지사항 데이터 생성 및 저장
    const testData = new PostModel({
      user_id: user._id,
      category: 'review',
      title: 'Test 2',
      content: 'Test 2',
    });
    await testData.save();
    // getPosts 함수 실행 - 정렬 순서가 desc인지 확인
    const resultDesc = await getPosts(1, 10, 'desc', 'review');
    expect(resultDesc)
      .to.have.property('data')
      .to.be.an('array')
      .with.lengthOf(3);
    expect(resultDesc.data[0]).to.have.property('title', 'Test 2');
    expect(resultDesc.data[1]).to.have.property('title', 'Updated Test Post');

    // getPosts 함수 실행 - 정렬 순서가 asc인지 확인
    const resultAsc = await getPosts(1, 10, 'asc', 'review');
    expect(resultAsc)
      .to.have.property('data')
      .to.be.an('array')
      .with.lengthOf(3);
    expect(resultAsc.data[0]).to.have.property('title', 'new Post');
    expect(resultAsc.data[1]).to.have.property('title', 'Updated Test Post');
  });

  it('getEvents 함수 - 제목과 내용으로 검색', async () => {
    // 테스트용 이벤트 데이터 생성 및 저장
    const newEvent = new EventModel({
      title: '더미 이벤트2',
      host_id: new mongoose.Types.ObjectId(), // ObjectId를 생성하거나 기존에 존재하는 host_id를 사용해주세요.
      poster_url: ['poster_url_1', 'poster_url_2'],
      content: '더미 이벤트 내용입니다.',
      location: '더미 이벤트 장소',
      capacity: 100,
      remaining: 100,
      status: 'finished',
      event_type: 'fcfs',
      recruitment_start_at: new Date('2023-08-07T00:00:00Z'),
      recruitment_end_at: new Date('2023-08-14T00:00:00Z'),
      event_start_at: new Date('2023-09-01T10:00:00Z'),
      event_end_at: new Date('2023-09-01T18:00:00Z'),
      view: {
        count: 0,
        viewers: [],
      },
    });
    await newEvent.save();

    // getEvents 함수 실행 - 제목과 내용으로 검색
    const result = await getEvents(null, 10, '더미', '더미');

    expect(result).to.have.property('data').to.be.an('array').with.lengthOf(2);
    expect(result.data[0]).to.have.property('title', '더미 이벤트2');
    expect(result.data[1]).to.have.property('title', '더미 이벤트');
    expect(result).to.have.property('last_id').to.be.a('string');
  });

  it('getEvents 함수 - 상태로 검색', async () => {
    // getEvents 함수 실행 - 상태로 검색 (ongoing)
    const resultOngoing = await getEvents(null, 10, null, null, 'finished');

    expect(resultOngoing)
      .to.have.property('data')
      .to.be.an('array')
      .with.lengthOf(2);

    // getEvents 함수 실행 - 상태로 검색 (finished)
    const resultFinished = await getEvents(null, 10, null, null, 'finished');

    expect(resultFinished)
      .to.have.property('data')
      .to.be.an('array')
      .with.lengthOf(2);
    expect(resultFinished.data[0]).to.have.property('status', 'finished');
  });

  it('getEvents 함수 - 페이징 처리 확인', async () => {
    // getEvents 함수 실행 - 2페이지, 페이지당 2개 아이템
    const lastEvent = await EventModel.findOne({ title: '더미 이벤트2' });
    const resultPage2 = await getEvents(
      lastEvent._id,
      1,
      null,
      null,
      'finished'
    );

    expect(resultPage2).to.have.property('data');
    expect(resultPage2.data[0]).to.have.property('title', '더미 이벤트');

    expect(resultPage2).to.have.property('last_id').to.be.a('string');
  });

  it('getReviews 함수 - 제목과 내용으로 검색', async () => {
    // getReviews 함수 실행 - 제목과 내용으로 검색
    const result = await getReviews(null, 10, 'new Post', 'content', 'desc');

    expect(result).to.have.property('data').to.be.an('array').with.lengthOf(1);
    expect(result.data[0]).to.have.property('title', 'new Post');
    expect(result).to.have.property('last_item').to.be.a('string');
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
