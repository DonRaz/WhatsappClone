'use client';

import * as React from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DeviceType = 'microphone' | 'camera';

interface DevicePermissionStatus {
  state: 'granted' | 'denied' | 'prompt' | 'unknown';
  isActive: boolean;
  timestamp: number;
}

interface DevicePermissionsProps {
  className?: string;
}

export const DevicePermissions = ({ className = '' }: DevicePermissionsProps) => {
  const [micPermission, setMicPermission] = React.useState<DevicePermissionStatus>({
    state: 'unknown',
    isActive: false,
    timestamp: Date.now()
  });
  
  const [cameraPermission, setCameraPermission] = React.useState<DevicePermissionStatus>({
    state: 'unknown',
    isActive: false,
    timestamp: Date.now()
  });

  const activeMediaStreamsRef = React.useRef<{
    mic: MediaStream | null,
    camera: MediaStream | null
  }>({
    mic: null,
    camera: null
  });

  // Check permissions on component mount
  React.useEffect(() => {
    checkPermissions();
    
    // Setup detection of active media devices by periodically checking
    const checkActiveInterval = setInterval(checkActiveDevices, 2000);
    
    return () => {
      clearInterval(checkActiveInterval);
      stopAllStreams();
    };
  }, []);
  
  // Stop all streams on component unmount
  const stopAllStreams = () => {
    if (activeMediaStreamsRef.current.mic) {
      activeMediaStreamsRef.current.mic.getTracks().forEach(track => track.stop());
      activeMediaStreamsRef.current.mic = null;
    }
    
    if (activeMediaStreamsRef.current.camera) {
      activeMediaStreamsRef.current.camera.getTracks().forEach(track => track.stop());
      activeMediaStreamsRef.current.camera = null;
    }
  };
  
  // Check if microphone or camera is currently active
  const checkActiveDevices = async () => {
    try {
      // This method is a bit of a hack but works in modern browsers
      // It detects if any tracks are currently active from getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        // Check for active input devices (microphones)
        const activeAudioInputs = devices.filter(
          device => device.kind === 'audioinput' && device.label
        );
        
        // Check for active video input devices (cameras)
        const activeVideoInputs = devices.filter(
          device => device.kind === 'videoinput' && device.label
        );
        
        // If we have non-empty labels for devices, it means permissions were granted
        // Next check the active streams to see if they're actually in use
        const micActive = activeAudioInputs.length > 0 && 
          !!navigator.mediaDevices.getUserMedia && 
          document.querySelector('audio[srcObject], video[srcObject]') !== null;
        
        const cameraActive = activeVideoInputs.length > 0 && 
          !!navigator.mediaDevices.getUserMedia &&
          document.querySelector('video[srcObject]') !== null;
        
        setMicPermission(prev => ({
          ...prev,
          isActive: micActive
        }));
        
        setCameraPermission(prev => ({
          ...prev, 
          isActive: cameraActive
        }));
      }
    } catch (err) {
      console.error('Error checking active devices:', err);
    }
  };

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      if (navigator.permissions) {
        const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(prev => ({
          ...prev,
          state: micResult.state as 'granted' | 'denied' | 'prompt',
          timestamp: Date.now()
        }));
        
        // Listen for permission changes
        micResult.onchange = () => {
          setMicPermission(prev => ({
            ...prev,
            state: micResult.state as 'granted' | 'denied' | 'prompt',
            timestamp: Date.now()
          }));
        };

        // Check camera permission
        const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(prev => ({
          ...prev,
          state: cameraResult.state as 'granted' | 'denied' | 'prompt',
          timestamp: Date.now()
        }));
        
        // Listen for permission changes
        cameraResult.onchange = () => {
          setCameraPermission(prev => ({
            ...prev,
            state: cameraResult.state as 'granted' | 'denied' | 'prompt',
            timestamp: Date.now()
          }));
        };
      } else {
        // Fallback for browsers without Permissions API
        // We'll just show unknown status
        console.log('Permissions API not available');
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      // Stop any existing stream
      if (activeMediaStreamsRef.current.mic) {
        activeMediaStreamsRef.current.mic.getTracks().forEach(track => track.stop());
      }
      
      // Request new permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeMediaStreamsRef.current.mic = stream;
      
      // Update permission state
      setMicPermission(prev => ({
        ...prev,
        state: 'granted',
        isActive: true,
        timestamp: Date.now()
      }));
      
      // Automatically stop the stream after a short delay
      // This is just to show the active state briefly
      setTimeout(() => {
        if (activeMediaStreamsRef.current.mic) {
          activeMediaStreamsRef.current.mic.getTracks().forEach(track => track.stop());
          activeMediaStreamsRef.current.mic = null;
          
          setMicPermission(prev => ({
            ...prev,
            isActive: false
          }));
        }
      }, 3000);
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      // We still need to check permissions as they may have changed
      checkPermissions();
    }
  };

  const requestCameraPermission = async () => {
    try {
      // Stop any existing stream
      if (activeMediaStreamsRef.current.camera) {
        activeMediaStreamsRef.current.camera.getTracks().forEach(track => track.stop());
      }
      
      // Request new permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      activeMediaStreamsRef.current.camera = stream;
      
      // Update permission state
      setCameraPermission(prev => ({
        ...prev,
        state: 'granted',
        isActive: true,
        timestamp: Date.now()
      }));
      
      // Automatically stop the stream after a short delay
      // This is just to show the active state briefly
      setTimeout(() => {
        if (activeMediaStreamsRef.current.camera) {
          activeMediaStreamsRef.current.camera.getTracks().forEach(track => track.stop());
          activeMediaStreamsRef.current.camera = null;
          
          setCameraPermission(prev => ({
            ...prev,
            isActive: false
          }));
        }
      }, 3000);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      // We still need to check permissions as they may have changed
      checkPermissions();
    }
  };

  const getPermissionColor = (state: string) => {
    switch (state) {
      case 'granted':
        return 'text-green-500';
      case 'denied':
        return 'text-red-500';
      case 'prompt':
        return 'text-amber-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPermissionIcon = (type: 'microphone' | 'camera', state: string, isActive: boolean) => {
    if (isActive) {
      return <Activity className="h-4 w-4 text-green-600 animate-pulse" />;
    }
    
    if (type === 'microphone') {
      return state === 'granted' ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />;
    } else {
      return state === 'granted' ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />;
    }
  };

  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-semibold mb-2">Device Permissions</h4>
      <div className="space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={requestMicrophonePermission} 
                className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPermissionIcon('microphone', micPermission.state, micPermission.isActive)}
                  <span className="text-sm">Microphone</span>
                  {micPermission.isActive && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                      Active
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${getPermissionColor(micPermission.state)}`}>
                  {micPermission.state === 'unknown' ? 'Unknown' : micPermission.state}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {micPermission.state === 'granted' 
                  ? 'Microphone permission granted' 
                  : 'Click to request microphone permission'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={requestCameraPermission} 
                className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPermissionIcon('camera', cameraPermission.state, cameraPermission.isActive)}
                  <span className="text-sm">Camera</span>
                  {cameraPermission.isActive && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                      Active
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${getPermissionColor(cameraPermission.state)}`}>
                  {cameraPermission.state === 'unknown' ? 'Unknown' : cameraPermission.state}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {cameraPermission.state === 'granted' 
                  ? 'Camera permission granted' 
                  : 'Click to request camera permission'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {(micPermission.state === 'denied' || cameraPermission.state === 'denied') && (
          <div className="text-xs flex items-start gap-1 mt-2 text-muted-foreground">
            <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>
              Some features require device permissions. Please check browser settings to enable.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicePermissions; 