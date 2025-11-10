const mongoose = require('mongoose');
require('dotenv').config();

class MongoDBConnection {
  static async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✓ MongoDB Atlas connected successfully');
    } catch (error) {
      console.error('✗ MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

module.exports = MongoDBConnection;
