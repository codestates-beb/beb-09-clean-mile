const Router = require('express');
const users = require('./routes/client/users');
const posts = require('./routes/client/posts');
const comments = require('./routes/client/comments');

module.exports = () => {
  const app = Router();

  // client/users 관련 라우터
  users(app);

  // client/posts 관련 라우터
  posts(app);

  // client/comments 관련 라우터
  comments(app);

  return app;
};
