import { UserData } from '@sraz-sw/fullstack-shared';
import { Request } from 'express';
export interface RequestWithUser extends Request {
  userId?: string; // use if you want to verify the user from the DB every time
  user?: UserData; // use if not worried about verifying the user from the DB every time
} 