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
    throw err; // Rely on retry or express error handling
  }
}

export const persist = () => { };
