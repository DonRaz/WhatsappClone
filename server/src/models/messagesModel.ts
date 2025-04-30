import prisma from '../configs/db';
import { Prisma } from '@prisma/client';
// import { MessageData } from '../../../shared';
import { MessageData } from '@sraz-sw/fullstack-shared';
// Define our input types based on what the model needs
interface CreateMessageInput {
  body?: string;
  image?: string;
  conversationId: string;
  senderId: string;
  currentUserId?: string;
}

// Adapter to convert Prisma data to our MessageData shared type
const ToMessageData = (message: any): MessageData => {
  return {
    id: message.id,
    body: message.body || undefined,
    image: message.image || undefined,
    senderId: message.senderId,
    createdAt: message.createdAt,
    conversationId: message.conversationId,
    usersSeen: message.seen?.map((user: any) => user.id) || []
  };
};

const MessageModel = {
  findAll: async (options: Prisma.MessageWhereInput = {}): Promise<MessageData[]> => {
    const messages = await prisma.message.findMany({
      where: options,
      include: {
        seen: true,
        sender: true
      }
    });
    
    return messages.map(ToMessageData);
  },

  findById: async (id: string): Promise<MessageData | null> => {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        seen: true,
        sender: true
      }
    });
    
    if (!message) return null;
    return ToMessageData(message);
  },

  create: async (data: CreateMessageInput): Promise<MessageData> => {
    const message = await prisma.message.create({
      include: {
        seen: true,
        sender: true
      },
      data: {
        body: data.body,
        image: data.image,
        conversation: {
          connect: { id: data.conversationId }
        },
        sender: {
          connect: { id: data.senderId }
        },
        seen: {
          connect: {
            id: data.currentUserId || data.senderId
          }
        },
      }
    });
    
    return ToMessageData(message);
  },

  update: async (id: string, data: Partial<MessageData>): Promise<MessageData> => {    
    try {
      // Filter out fields that aren't directly updatable
      const { usersSeen, ...updateData } = data;
      
      const message = await prisma.message.update({
        where: { id },
        data: updateData as Prisma.MessageUpdateInput,
        include: {
          seen: true,
          sender: true
        }
      });
      
      return ToMessageData(message);
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<MessageData> => {
    const message = await prisma.message.delete({
      where: { id },
      include: {
        seen: true,
        sender: true
      }
    });
    
    return ToMessageData(message);
  },
};

export default MessageModel; 