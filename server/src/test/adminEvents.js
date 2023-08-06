const { expect } = require('chai');
const mongoose = require('mongoose');
const {
  getEvents,
  getEvent,
  getEventEntries,
  exportToExcel,
  saveEventHost,
  saveEvent,
  updateEventHost,
  updateEvent,
  setEventStatusCanceled,
  deleteEvent,
  createQRcodeJWt,
  saveImage,
  saveImages,
} = require('../services/admin/eventsController'); // 실제 함수들이 들어 있는 모듈의 경로로 바꿔주세요.
const UserModel = require('../models/Users');
const EventHostModel = require('../models/EventHosts');
const EventModel = require('../models/Events');
const EventEntryModel = require('../models/EventEntries');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MongoMemoryServerStart = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  const connection = await mongoose.connect(uri);
  return connection.connection.db;
};

describe('admin/eventsControllerTest', () => {
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

      const hostData = new EventHostModel({
        name: 'Sample Host',
        email: 'samplehost@example.com',
        phone_number: '010-1234-5678',
        wallet_address: 'sample-wallet-address',
        organization: 'Sample Organization',
      });

      await hostData.save();

      const host = await EventHostModel.findOne({ name: 'Sample Host' });

      const eventEndAt = new Date();
      eventEndAt.setHours(eventEndAt.getHours() + 1);

      const newEvent = await EventModel.create({
        title: 'Sample Event',
        host_id: host._id,
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

      const event = await EventModel.findOne({ title: 'Sample Event' });
      const eventEntry = await EventEntryModel.create({
        event_id: event._id,
        user_id: user._id,
        is_confirmed: true,
        is_nft_issued: true,
        is_token_rewarded: true,
      });

      await eventEntry.save();
    } catch (err) {
      console.error('Error in before hook:', err);
      throw err;
    }
  });

  it('getEvents 함수 테스트 : should get all events when no filter is provided', async () => {
    const result = await getEvents(null, 1, 10, null, null, null);

    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.pagination).to.not.be.null;
  });

  it('getEvents 함수 테스트 : should get events with the provided status', async () => {
    const result = await getEvents('recruiting', 1, 10, null, null, null);

    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].status).to.equal('recruiting');
  });

  it('getEvents 함수 테스트 : should get events with the provided title', async () => {
    const result = await getEvents(null, 1, 10, 'Sample Event', null, null);

    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].title).to.equal('Sample Event');
  });

  it('getEvents 함수 테스트 : should get events with the provided content', async () => {
    const result = await getEvents(
      null,
      1,
      10,
      null,
      'This is a sample event description.',
      null
    );

    expect(result.data).to.be.an('array');
    expect(result.data.length).to.equal(1);
    expect(result.data[0].content).to.include(
      'This is a sample event description.'
    );
  });

  it('getEvents 함수 테스트 : should get events with the provided organization', async () => {
    const result = await getEvents(
      null,
      1,
      10,
      null,
      null,
      'Sample Organization'
    );

    expect(result.data.length).to.equal(1);
  });

  it('getEvent 함수 테스트 : should get event with badge data', async () => {
    // Get the sample event data from the database
    const event = await EventModel.findOne({ title: 'Sample Event' });

    // Call the function and get the result
    const result = await getEvent(event._id);

    // Assertion - Check the returned result
    expect(result.success).to.be.true;
    expect(result.data.event._id.toString()).to.equal(event._id.toString());
  });

  it('getEventEntries 함수 테스트 : Eshould get event entries for a valid event ID', async () => {
    const user = await UserModel.findOne({ name: 'Test' });
    const eventEntry = await EventEntryModel.findOne({ user_id: user._id });

    const result = await getEventEntries(eventEntry.event_id, 1, 10);

    expect(result.entries).to.be.an('array');
    expect(result.entries).to.have.length.above(0);
    expect(result.pagination).to.be.an('object');
  });

  it('saveEventHost 함수 테스트 : should save a new event host', async () => {
    const hostData = {
      name: 'Test Host',
      email: 'test@example.com',
      phone_number: '010-1234-5678',
      wallet_address: 'abc123xyz456',
      organization: 'Test Organization',
    };

    const result = await saveEventHost(hostData);
    expect(result.success).to.be.true;
    expect(result.id).to.exist;

    const savedHost = await EventHostModel.findById(result.id);
    expect(savedHost).to.exist;
    expect(savedHost.name).to.equal(hostData.name);
    expect(savedHost.email).to.equal(hostData.email);
    expect(savedHost.phone_number).to.equal(hostData.phone_number);
    expect(savedHost.wallet_address).to.equal(hostData.wallet_address);
    expect(savedHost.organization).to.equal(hostData.organization);
  });
  it('updateEventHost 함수 테스트 : should update the event host information', async () => {
    const event = await EventModel.findOne({ title: 'Sample Event' });
    const host = await EventHostModel.findOne({ name: 'Sample Host' });

    const updatedHostData = {
      name: 'Updated Host Name',
      email: 'updated@example.com',
      phone_number: '010-9876-5432',
      wallet_address: 'updated-wallet-address',
      organization: 'Updated Organization',
    };
    const result = await updateEventHost(
      event._id,
      updatedHostData.name,
      updatedHostData.email,
      updatedHostData.phone_number,
      updatedHostData.wallet_address,
      updatedHostData.organization
    );

    // Assertion - Check if the result indicates success
    expect(result.success).to.be.true;

    // Additional assertions - Check if the event host's information is updated in the database
    const updatedHost = await EventHostModel.findById(host._id);
    expect(updatedHost.name).to.equal(updatedHostData.name);
    expect(updatedHost.email).to.equal(updatedHostData.email);
    expect(updatedHost.phone_number).to.equal(updatedHostData.phone_number);
    expect(updatedHost.wallet_address).to.equal(updatedHostData.wallet_address);
    expect(updatedHost.organization).to.equal(updatedHostData.organization);
  });

  after(async function () {
    await mongoose.disconnect();
  });
});
