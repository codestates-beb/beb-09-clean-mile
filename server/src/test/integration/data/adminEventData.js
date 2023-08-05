module.exports = {
  // 관리자 로그인
  reqAdminLogin: {
    email: 'admin@admin.com',
    password: '|p_dRlR(?uY7>(e.',
  },

  // 관리자, 이벤트 데이터
  reqCreateEvent: {
    name: 'John Doe',
    email: 'john@example.com',
    phone_number: '1234567890',
    wallet_address: 'wallet-address',
    organization: 'Example Org',
    title: 'Test Event',
    content: 'Test Event Content',
    location: 'Test Location',
    capacity: 100,
    event_type: 'fcfs',
    recruitment_start_at: '2023-08-04T17:47:23.060+00:00',
    recruitment_end_at: '2023-08-05T17:47:23.060+00:00',
    event_start_at: '2023-08-06T17:47:23.060+00:00',
    event_end_at: '2023-08-07T17:47:23.060+00:00',
  },

  // 파일 데이터
  reqCreateEventFile: [
    {
      fieldname: 'poster_image',
      originalname: 'test_image.jpg',
      mimetype: 'image/jpeg',
      size: 2 * 1024 * 1024,
    },
  ],
};
