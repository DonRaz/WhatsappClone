import { FullConversationType, UserData, MessageData } from '@sraz-sw/fullstack-shared';
import { Prisma } from '@prisma/client';


// Convert Prisma types to our shared types ________________ START
// Convert Prisma User to our shared UserData type 
export const toUserData = (user: any): UserData => {
	return {
		id: user.id,
		name: user.name || 'Unknown User',
		email: user.email || undefined,
		image: user.image || undefined,
		hashedPassword: user.hashedPassword || undefined,
        password: user.password || undefined,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		isOnline: false,
		conversationIds: user.conversationIds || [],
		seenMessagesIds: user.seenMessageIds || [],
        accounts: user.accounts || [],
		blockedUserIds: user.blockedUserIds || [],
		
	};
};

// Convert Prisma Message to our shared MessageData type
export const toMessageData = (message: any): MessageData => {
	return {
		id: message.id,
		body: message.body || undefined,
		image: message.image || undefined,
		createdAt: message.createdAt,
		senderId: message.senderId,
		conversationId: message.conversationId,
		usersSeenIds: message.seen?.map((user: any) => user.id) || [],
		usersSeen: message.seen?.map(toUserData) || [],
		sender: toUserData(message.sender)
	};
};

// Convert Prisma Conversation to our shared FullConversationType
export const toConversationData = (conversation: any): FullConversationType => {
	return {
		id: conversation.id,
		createdAt: conversation.createdAt,
		lastMessageAt: conversation.lastMessageAt,
		name: conversation.name || undefined,
		isGroup: conversation.isGroup || false,
		messages: conversation.messages?.map(toMessageData) || [],
		users: conversation.users?.map(toUserData) || [],
		userIds: conversation.userIds || [],
		imageUrl: conversation.imageUrl || undefined,
		currentlyOnlineUsers: conversation.currentlyOnlineUsers || [],
		currentlyTypingUsers: conversation.currentlyTypingUsers || [],
		unreadMessagesCountByCurrentUser: conversation.unreadMessagesCountByCurrentUser || 0,
	};
};
// Convert Prisma types to our shared types ________________ END

// Convert our shared types to Prisma compatible input _________________ START
// Convert UserData to Prisma compatible input
export const toPrismaUser = (userData: Partial<UserData>): Prisma.UserCreateInput | Prisma.UserUpdateInput => {
    // Extract properties that aren't directly in Prisma schema or need special handling
    const { isOnline, password, accounts, seenMessagesIds, conversationIds, ...prismaCompatible } = userData;
  
    // Return only the properties that match the Prisma schema
    return {
      ...prismaCompatible,
      // Handle special cases and relationships
      ...(conversationIds?.length && { conversations: { connect: conversationIds.map(id => ({ id })) } }),
      ...(seenMessagesIds?.length && { seenMessages: { connect: seenMessagesIds.map(id => ({ id })) } }),
    };
  };
  
// Convert our shared types to Prisma compatible input _________________ END

// Convert a page of messages to the expected format
export interface MessagesPageResponse {
  data: MessageData[];
  nextPageCursor: string | null;
}

export const toMessagesPageResponse = (messages: any[], nextPageCursor: string | null): MessagesPageResponse => {
  return {
    data: messages.map(toMessageData),
    nextPageCursor
  };
};


