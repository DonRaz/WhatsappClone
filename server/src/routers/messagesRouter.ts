import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { RequestWithUser } from '../types';
import { z } from 'zod';
import usersService from '../services/usersService';
import { UserData } from '@sraz-sw/fullstack-shared';
import { createNewConversationSchema } from '@sraz-sw/fullstack-shared';
import * as QueryString from 'qs';
import { getRealtimeProvider, RealtimeEventType } from '../realtime';

// Entry point http://localhost:3010/messages
const router = express.Router();

const prisma = new PrismaClient();

/** POST /api/messages/seen
  Description: Marks messages within a conversation as seen by the current user. (Could potentially be a single latest message ID).
  Request Body: { conversationId: "conv_id", messageId?: "last_message_id_seen" } (or messageIds: ["id1", "id2"])
  Real-time: Emits message:seen via Socket.IO to the conversation room.
 */
router.post('/seen', authenticateToken, async (req: RequestWithUser, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		const currentUser: UserData | null = await usersService.getUserById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ error: 'User not found - please relogin' });
		}

    const { conversationId, messageIds } = req.body;
    console.log('inputs', { conversationId, messageIds });
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    // TODO: Later decide if we want to update messageIds (to be able to update multiple messages) or just the last one
    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    // TODO: convert to Socket.IO
    // Get the realtime provider
    const realtimeProvider = getRealtimeProvider();
    
    // Notify all users in the conversation about the message update
    if (conversation.id) {
      await realtimeProvider.trigger(
        conversation.id, 
        RealtimeEventType.MESSAGE_UPDATE, 
        updatedMessage
      );
    }
    
    // Also notify the current user's other devices
    await realtimeProvider.trigger(
      currentUser.email!,
      RealtimeEventType.CONVERSATION_UPDATE,
      {
        id: conversationId,
        messages: [updatedMessage]
      }
    );

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return res.json(conversation);
    }

    return res.json('Success');
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

// Get all messages for a conversation
router.get('/:conversationId', (req: Request, res: Response) => {
  // Implementation for fetching messages
  // This would typically query the database
  res.json({ messages: [] });
});

// // Send a new message see conversationsRouter.ts post /:conversationId/messages
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     const { text, conversationId, senderEmail, receiverEmail } = req.body;
    
//     if (!text || !senderEmail || !receiverEmail) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
    
//     // In a real app, we would:
//     // 1. Validate the data
//     // 2. Save to database
//     // 3. Get the saved message with its ID
    
//     // Create a message object (this would come from the DB in a real app)
//     const message = {
//       id: `msg-${Date.now()}`,
//       text,
//       conversationId: conversationId || 'default',
//       sender: senderEmail,
//       timestamp: Date.now(),
//     };
    
//     // Get the realtime provider and send the message update
//     const realtimeProvider = getRealtimeProvider();
    
//     // Trigger realtime updates to both sender and receiver
//     // In a real app, you would send to the specific conversation channel
//     // that both users are subscribed to
//     await realtimeProvider.trigger(receiverEmail, RealtimeEventType.MESSAGE_UPDATE, message);
    
//     // Also trigger an update for the sender (for multiple devices)
//     if (senderEmail !== receiverEmail) {
//       await realtimeProvider.trigger(senderEmail, RealtimeEventType.MESSAGE_UPDATE, message);
//     }
    
//     res.status(201).json({ success: true, message });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// });

// Simulate receiving a message (for testing)
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const { text, sender, recipientEmail } = req.body;
    
    if (!text || !sender || !recipientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Simulating message:', { text, sender, recipientEmail });
    
    // Create a simulated message
    const message = {
      id: `sim-${Date.now()}`,
      text,
      body: text, // Include both text and body for compatibility
      conversationId: 'simulated',
      sender,
      senderId: sender, // Include for compatibility
      timestamp: Date.now(),
      createdAt: new Date()
    };
    
    // Get the realtime provider and send the message update
    const realtimeProvider = getRealtimeProvider();
    
    try {
      console.log(`Triggering simulated message to recipient: ${recipientEmail}`);
      await realtimeProvider.trigger(recipientEmail, RealtimeEventType.MESSAGE_UPDATE, message);
      console.log(`Successfully sent simulated message to ${recipientEmail}`);
      
      // Also send to a test conversation channel for debugging
      const testConvChannel = `conversation:simulated`;
      console.log(`Also triggering on test conversation channel: ${testConvChannel}`);
      await realtimeProvider.trigger(testConvChannel, RealtimeEventType.MESSAGE_UPDATE, message);
    } catch (err) {
      console.error('Error sending simulated message via realtime provider:', err);
      // Continue to return success even if realtime failed, so we can diagnose
    }
    
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Error simulating message:', error);
    res.status(500).json({ error: 'Failed to send simulated message' });
  }
});

export default router;


// router.get('/', authenticateToken, async (req: RequestWithUser, res: Response) => {
// 	try {
// 		if (!req.userId) {
// 			return res.status(401).json({ error: 'Unauthorized' });
// 		}
//     // ?cursor=<message_id> (for cursor-based pagination) 
//     const query: QueryString.ParsedQs = req.query; // filters etc

// 		const currentUser: UserData | null = await usersService.getUserById(req.userId);
// 		if (!currentUser) {
// 			return res.status(404).json({ error: 'User not found - please relogin' });
// 		}

    

// 	} catch (error: any) {
// 		return res.status(500).json({ error: error.message });
// 	}
// });