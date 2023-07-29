const express = require('express');
const expressApp = require('./loaders/index.js');
const config = require('./config/index.js');

//테스트 부분
// const createDNFT  = require("./services/contract/dnftController.js").createDNFT;

async function startServer() {
  const app = express();
  await expressApp(app);

  app.post('/createDNFT', createDNFTHandler);

  // /createDNFT 경로의 라우터 핸들러 함수
  async function createDNFTHandler(req, res) {
    try {
      const { email, userType } = req.body; // POST 요청의 body로부터 email과 userType을 받아옵니다.

      // Ethereum 스마트 컨트랙트와 상호작용하여 DNFT를 생성하는 createDNFT 함수 호출
      const result = await createDNFT(email, userType);

      // 요청 결과에 따라 응답을 처리합니다.
      if (result.success) {
        res.status(200).json({ success: true, message: 'DNFT 생성에 성공했습니다.' });
      } else {
        res.status(500).json({ success: false, message: 'DNFT 생성에 실패했습니다.' });
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, message: '서버 오류 발생' });
    }
  }

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
