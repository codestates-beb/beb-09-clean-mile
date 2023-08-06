const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  findEventDetail,
  eventEntry,
  getEventById,
  validateQRParticipation,
} = require('../services/client/eventsController'); // Replace this with the actual path to your commentsController module
const CommentModel = require('../models/Comments');
const UserModel = require('../models/Users');
const PostModel = require('../models/Posts');
const EventModel = require('../models/Events');
const EventEntryModel = require('../models/EventEntries');
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
      await user.save();
      const eventEndAt = new Date();
      eventEndAt.setHours(eventEndAt.getHours() + 1);
      const newEvent = await EventModel.create({
        title: 'Sample Event',
        host_id: new mongoose.Types.ObjectId(), // You can replace this with a valid event host ID
        poster_url: ['https://example.com/sample-poster.jpg'],
        content: 'This is a sample event description.',
        location: 'Seoul, South Korea',
        capacity: 100,
        remaining: 100,
        status: 'recruiting',
        event_type: 'fcfs',
        recruitment_start_at: new Date(),
        recruitment_end_at: new Date(),
        event_start_at: new Date(),
        event_end_at: eventEndAt,
        view: {
          count: 0,
          viewers: [],
        },
      });

      await newEvent.save();
    } catch (err) {
      console.error('Error:', err);
      throw Error(err);
    }
  });

  it('findEventDetail 함수 테스트 : should find event detail', async () => {
    const req = {
      headers: {
        'x-forwarded-for': 'client-ip-address', // Replace 'client-ip-address' with the actual client's IP address
      },
    };
    const event = await EventModel.findOne({ title: 'Sample Event' }); // Get the event data from the database
    const user = await UserModel.findOne({ name: 'Test' });

    // Call the function and get the result
    const result = await findEventDetail(req, event._id, user._id);

    // Assertion - Check the returned result
    expect(result.success).to.be.true;
    expect(result.data.event._id.toString()).to.equal(event._id.toString());
    expect(result.data.comments).to.be.an('array');
    expect(result.data.is_eventEntry).to.be.false; // As user_id is null, there should be no event entry
  });

  it('findEventDetail 함수 테스트 : should find event detail with event entry', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    const event = await EventModel.findOne({ title: 'Sample Event' });

    // Create a new event entry for the user and the event
    const eventEntryData = {
      event_id: event._id,
      user_id: user._id,
      is_confirmed: true,
    };
    const eventEntryModel = new EventEntryModel(eventEntryData);
    await eventEntryModel.save();

    const req = {
      headers: {
        'x-forwarded-for': 'client-ip-address', // Replace 'client-ip-address' with the actual client's IP address
      },
    };

    // Call the function and get the result
    const result = await findEventDetail(req, event._id, user._id);

    // Assertion - Check the returned result
    expect(result.success).to.be.true;
    expect(result.data.event._id.toString()).to.equal(event._id.toString());
    expect(result.data.comments).to.be.an('array');
    expect(result.data.is_eventEntry).to.be.true; // The user has an event entry
  });

  it('findEventDetail 함수 테스트 : should return failure for non-existing event', async () => {
    const req = {
      headers: {
        'x-forwarded-for': 'client-ip-address', // Replace 'client-ip-address' with the actual client's IP address
      },
    };
    const nonExistingEventId = new mongoose.Types.ObjectId();

    // Call the function with a non-existing event ID
    const result = await findEventDetail(req, nonExistingEventId, null);

    // Assertion - Check the returned result
    expect(result.success).to.be.false;
  });

  it('should successfully create an event entry', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    const event = await EventModel.findOne({ title: 'Sample Event' });
    await EventEntryModel.findOneAndDelete({ user_id: user._id });

    const result = await eventEntry(event._id, user._id);

    // Assertions
    expect(result.success).to.be.true;
  });

  it('should return an error when the event is not in recruiting status', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    const event = await EventModel.findOne({ title: 'Sample Event' });

    const result = await eventEntry(user._id, event._id);

    expect(result.success).to.be.false;
    expect(result.message).to.equal('존재하지 않는 이벤트입니다.');
  });

  it('should return the event details for a valid event ID', async () => {
    const user = await UserModel.findOne({ email: 'test@example.com' });
    const event = await EventModel.findOne({ title: 'Sample Event' });

    const result = await getEventById(event._id);

    expect(result.success).to.be.true;
    expect(result.data.title).to.equal('Sample Event');
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
