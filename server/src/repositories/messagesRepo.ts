import messageModel from '../models/messagesModel';
// import { MessageData } from '../../../shared';
import { MessageData } from '@sraz-sw/fullstack-shared';

// Message filter type for querying
interface MessageFilters {
  senderId?: string;
  conversationId?: string;
  [key: string]: any;
}

// Input for creating a new message
interface CreateMessageInput {
  body?: string;
  image?: string;
  conversationId: string;
  senderId: string;
  currentUserId?: string;
}

const messagesRepo = {
  getAllMessages: (filters: MessageFilters = {}): Promise<MessageData[]> => {
    return messageModel.findAll(filters);
  },

  getMessageById: (id: string): Promise<MessageData | null> => {
    return messageModel.findById(id);
  },

  createMessage: (messageData: CreateMessageInput): Promise<MessageData> => {
    return messageModel.create(messageData);
  },

  updateMessage: (id: string, messageData: Partial<MessageData>): Promise<MessageData> => {  
    return messageModel.update(id, messageData);
  },

  deleteMessage: (id: string): Promise<MessageData> => {
    return messageModel.delete(id);
  },
};

export default messagesRepo; 