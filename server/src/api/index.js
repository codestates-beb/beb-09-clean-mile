const Router = require('express');
const users = require('./routes/client/users');
const posts = require('./routes/client/posts');
const comments = require('./routes/client/comments');
const events = require('./routes/client/events');
const adminAuth = require('./routes/admin/adminAuth');
const adminUsers = require('./routes/admin/users');
const adminEvents = require('./routes/admin/events');
const adminPosts = require('./routes/admin/posts');
const adminComments = require('./routes/admin/comments');
const adminNotices = require('./routes/admin/notices');

module.exports = () => {
  const app = Router();

  app.get('/', (req, res) => {
    res.send('OK');
  });

  /**
   ******** Client API ********
   */

  // users 라우터
  users(app);

  // posts 라우터
  posts(app);

  // comments 라우터
  comments(app);

  // events 라우터
  events(app);

  /**
   ******** Admin API *******
   */

  // adminAuth 라우터
  adminAuth(app);

  // users 라우터
  adminUsers(app);

  // events 라우터
  adminEvents(app);

  // posts 라우터
  adminPosts(app);

  // comments 라우터
  adminComments(app);

  // notices 라우터
  adminNotices(app);

  return app;
};
