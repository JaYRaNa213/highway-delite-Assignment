import './config/env'; // loads .env immediately

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiter
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { success: false, message: 'Too many requests' },
  })
);

// ✅ Define allowed origins
// ✅ Get allowed origins from env
const allowedOrigins = [
  "https://highway-delite-assignment-ten.vercel.app",
  "http://localhost:5173" // optional for dev
];
app.use(cors({ origin: allowedOrigins, credentials: true }));



// Health check
app.get('/health', (req, res) =>
  res.json({ success: true, message: 'Server running' })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 404
app.use('*', (req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

// Error handler
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || 'Internal server error' });
  }
);


// Start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
