const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async (app) => {
  const mongoConnection = await mongooseLoader(); // const mongoConnection = 지워도 됩니다.
  console.log(`✌️ DB loaded and connected!`);

  await expressLoader(app); // await 지워도 됩니다.
  console.log(`✌️ Express loaded`);
};
