import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cartverse';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Do not crash server in development if local Mongo is not running yet
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('[Database Warning] Running in development mode without MongoDB connection. Real DB operations will fail until MongoDB is started.');
    }
  }
};

export default connectDB;