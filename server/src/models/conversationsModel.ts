import prisma from '../configs/db';
import { Prisma } from '@prisma/client';
import { ConversationData, FullConversationType, UserData, MessageData } from '@sraz-sw/fullstack-shared';
import { toConversationData, toMessagesPageResponse, toMessageData } from '../services/typesConverter';
// import { toPrismaConversation, toConversationData } from '../services/typesConverter';




const ConversationModel = {
  findAll: async (options: any = {}, isIncludingMessages: boolean = true, currentUser: UserData, numOfLastMessagesInEachConversation: number = 20): Promise<ConversationData[]> => {

		const conversationsQuery: Prisma.ConversationFindManyArgs = {
			orderBy: {
				lastMessageAt: 'desc',
			},
			where: {
				userIds: {
					has: currentUser.id,
				},
			},
			include: {
				users: true,
			},
		};

		// Conditionally include messages based on the flag
		if (isIncludingMessages) {
			conversationsQuery.include = {
				...conversationsQuery.include,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
					orderBy: {
						createdAt: 'desc'
					},
					// Only apply the limit if it's a positive number
					...(numOfLastMessagesInEachConversation > 0 && {
						take: numOfLastMessagesInEachConversation
					})
				},
			};
		}

		const conversations = await prisma.conversation.findMany(conversationsQuery);

		const fullConversations: FullConversationType[] = conversations.map(toConversationData);
    return fullConversations
  },

  findById: async (id: string, currentUser: UserData): Promise<ConversationData | null> => {
		const conversation = await prisma.conversation.findUnique({
			where: {
				id: id
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		});
    return conversation ? toConversationData(conversation) : null;
  },

  findWithUsers: async (id: string): Promise<ConversationData | null> => {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: id
      },
      include: {
        users: true,
      },
    });
    return conversation ? toConversationData(conversation) : null;
  },

  findByEmail: async (email: string): Promise<ConversationData[] | null> => {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            email: email
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    
    // Return the first conversation if found, otherwise null
    const fullConversations: FullConversationType[] = conversations.map(toConversationData);
    return fullConversations.length > 0 ? fullConversations : null;
  },

  findConversationBetweenUsers: async (userIds: string[]): Promise<ConversationData[]> => {
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [userIds[0], userIds[1]],
            },
          },
          {
            userIds: {
              equals: [userIds[1], userIds[0]],
            },
          },
        ],
        isGroup: false
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return existingConversations.map(toConversationData);
  },

  createGroupConversation: async (data: { name: string, isGroup: boolean, userIds: string[] }): Promise<ConversationData> => {
    const newConversation = await prisma.conversation.create({
      data: {
        name: data.name,
        isGroup: data.isGroup,
        users: {
          connect: data.userIds.map(userId => ({ id: userId }))
        }
      },
      include: {
        users: true,
      }
    });

    return toConversationData(newConversation);
  },

  createOneOnOneConversation: async (userId1: string, userId2: string): Promise<ConversationData> => {
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: userId1 },
            { id: userId2 }
          ]
        }
      },
      include: {
        users: true
      }
    });

    return toConversationData(newConversation);
  },

  updateConversation: async (id: string, updates: { name?: string, addMembers?: string[], removeMembers?: string[], imageUrl?: string }): Promise<ConversationData> => {
    const updateData: Prisma.ConversationUpdateInput = {};
    
    // Add basic fields if they exist
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
    
    // Handle user connections/disconnections
    if ((updates.addMembers && updates.addMembers.length > 0) || (updates.removeMembers && updates.removeMembers.length > 0)) {
      updateData.users = {};
      
      if (updates.addMembers && updates.addMembers.length > 0) {
        updateData.users.connect = updates.addMembers.map(id => ({ id }));
      }
      
      if (updates.removeMembers && updates.removeMembers.length > 0) {
        updateData.users.disconnect = updates.removeMembers.map(id => ({ id }));
      }
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: updateData,
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return toConversationData(updatedConversation);
  },

  delete: async (id: string): Promise<ConversationData> => {
    const conversation = await prisma.conversation.delete({
      where: { id },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    
    return toConversationData(conversation);
  },

  findMessages: async (conversationId: string, options: { limit: number, cursor?: string }): Promise<{ data: MessageData[], nextPageCursor: string | null }> => {
    const MESSAGES_PER_PAGE = options.limit || 30;
    
    // Prisma query options
    const queryOptions: Prisma.MessageFindManyArgs = {
      take: MESSAGES_PER_PAGE,
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // If a cursor is provided, fetch messages older than the cursor
    if (options.cursor) {
      queryOptions.where = {
        ...queryOptions.where,
        createdAt: {
          lt: new Date(options.cursor),
        },
      };
    }

    const messages = await prisma.message.findMany(queryOptions);

    // Determine the cursor for the next page
    let nextPageCursor: string | null = null;
    if (messages.length === MESSAGES_PER_PAGE) {
      nextPageCursor = messages[MESSAGES_PER_PAGE - 1].createdAt.toISOString();
    }

    // Use the shared toMessagesPageResponse function for consistent formatting
    return toMessagesPageResponse(messages, nextPageCursor);
  },

  createMessage: async (conversationId: string, data: { body?: string, image?: string, senderId: string, seenIds: string[] }): Promise<MessageData> => {
    const newMessage = await prisma.message.create({
      data: {
        body: data.body,
        image: data.image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: data.senderId },
        },
        seen: {
          connect: data.seenIds.map(id => ({ id })),
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    return toMessageData(newMessage);
  },

  updateLastMessage: async (conversationId: string, messageId: string): Promise<ConversationData> => {
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: messageId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return toConversationData(updatedConversation);
  },
};

export default ConversationModel; 