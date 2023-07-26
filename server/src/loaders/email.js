const nodeMailer = require("nodemailer");
const config = require("../config/index.js");

const smtpTransport = nodeMailer.createTransport({
  service: config.mail.serviceName,
  auth: {
    user: config.mail.mailId,
    pass: config.mail.mailPassword,
  },
  tls: {
    /**
     * @todo 배포시 수정 필요할수도 있음
     * 서버 인증서의 유효성 검사를 무시하는 옵션 (TLS 연결 시 서버 인증서를 검사하지 않고 연결을 수립)
     * 자체 서명 인증서를 사용하는 테스트 환경 또는 신뢰할 수 없는 인증서를 사용하는 서버와 통신할 때 유용
     * 보안 상의 이유로 실제 운영 환경에서는 사용하지 않는 것이 좋음
     */
    rejectUnauthorized: false,
  },
});

module.exports = smtpTransport;
