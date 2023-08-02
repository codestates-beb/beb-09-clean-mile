const express = require('express');
const expressApp = require('./loaders/index.js');
const config = require('./config/index.js'); 

async function startServer() {
  const app = express();
  await expressApp(app);

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
