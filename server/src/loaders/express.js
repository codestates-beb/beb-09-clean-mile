const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const routes = require('../api');
const config = require('../config');
const accessLogStream = require('../loaders/morgan');

module.exports = (app) => {
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  );

  // application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // Transforms the raw string of req.body into JSON
  app.use(express.json());

  app.use(cookieParser());

  // morgan middleware to log HTTP requests
  // dev : 개발, combined : 배포
  let logType;
  if (config.nodeEnv === 'production') {
    logType = 'combined';
  } else if (config.nodeEnv === 'development') {
    logType = 'dev';
  }

  // morgan 미들웨어를 통해 로그를 출력할 파일 지정
  //app.use(morgan(logType), { stream: accessLogStream });

  // morgan 미들웨어를 통해 console에 로그를 출력
  app.use(morgan(logType));

  // Load API routes
  app.use(routes());
};
