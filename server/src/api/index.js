const Router = require('express');
const users = require('./routes/client/users');
const posts = require('./routes/client/posts');
const comments = require('./routes/client/comments');
const events = require('./routes/client/events');
const adminAuth = require('./routes/admin/adminAuth');
const adminUsers = require('./routes/admin/users');

module.exports = () => {
  const app = Router();

  // client/users 관련 라우터
  users(app);

  // client/posts 관련 라우터
  posts(app);

  // client/comments 관련 라우터
  comments(app);

  // client/events 관련 라우터
  events(app);

  // admin/adminAuth 관련 라우터
  adminAuth(app);

  // admin/users 관련 라우터
  adminUsers(app);

  return app;
};
