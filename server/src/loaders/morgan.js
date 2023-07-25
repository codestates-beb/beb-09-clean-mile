const fs = require("fs");
const path = require("path");

// log 디렉토리가 없으면 생성
const logDir = path.join(__dirname, "../log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// access.log 파일이 없으면 생성
const accessLogPath = path.join(logDir, "access.log");

if (!fs.existsSync(accessLogPath)) {
  fs.writeFileSync(accessLogPath, "", { flag: "wx" });
}

const accessLogStream = fs.createWriteStream(`${__dirname}/../log/access.log`, {
  flags: "a",
});

module.exports = accessLogStream;
