import { z } from "zod";

// Base schemas that can be reused
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(4, "Name must be at least 4 characters").max(20, "Name must be between 4 and 20 characters"),
  email: z.string().email('Invalid email format').optional(),
  image: z.string().optional(),
  hashedPassword: z.string().optional(), // only for server 
  password: z.string().optional(), // only for registration.
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isOnline: z.boolean().optional(),
  // query user's updated conversations by conversationIds
  conversationIds: z.array(z.string()).optional(),
  seenMessagesIds: z.array(z.string()).optional(),
  blockedUserIds: z.array(z.string()).optional(),
  accounts: z.array(z.string()).optional(), //?.
  token: z.string().optional(),
  // Adding for future usage.
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  body: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date(),
  usersSeenIds: z.array(z.string()).optional(),
  usersSeen: z.array(z.lazy(() => userSchema)).optional(),
  conversationId: z.string().optional(),
  // conversation: conversationSchema.optional(), // can't hold an entire conversation object here
  senderId: z.string(),
  sender: z.lazy(() => userSchema).optional(), 
  status: z.enum(['pending', 'sent', 'delivered', 'read', 'failed']).optional(),
});

export const conversationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  lastMessageAt: z.date(),
  name: z.string().optional(),
  isGroup: z.boolean().optional(),
  messagesIds: z.array(z.string()).optional(),
  messages: z.array(z.lazy(() => messageSchema)).optional(),
  userIds: z.array(z.string()).optional(),
  users: z.array(z.lazy(() => userSchema)).optional(),
  unreadMessagesCountByCurrentUser: z.number().optional(),
  
  imageUrl: z.string().optional(),
  currentlyOnlineUsers: z.array(z.string()).optional(),
  currentlyTypingUsers: z.array(z.string()).optional(),

});


export const createUserViaEmailSchema = userSchema
  .pick({ email: true, password: true, name: true })
  .required();

export const loginWithEmailSchema = userSchema
  .pick({ email: true, password: true })
  .required();


export const createNewConversationSchema = conversationSchema
  .pick({isGroup: true, userIds: true, name: true })
  .required();


// ____________________ Types for full messages and conversations ____________________ Start
// https://youtu.be/PGPGcKBpAk8?si=-JBk0fThj_pAncUk&t=13248
export const fullMessageSchema = messageSchema.extend({
  sender: userSchema,
  seen: z.array(userSchema),
});


export const fullConversationSchema = conversationSchema.extend({
  users: z.array(userSchema),
  messages: z.array(fullMessageSchema),
});

// export Typescript types
export type FullMessageType = z.infer<typeof fullMessageSchema>;
export type FullConversationType = z.infer<typeof fullConversationSchema>;
// ____________________ Types for full messages and conversations ____________________ End




// Type exports
export type UserData = z.infer<typeof userSchema>;
export type CreateUserDataViaEmail = z.infer<typeof createUserViaEmailSchema>;
export type LoginWithEmailData = z.infer<typeof loginWithEmailSchema>;

export type MessageData = z.infer<typeof messageSchema>;

export type ConversationData = z.infer<typeof conversationSchema>; 
export type CreateNewConversationData = z.infer<typeof createNewConversationSchema>;

  /** NOTE - When updating these types we must publish the NPM package to use it in the server & clients 
    cd FullstackFinalProject/shared
    npm run build
    npm version patch && npm publish
    cd FullstackFinalProject/client/chat-whatsapp-clone
    bun i @sraz-sw/fullstack-shared
    cd FullstackFinalProject/server
    npm i @sraz-sw/fullstack-shared
   */
  
  