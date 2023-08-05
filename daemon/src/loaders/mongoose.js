const mongoose = require('mongoose');
const config = require('../config/config.json');

module.exports = async () => {
  try{
    const connection = await mongoose.connect(config.DATABASE_URL);
    const mongoConnection = await connection.connection.db;
    console.log(`✌️ DB loaded and connected!`);
  }catch(err){
    console.error("Error:", err);
    throw new Error(err);
  }
};
