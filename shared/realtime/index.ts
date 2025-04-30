/**
 * Enum for real-time event types that can be used by both client and server
 */
export enum RealtimeEventType {
    CONVERSATION_UPDATE = 'conversation:update',
    CONVERSATION_NEW = 'conversation:new',
    CONVERSATION_REMOVE = 'conversation:remove',
    MESSAGE_UPDATE = 'message:update',

  }
  
  /**
   * Interface for real-time event payload structure
   */
  export interface RealtimeEventPayload<T = any> {
    eventType: RealtimeEventType;
    data: T;
    timestamp: number;
  }

  // 
  
  /** NOTE - When updating these types we must publish the NPM package to use it in the server & clients 
    cd FullstackFinalProject/shared
    npm run build
    npm version patch && npm publish
    
    cd FullstackFinalProject/client/chat-whatsapp-clone
    bun i @sraz-sw/fullstack-shared
    cd FullstackFinalProject/server
    npm i @sraz-sw/fullstack-shared
   */
  
  