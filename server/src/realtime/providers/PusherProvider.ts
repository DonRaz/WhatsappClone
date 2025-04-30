import Pusher from 'pusher';
import { RealtimeEventType, RealtimeProvider } from '../types';

export class PusherProvider implements RealtimeProvider {
  private pusher: Pusher;
  readonly EVENT_TYPES = RealtimeEventType;

  constructor(config: {
    appId: string;
    key: string;
    secret: string;
    cluster: string;
  }) {
    // Trim all credential values to remove any whitespace or newlines
    const trimmedConfig = {
      appId: config.appId.trim(),
      key: config.key.trim(),
      secret: config.secret.trim(),
      cluster: config.cluster.trim()
    };
    
    console.log('Initializing Pusher provider with config (trimmed):', {
      appId: trimmedConfig.appId,
      key: trimmedConfig.key,
      cluster: trimmedConfig.cluster,
    });
    
    this.pusher = new Pusher({
      appId: trimmedConfig.appId,
      key: trimmedConfig.key,
      secret: trimmedConfig.secret,
      cluster: trimmedConfig.cluster,
      useTLS: true
    });
  }

  // Helper method to sanitize channel names for Pusher
  private sanitizeChannelName(channel: string): string {
    // Pusher channels can only have characters, numbers, underscores and hyphens
    // and must be <= 164 characters
    // Replace any invalid chars, and prefix with 'presence-' or 'private-' if needed
    let sanitized = channel.replace(/[^A-Za-z0-9_\-=@,.;]/g, '-');
    
    // Special handling for conversation channels that use IDs
    if (channel.startsWith('conversation:')) {
      sanitized = 'conv-' + channel.split(':')[1];
    } else if (channel.includes('@')) {
      // If it's an email, encode it properly
      sanitized = 'user-' + channel.replace('@', '-at-');
    }
    
    console.log(`Pusher sanitized channel name: ${channel} -> ${sanitized}`);
    return sanitized;
  }

  async trigger(channel: string, event: RealtimeEventType, data: any): Promise<void> {
    const sanitizedChannel = this.sanitizeChannelName(channel);
    
    // Use the exact string value of the event enum member
    const eventName = event as string;
    
    console.log(`[PUSHER DEBUG] Triggering event details:`);
    console.log(`- Channel: "${sanitizedChannel}" (original: "${channel}")`);
    console.log(`- Event name: "${eventName}"`);
    console.log(`- Event type: ${typeof eventName}`);
    console.log(`- Has data: ${!!data}`);
    
    try {
      // Log connection details but avoid accessing the config directly
      console.log(`[PUSHER DEBUG] About to trigger Pusher event`);

      // Pass the event string name to Pusher
      await this.pusher.trigger(sanitizedChannel, eventName, data);
      console.log(`[PUSHER SUCCESS] Event "${eventName}" triggered on "${sanitizedChannel}"`);
    } catch (error) {
      console.error(`[PUSHER ERROR] Failed to trigger event "${eventName}" on "${sanitizedChannel}":`, error);
      throw error;
    }
  }

  subscribe(channel: string, callback: (data: any) => void): void {
    // Pusher subscriptions are handled client-side
    // Server doesn't subscribe to events
    console.log('Note: Pusher server does not handle subscriptions, this is a client-side operation');
  }

  unsubscribe(channel: string, callback: (data: any) => void): void {
    // Pusher unsubscriptions are handled client-side
    // Server doesn't unsubscribe from events
    console.log('Note: Pusher server does not handle unsubscriptions, this is a client-side operation');
  }
} 