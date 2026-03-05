import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance_app';

export async function getDb() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection.db;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully');
    return mongoose.connection.db;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// These are legacy helpers for SQL, they won't work with Mongo
// but keeping the names to avoid immediate crash if imported
export const dbGet = () => { throw new Error('SQL dbGet is no longer supported. Use Mongoose models.'); };
export const dbAll = () => { throw new Error('SQL dbAll is no longer supported. Use Mongoose models.'); };
export const dbRun = () => { throw new Error('SQL dbRun is no longer supported. Use Mongoose models.'); };
export const persist = () => { };
