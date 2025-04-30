import express, { Request, Response, NextFunction } from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../utils/uploadthing";
import cors from "cors";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

console.log("Setting up UploadThing router at /uploadthing");

// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://whatsapp-clone-client-xi.vercel.app'
    ];

console.log("UploadThing allowed origins:", allowedOrigins);

// Add specific CORS for this route to handle UploadThing's headers
const uploadThingCors = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl requests or mobile apps)
    if (!origin) {
      console.log("UploadThing: Allowing request with no origin");
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      console.log(`UploadThing: Allowing request from origin: ${origin}`);
      return callback(null, true);
    }
    
    // For development, allow any origin if we're in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`UploadThing: Development mode - allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // If not allowed
    console.warn(`UploadThing: Origin not allowed by CORS: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-uploadthing-version',
    'x-uploadthing-id',
    'x-uploadthing-package',
    'uploadthing-client',
    'Origin',
    'Accept'
  ]
});

// Apply CORS specifically for UploadThing routes
router.use(uploadThingCors);

// Log all requests to uploadthing for debugging
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`UploadThing request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Test route is working
router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "UploadThing router is working!" });
});

// Set up the UploadThing handler
router.use(
  "/",
  createRouteHandler({
    router: uploadRouter,
    config: {
      // Add any necessary configuration
      logLevel: "Debug", // Set to 'Debug' for more logs
    },
  })
);

// Error handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("UploadThing error:", err);
  res.status(500).json({ 
    error: "File upload failed",
    message: err.message 
  });
});

export default router; 