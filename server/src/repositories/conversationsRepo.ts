import conversationModel from '../models/conversationsModel';
import { ConversationData, UserData, MessageData } from '@sraz-sw/fullstack-shared';
import * as QueryString from 'qs';

const conversationsRepo = {
  getAllConversations: (query: QueryString.ParsedQs, isIncludingMessages: boolean = true, currentUser: UserData, numOfLastMessagesInEachConversation: number = 20): Promise<ConversationData[]> => {
    return conversationModel.findAll(query, isIncludingMessages, currentUser, numOfLastMessagesInEachConversation);
  },

  getConversationById: (id: string, currentUser: UserData): Promise<ConversationData | null> => {
    return conversationModel.findById(id, currentUser);
  },

  getConversationsByEmail: (email: string): Promise<ConversationData[] | null> => {
    return conversationModel.findByEmail(email);
  },

  findConversationBetweenUsers: (userIds: string[]): Promise<ConversationData[]> => {
    return conversationModel.findConversationBetweenUsers(userIds);
  },

  createGroupConversation: (data: { name: string, isGroup: boolean, userIds: string[] }): Promise<ConversationData> => {
    return conversationModel.createGroupConversation(data);
  },

  createOneOnOneConversation: (userId1: string, userId2: string): Promise<ConversationData> => {
    return conversationModel.createOneOnOneConversation(userId1, userId2);
  },

  updateConversation: (id: string, updates: { name?: string, addMembers?: string[], removeMembers?: string[], imageUrl?: string }): Promise<ConversationData> => {
    return conversationModel.updateConversation(id, updates);
  },

  deleteConversation: (id: string): Promise<ConversationData> => {
    return conversationModel.delete(id);
  },

  getMessagesForConversation: (conversationId: string, options: { limit: number, cursor?: string }): Promise<{ data: MessageData[], nextPageCursor: string | null }> => {
    return conversationModel.findMessages(conversationId, options);
  },

  createMessage: (conversationId: string, data: { body?: string, image?: string, senderId: string, seenIds: string[] }): Promise<MessageData> => {
    return conversationModel.createMessage(conversationId, data);
  },

  updateConversationLastMessage: (conversationId: string, messageId: string): Promise<ConversationData> => {
    return conversationModel.updateLastMessage(conversationId, messageId);
  },

  getConversationWithUsers: (conversationId: string): Promise<ConversationData | null> => {
    return conversationModel.findWithUsers(conversationId);
  }
};

export default conversationsRepo; 