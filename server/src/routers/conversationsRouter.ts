import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { RequestWithUser } from '../types';
import { z } from 'zod';
import usersService from '../services/usersService';
import { createNewConversationSchema } from '@sraz-sw/fullstack-shared';
import conversationsService from '../services/conversationsService';

const router = express.Router();

// create new conversations
router.post('/', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const { isGroup, userIds: members, name } = createNewConversationSchema.parse(req.body);

		try {
			const newConversation = await conversationsService.createConversation(
				isGroup,
				members,
				name,
				currentUser
			);
			return res.json(newConversation);
		} catch (error: any) {
			return res.status(400).json({ error: error.message });
		}
	} catch (error: any) {
		console.error('Error creating conversation:', error);
		res.status(500).json({ error: error.message });
	}
});

// get all conversations for a user
router.get('/', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const conversations = await conversationsService.getAllConversations(
			req.query,
			req.query?.isIncludingMessages === 'true' || true,
			currentUser
		);

		return res.json(conversations);
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

// get conversation by id
router.get('/:conversationId', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const { conversationId } = req.params;

		const conversation = await conversationsService.getConversationById(
			conversationId,
			currentUser
		);

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		return res.json(conversation);
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

// edit group (name / image / add/remove members)
router.put('/:conversationId', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const { conversationId } = req.params;
		const { name, addMembers = [], removeMembers = [], imageUrl } = req.body;

		// Prepare update data
		const updateData = {
			name: name as string,
			addMembers: addMembers as string[],
			removeMembers: removeMembers as string[],
			imageUrl: imageUrl as string
		};

		try {
			const updatedConversation = await conversationsService.updateConversation(
				conversationId,
				updateData,
				currentUser
			);
			return res.json(updatedConversation);
		} catch (error: any) {
			return res.status(404).json({ error: error.message });
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

// Get messages for a conversation with pagination
router.get('/:conversationId/messages', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const { conversationId } = req.params;
		
		// Parse limit from query, default to 30
		const limit = parseInt(req.query.limit as string) || 30;
		// Cursor is expected to be an ISO timestamp string
		const cursor = req.query.cursor as string | undefined;

		try {
			const messagesPage = await conversationsService.getMessagesForConversation(
				conversationId,
				currentUser,
				{ limit, cursor }
			);
			
			console.log(`Returning messages page structure: ${Object.keys(messagesPage).join(',')}`);
			
			return res.json(messagesPage);
		} catch (error: any) {
			return res.status(403).json({ error: error.message });
		}
	} catch (error: any) {
		console.error(`Error fetching messages for conversation ${req.params.conversationId}:`, error);
		return res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
	}
});

// post new message
router.post('/:conversationId/messages', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const currentUser = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

		const { conversationId } = req.params;
		const { body: message, image } = req.body;

		try {
			const newMessage = await conversationsService.createMessage(
				conversationId,
				{ body: message, image },
				currentUser
			);
			return res.status(201).json(newMessage);
		} catch (error: any) {
			return res.status(403).json({ error: error.message });
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

export default router;
