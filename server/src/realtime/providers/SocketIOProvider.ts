// FILE _________ SocketIOProvider.ts ___ realtime provider for socket.io _____

import { Server as SocketIOServer } from 'socket.io';
import { RealtimeEventType, RealtimeProvider } from '../types';

export class SocketIOProvider implements RealtimeProvider {
  private io: SocketIOServer;
  readonly EVENT_TYPES = RealtimeEventType;

  constructor(server: any) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://whatsapp-clone-client-xi.vercel.app'
        ];
        
    console.log('Socket.IO allowed origins:', allowedOrigins);
        
    // this.io = new SocketIOServer(server, {
    //   cors: {
    //     origin: (origin, callback) => {
    //       if (!origin) return callback(null, true);
    //       if (allowedOrigins.includes(origin)) {
    //         return callback(null, true);
    //       }
    //       console.warn(`Socket.IO: Origin ${origin} not allowed by CORS`);
    //       return callback(new Error('Not allowed by CORS'));
    //     },
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //     credentials: true
    //   },
    //   allowEIO3: true,
    //   transports: ['websocket', 'polling']
    // });

    this.io = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          console.warn(`Socket.IO: Origin ${origin} not allowed by CORS`);
          return callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        // Add explicit allowedHeaders to match your Express CORS setup
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-access-token']
      },
      allowEIO3: true,
      transports: ['websocket', 'polling']
    });
    
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join-channel', (channel: string) => {
        socket.join(channel);
        console.log(`Socket ${socket.id} joined channel: ${channel}, timestamp: ${Date.now()}`);
      });
      
      socket.on('leave-channel', (channel: string) => {
        socket.leave(channel);
        console.log(`Socket ${socket.id} left channel: ${channel}, timestamp: ${Date.now()}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  async trigger(channel: string, event: RealtimeEventType, data: any): Promise<void> {
    this.io.to(channel).emit(event, data);
  }

  subscribe(channel: string, callback: (data: any) => void): void {
    // This is called on the server side, but socket.io handles subscriptions client-side
    // Left empty intentionally as the server doesn't subscribe to events
  }

  unsubscribe(channel: string, callback: (data: any) => void): void {
    // This is called on the server side, but socket.io handles unsubscriptions client-side
    // Left empty intentionally as the server doesn't unsubscribe from events
  }
} 