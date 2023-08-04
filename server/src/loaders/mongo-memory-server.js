const mongoose = require('mongoose');

const connectToDatabase = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the in-memory MongoDB server');
  } catch (err) {
    console.error('Error connecting to the in-memory MongoDB server:', err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
