import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import usersService from '../services/usersService';
import { z } from 'zod';
import {createUserViaEmailSchema, loginWithEmailSchema } from '@sraz-sw/fullstack-shared';
const router = express.Router();
// Entry point http://localhost:3010/auth

router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input with Zod (throws error if data is not valid)
    const { email, password } = loginWithEmailSchema.parse(req.body);
    console.log('login: ---- ', email, password, ' --------');
    
    const user = await usersService.getUserByEmailNPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Convert to shared format for JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    user.token = token;
    delete user.hashedPassword;
    user.isOnline = true;
    res.json({ 
      // token,
      user: user
    });

  } catch (error: any) {
    console.error('Authentication error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.status(500).json({ message: 'An error occurred during authentication', error: error.message });
  }
/** front end code to save the token and user
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', data.user); 
    location.href = 'products.html'; // redirect page
*/
});

// register
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate input with Zod (throws error if data is not valid)
    const { email, password, name } = createUserViaEmailSchema.parse(req.body);
        
    // Create user using validated data
    const user = await usersService.createUser(email, password, name);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    user.token = token;
    delete user.hashedPassword;
    user.isOnline = true;
    res.status(201).json({user}); 

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ message: 'An error occurred during registration', error: error.message });
  }
});

//log out
router.post('/logout', (req: Request, res: Response) => {
  // Nothing to do server-side with the JWT itself
  res.json({ message: 'Logged out successfully' });
/** Front-end logout code
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    location.href = 'login.html'; // redirect to login page
*/
});

export default router; 