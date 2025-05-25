// FILE _________ inedx.ts ___ backend entry point _____
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import prisma from './configs/db';
import usersRouter from './routers/usersRouter';
import messagesRouter from './routers/messagesRouter';
import conversationsRouter from './routers/conversationsRouter';
import authRouter from './routers/authRouter';
import uploadthingRouter from './routers/uploadthingRouter';
import docsOcrRouter from './routers/docsOcrRouter';
import { initializeRealtimeProvider } from './realtime';

// Load environment variables - Prisma will have already loaded .env
dotenv.config();

console.log('Environment: NODE_ENV =', process.env.NODE_ENV);

const app = express();
const server = http.createServer(app);

// Determine if we're running on Vercel (production) or locally
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

// Initialize realtime provider based on environment
if (isProduction) {
  // Use Pusher in production (Vercel)
  console.log('Initializing Pusher provider for production');
  
  // Get and trim Pusher credentials from environment variables
  const pusherCredentials = {
    appId: process.env.PUSHER_APP_ID?.trim() || '1974678',
    key: process.env.PUSHER_KEY?.trim() || 'ecfb1e5db72d84b4f090',
    secret: process.env.PUSHER_SECRET?.trim() || '806a76f0885b098ccd80',
    cluster: process.env.PUSHER_CLUSTER?.trim() || 'eu'
  };
  
  console.log('Using Pusher credentials (trimmed):', {
    appId: pusherCredentials.appId,
    key: pusherCredentials.key,
    cluster: pusherCredentials.cluster
  });
  
  initializeRealtimeProvider('pusher', pusherCredentials);
} else {
  // Use Socket.IO in development (localhost)
  console.log('Initializing Socket.IO provider for development');
  initializeRealtimeProvider('socketio', server);
}

// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://whatsapp-clone-client-xi.vercel.app'
    ];

console.log('CORS allowed origins:', allowedOrigins);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // If not allowed
    console.warn(`Origin ${origin} not allowed by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'x-access-token',
    // UploadThing specific headers - add all possible headers used by UploadThing
    'x-uploadthing-version',
    'x-uploadthing-id',
    'x-uploadthing-package',
    'uploadthing-client'
  ]
}));
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);
app.use('/api/uploadthing', uploadthingRouter); // couldn't remove 'api/' since uploadthing is not working without it
app.use('/ocr', docsOcrRouter);
// Special error handler for uploadthing routes to provide more detailed error info
app.use('/uploadthing', (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('UploadThing error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headers: req.headers,
  });

  // Send a 500 with detailed error message for debugging
  return res.status(500).json({
    error: 'File upload error',
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Log important URLs for debugging
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`UploadThing API URL: http://localhost:${PORT}/uploadthing`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 