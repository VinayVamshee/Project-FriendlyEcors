const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set connection timeout to 3 seconds for quick demo fallback trigger
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/friendlyecors', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbFallback = false;
  } catch (error) {
    console.warn(`\n⚠️ MongoDB connection failed: ${error.message}`);
    console.warn('⚡ SERVER RUNNING IN IN-MEMORY DEMO MODE ⚡');
    console.warn('All CRUD edits (adding products, reviews) will be temporary and reset on restart.\n');
    global.dbFallback = true;
  }
};

module.exports = connectDB;
