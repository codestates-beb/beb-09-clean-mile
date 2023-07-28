const Router = require('express');
const users = require('./routes/client/users');
const posts = require('./routes/client/posts');

module.exports = () => {
  const app = Router();

  // client/users 관련 라우터
  users(app);

  // client/posts 관련 라우터
  posts(app);

  return app;
};
