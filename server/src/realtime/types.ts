import { RealtimeEventType } from "@sraz-sw/fullstack-shared/realtime";

export interface RealtimeProvider {
  trigger: (channel: string, event: RealtimeEventType, data: any) => Promise<void>;
  subscribe: (channel: string, callback: (data: any) => void) => void;
  unsubscribe: (channel: string, callback: (data: any) => void) => void;
  readonly EVENT_TYPES: typeof RealtimeEventType;
}

export { RealtimeEventType };

// export interface RealtimeProvider {
//   // Server-side methods
//   trigger(channel: string, event: string, data: any): Promise<void>;
//   authorizeChannel(socketId: string, channel: string, data?: any): any;

//   // Client-side methods
//   subscribe(channel: string): Channel;
//   unsubscribe(channel: string): void;
//   bind(event: string, callback: (data: any) => void): void;
//   unbind(event: string, callback: (data: any) => void): void;
// }

// // Additional types needed
// export interface Channel {
//   bind(event: string, callback: (data: any) => void): void;
//   unbind(event: string, callback: (data: any) => void): void;
// }

// export interface Members {
//   each(callback: (member: Record<string, any>) => void): void;
// }
// ____________ Real time updates ____________ START

// export enum RealtimeEventType {
//   CONVERSATION_UPDATE = 'conversation:update',
//   CONVERSATION_DELETE = 'conversation:new',
//   CONVERSATION_REMOVE = 'conversation:remove',
//   MESSAGE_UPDATE = 'message:update',
// }

// export interface RealtimeProvider {
//   trigger: (channel: string, event: RealtimeEventType, data: any) => void;
//   subscribe: (channel: string, callback: (data: any) => void) => void;
//   unsubscribe: (channel: string, callback: (data: any) => void) => void;
//   readonly EVENT_TYPES: typeof RealtimeEventType;
// }

// // import { Server as SocketIOServer } from 'socket.io';

// export class SocketIOProvider implements RealtimeProvider {
//   private io: SocketIOServer;
//   readonly EVENT_TYPES = RealtimeEventType;

//   constructor(server: any) {
//     this.io = new SocketIOServer(server);
//   }

//   async trigger(channel: string, event: RealtimeEventType, data: any): Promise<void> {
//     this.io.to(channel).emit(event, data);
//   }

//   subscribe(channel: string): void {
//     // Implement socket.io room joining logic if needed
//   }

//   unsubscribe(channel: string): void {
//     // Implement socket.io room leaving logic if needed
//   }
// }

// // __________ Real time updates with Pusher __________ 
// // import Pusher from 'pusher';

// export class PusherProvider implements RealtimeProvider {
//   private pusher: Pusher;
//   readonly EVENT_TYPES = RealtimeEventType;

//   constructor(config: {
//     appId: string;
//     key: string;
//     secret: string;
//     cluster: string;
//   }) {
//     this.pusher = new Pusher(config);
//   }

//   async trigger(channel: string, event: RealtimeEventType, data: any): Promise<void> {
//     await this.pusher.trigger(channel, event, data);
//   }

//   subscribe(channel: string): void {
//     // Implement if needed for server-side
//   }

//   unsubscribe(channel: string): void {
//     // Implement if needed for server-side
//   }
// }

// ___________ Usage guidelines:  _____________ 
/*
import { RealtimeProvider } from './RealtimeProvider';
import { PusherProvider } from './PusherProvider';
import { SocketIOProvider } from './SocketIOProvider';

let realtimeProvider: RealtimeProvider;

export function initializeRealtimeProvider(type: 'pusher' | 'socketio', config: any) {
  switch (type) {
    case 'pusher':
      realtimeProvider = new PusherProvider(config);
      break;
    case 'socketio':
      realtimeProvider = new SocketIOProvider(config);
      break;
    default:
      throw new Error('Invalid provider type');
  }
}

export function getRealtimeProvider(): RealtimeProvider {
  if (!realtimeProvider) {
    throw new Error('Realtime provider not initialized');
  }
  return realtimeProvider;
}

//  triggering :
// ... existing code ...
import { getRealtimeProvider } from '@/app/libs/realtime/realtimeConfig';

// ... existing code ...

    existingConversation.users.forEach((user) => {
      if (user.email) {
        getRealtimeProvider().trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

*/



// ____________ Real time updates ____________ END