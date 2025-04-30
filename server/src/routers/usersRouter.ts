import express, { Request, Response } from 'express';
import usersService from '../services/usersService';
import { z } from 'zod';
import { userSchema } from '@sraz-sw/fullstack-shared';
import { authenticateToken } from '../middleware/auth';
import { RequestWithUser } from '../types';
import * as QueryString from 'qs';
import { validateFileUrl } from '../services/fileStorageService';
// import { parseFilters, QueryFilters } from '@sraz-sw/fullstack-shared'; // custom query params

const router = express.Router();

// Entry point: http://localhost:3010/users

// GET all users
router.get('/', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		// // get query params (for example - which conversations the user is part of)
		// const query = req.query;
    const query: QueryString.ParsedQs = req.query;
		const allUsers = await usersService.getAllUsers(query);
		res.json(allUsers);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
// GET all users
router.get('/me', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		const currentUser = await usersService.getUserById(req.userId!); // ! since it must be in authenticated routes
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}
		res.json(currentUser);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// PATCH update user profile (including profile image)
router.patch('/me', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req.userId!;
		
		console.log('Received profile update request:', {
			userId,
			requestBody: req.body,
		});
		
		// Create a validation schema that handles both general profile updates and image updates
		const updateProfileSchema = userSchema.partial().omit({
			id: true,
			hashedPassword: true,
			createdAt: true,
			updatedAt: true,
		})
		
		// Parse and validate the input
		let parsedInput;
		try {
			parsedInput = updateProfileSchema.parse(req.body);
		} catch (validationError) {
			console.error('Profile update validation error:', validationError);
			
			if (validationError instanceof z.ZodError) {
				return res.status(400).json({
					message: 'Validation error',
					errors: validationError.errors.map((err) => ({
						path: err.path.join('.'),
						message: err.message,
					})),
				});
			}
			
			return res.status(400).json({ 
				error: 'Invalid input format',
				message: (validationError as Error).message
			});
		}
		
		// Process the imageUrl if it's provided (for backwards compatibility)
		if (parsedInput.image) {
			// Validate the URL using our file storage service
			const isValidUrl = await validateFileUrl(parsedInput.image);
			if (!isValidUrl) {
				console.error('Invalid or inaccessible image URL:', parsedInput.image);
				return res.status(400).json({ 
					error: 'Invalid image URL', 
					message: 'The provided image URL could not be validated or is not accessible'
				});
			}
			console.log('Processing image URL update:', parsedInput.image);
		}
		
		// Update user with validated data
		const updatedUser = await usersService.updateUser(userId, parsedInput);
		
		console.log('Updated user profile successfully:', {
			userId,
			updatedFields: Object.keys(parsedInput),
		});
		
		res.json(updatedUser);
	} catch (error: any) {
		console.error('Error updating profile:', error);
		
		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation error',
				errors: error.errors.map((err) => ({
					path: err.path.join('.'),
					message: err.message,
				})),
			});
		}

		res.status(500).json({ 
			error: 'Failed to update profile',
			message: error.message 
		});
	}
});

// PUT update user
router.put('/:id', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		const userId  = req.userId!
		// Validate input with Zod (TODO: verify it, and move to shared)
		const updateUserSchema = userSchema.partial().omit({
			id: true,
			hashedPassword: true,
			createdAt: true,
			updatedAt: true,
			
			
		});
		const validatedData = updateUserSchema.parse(req.body);

		const updatedUser = await usersService.updateUser(userId, validatedData);
		console.log('updatedUser', JSON.stringify(updatedUser, null, 2));
		res.json(updatedUser);
	} catch (error: any) {
		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				message: 'Validation error',
				errors: error.errors.map((err) => ({
					path: err.path.join('.'),
					message: err.message,
				})),
			});
		}

		res.status(400).json({ error: error.message });
	}
});


export default router;
