import conversationsRepo from '../repositories/conversationsRepo';
import { ConversationData, UserData, MessageData } from '@sraz-sw/fullstack-shared';
import * as QueryString from 'qs';
import { getRealtimeProvider, RealtimeEventType } from '../realtime';
import prisma from '../configs/db';

const conversationsService = {
  getAllConversations: async (query: QueryString.ParsedQs, isIncludingMessages: boolean = true, currentUser: UserData, numOfLastMessagesInEachConversation: number = 20): Promise<ConversationData[]> => {
    return conversationsRepo.getAllConversations(query, isIncludingMessages, currentUser, numOfLastMessagesInEachConversation);
  },

  getConversationById: async (id: string, currentUser: UserData): Promise<ConversationData | null> => {
    return conversationsRepo.getConversationById(id, currentUser);
  },

  getConversationsByEmail: async (email: string): Promise<ConversationData[] | null> => {
    return conversationsRepo.getConversationsByEmail(email);
  },

  createConversation: async (isGroup: boolean, members: string[], name: string | undefined, currentUser: UserData): Promise<ConversationData> => {
    // For group conversations
    if (isGroup) {
      if (!members || members.length < 2 || !name) {
        throw new Error('Invalid data for group conversation');
      }

      // Create the conversation with all members including current user
      return conversationsRepo.createGroupConversation({
        name,
        isGroup: true,
        userIds: [...members, currentUser.id]
      });
    } 
    
    // For one-on-one conversations
    const otherUserId = members.find((id: string) => id !== currentUser.id);
    if (!otherUserId) {
      throw new Error('Invalid data for one-on-one conversation');
    }

    // Check for existing conversation between these users
    const existingConversations = await conversationsRepo.findConversationBetweenUsers([currentUser.id, otherUserId]);
    
    if (existingConversations.length > 0) {
      return existingConversations[0];
    }

    // Create new one-on-one conversation
    return conversationsRepo.createOneOnOneConversation(currentUser.id, otherUserId);
  },

  updateConversation: async (id: string, updates: { name?: string, addMembers?: string[], removeMembers?: string[], imageUrl?: string }, currentUser: UserData): Promise<ConversationData> => {
    // First verify the conversation exists and user is part of it
    const conversation = await conversationsRepo.getConversationById(id, currentUser);
    if (!conversation) {
      throw new Error('Conversation not found or you do not have permission to update it');
    }

    // Process the update
    return conversationsRepo.updateConversation(id, updates);
  },

  deleteConversation: async (id: string): Promise<ConversationData> => {
    return conversationsRepo.deleteConversation(id);
  },

  getMessagesForConversation: async (conversationId: string, currentUser: UserData, options: { limit: number, cursor?: string }): Promise<{ data: MessageData[], nextPageCursor: string | null }> => {
    // Verify user is part of the conversation
    if (!currentUser?.conversationIds?.includes(conversationId)) {
      throw new Error('Forbidden: You are not part of this conversation');
    }

    return conversationsRepo.getMessagesForConversation(conversationId, options);
  },

  createMessage: async (conversationId: string, data: { body?: string, image?: string }, currentUser: UserData): Promise<MessageData> => {
    // Verify user is part of the conversation
    if (!currentUser?.conversationIds?.includes(conversationId)) {
      throw new Error('You are not part of this conversation');
    }

    // Create the message
    const newMessage = await conversationsRepo.createMessage(conversationId, {
      body: data.body,
      image: data.image,
      senderId: currentUser.id,
      seenIds: [currentUser.id]
    });

    // Update the conversation's lastMessageAt
    await conversationsRepo.updateConversationLastMessage(conversationId, newMessage.id);

    // Send realtime notifications
    const realtimeProvider = getRealtimeProvider();
    
    // Notify conversation channel about new message
    await realtimeProvider.trigger(
      `conversation:${conversationId}`,
      RealtimeEventType.MESSAGE_UPDATE,
      newMessage
    );

    // Get all users in the conversation to notify them individually
    const conversation = await conversationsRepo.getConversationWithUsers(conversationId);
    
    if (conversation?.users) {
      // Notify each user about the conversation update
      for (const user of conversation.users) {
        if (user.email) {
          await realtimeProvider.trigger(
            user.email,
            RealtimeEventType.CONVERSATION_UPDATE,
            {
              id: conversationId,
              lastMessage: newMessage,
              lastMessageAt: new Date()
            }
          );
        }
      }
    }

    return newMessage;
  }
};

export default conversationsService; 