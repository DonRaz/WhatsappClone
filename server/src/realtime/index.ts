import { RealtimeEventType, RealtimeProvider } from './types';
import { PusherProvider } from './providers/PusherProvider';
import { SocketIOProvider } from './providers/SocketIOProvider';

let realtimeProvider: RealtimeProvider;

type ProviderType = 'pusher' | 'socketio';

/**
 * Initialize the realtime provider with the specified configuration
 */
export function initializeRealtimeProvider(
  type: ProviderType, 
  config: any
): RealtimeProvider {
  switch (type) {
    case 'pusher':
      realtimeProvider = new PusherProvider(config);
      break;
    case 'socketio':
      realtimeProvider = new SocketIOProvider(config);
      break;
    default:
      throw new Error(`Invalid provider type: ${type}`);
  }
  return realtimeProvider;
}

/**
 * Get the initialized realtime provider instance
 */
export function getRealtimeProvider(): RealtimeProvider {
  if (!realtimeProvider) {
    throw new Error('Realtime provider not initialized. Call initializeRealtimeProvider first.');
  }
  return realtimeProvider;
}

export { RealtimeEventType, RealtimeProvider }; 