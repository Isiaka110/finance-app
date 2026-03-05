import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import goalRoutes from './routes/goalRoutes.js';

import { getDb } from './db.js';

dotenv.config();

const app = express();

// Initialize MongoDB
getDb();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok', db: 'MongoDB' }));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 API Server  → http://localhost:${PORT}`);
        console.log(`📦 Database    → MongoDB`);
        console.log(`🖥️  Frontend   → http://localhost:5173`);
    });
}

export default app;
