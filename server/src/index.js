const express = require('express');
const schedule = require('node-schedule');
const expressApp = require('./loaders/index.js');
const config = require('./config/index.js');

async function startServer() {
  const app = express();
  await expressApp(app);

  // 이벤트 스케줄러 실행
  await eventScheduler(); // 함수로 호출

  // 스케줄 설정
  schedule.scheduleJob('* * * * *', async () => {
    await eventScheduler(); // eventScheduler 함수를 스케줄에 등록
  });

  app
    .listen(config.port, () => {
      console.log(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `);
    })
    .on('error', (err) => {
      console.log(err);
      process.exit(1);
    });
}

startServer();
