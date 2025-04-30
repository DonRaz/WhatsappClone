import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../types';

export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  // Check if token exists in the request headers
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No access token provided - add x-access-token to the request headers' });
  }

  // Verify the token
  jwt.verify(token as string, process.env.JWT_SECRET!, (err, decoded) => {
    // Handle different token verification errors
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          return res.status(401).json({
            message: 'Token has expired. Please login again.',
          });
        case 'JsonWebTokenError':
          return res.status(401).json({
            message: 'Invalid token. Please login again.',
          });
        default:
          return res.status(500).json({
            message: 'Failed to authenticate token.',
          });
      }
    }
    // Check if decoded exists and has the expected structure
    if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
        // If token is valid, save decoded info to request object for use in other routes
    // req.user = (decoded as any)?.user || null; // we'll get the user from the database
    // req.token = token as string; // token is in the request headers
    req.userId = (decoded as any)?.userId;
    next();
  });
};