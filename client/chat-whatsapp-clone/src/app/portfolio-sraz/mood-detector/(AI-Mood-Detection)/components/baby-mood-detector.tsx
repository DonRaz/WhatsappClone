'use client'
// FILES ___________ Baby-mood-detector.tsx ______________

import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Play, Pause, SkipForward, Volume2, Maximize, Minimize, Smile, Power } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import ReactPlayer from 'react-player';
import { useImagePrompt } from '../hooks/useAiDetectionOnImage'
import DJPlayer from './DjPlayer'
import debounce from 'lodash.debounce';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

type SongMood = {
  id: string
  title: string
  youtube: string
  spotify?: string
  appleMusic?: string
  youtubeMusic?: string
  moods: string[]
  soundcloud?: string;
  mixcloud?: string;
}

type MusicPlatform = 'youtube' | 'spotify' | 'appleMusic' | 'youtubeMusic' | 'soundcloud' | 'mixcloud';

const DETECTION_DELAY = 10000; // ms
export const songsHardCoded: SongMood[] = [
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', youtube: 'jNQXAC9IVRw', spotify: '', appleMusic: '', youtubeMusic: 'jNQXAC9IVRw', moods: ['😊 Happy', '😐 Neutral'] },
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', youtube: 'dQw4w9WgXcQ', spotify: '', appleMusic: '', youtubeMusic: 'dQw4w9WgXcQ', moods:   ['😊 Happy', '😢 Sad', '😐 Neutral'] },
  { id: 'jNQXAC9IVRw', youtube:'jNQXAC9IVRw', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Me at the zoo', moods: ['😊 Happy', '😐 Neutral'] },
  { id: 'dQw4w9WgXcQ', youtube:'dQw4w9WgXcQ', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Never Gonna Give You Up', moods: ['😊 Happy', '😐 Neutral'] },
  { id: 'kJQP7kiw5Fk', youtube:'kJQP7kiw5Fk', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Despacito', moods: ['😊 Happy', '😠 Angry'] },
  { id: 'JGwWNGJdvx8', youtube:'JGwWNGJdvx8', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Shape of You', moods: ['😊 Happy', '😐 Neutral'] },
  { id: 'OPf0YbXqDm0', youtube:'OPf0YbXqDm0', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Uptown Funk', moods: ['😊 Happy', '😠 Angry'] },
  { id: 'RgKAFK5djSk', youtube:'RgKAFK5djSk', spotify:'', appleMusic:'', youtubeMusic:'', title: 'See You Again', moods: ['😢 Sad', '😐 Neutral'] },
  { id: 'hT_nvWreIhg', youtube:'hT_nvWreIhg', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Counting Stars', moods: ['😊 Happy', '😐 Neutral', '😴 Sleepy'] },
  { id: 'YQHsXMglC9A', youtube:'YQHsXMglC9A', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Hello', moods: ['😢 Sad', '😐 Neutral'] },
  { id: 'fRh_vgS2dFE', youtube:'fRh_vgS2dFE', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Despacito (Lullaby Version)', moods: ['😊 Happy', '😢 Sad', '😴 Sleepy', '😠 Angry', '😐 Neutral'] },
  { id: 'JcdXKXY_qTA', youtube:'JcdXKXY_qTA', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Baby Shark Dance', moods: ['😊 Happy', '😐 Neutral', '😠 Angry'] }
  // ... Add the rest of the songs with proper formatting
];

const defaultPlaylist: SongMood[] = [
  { id: 'fRh_vgS2dFE', youtube:'fRh_vgS2dFE', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Despacito (Lullaby Version)', moods: ['😊 Happy', '😢 Sad', '😴 Sleepy', '😠 Angry', '😐 Neutral'] },
  { id: 'JcdXKXY_qTA', youtube:'JcdXKXY_qTA', spotify:'', appleMusic:'', youtubeMusic:'', title: 'Baby Shark Dance', moods: ['😊 Happy', '😐 Neutral', '😠 Angry'] }
]

// FILE __________________ ControlPanel.tsx ____________

interface ControlPanelProps {
  onManualMoodChange: (mood: string) => void;
  onDetectionDelayChange: (value: string) => void;
  detectionDelay: number;
  onSkipSong?: () => void;
}
export function ControlPanel({ onSkipSong, onManualMoodChange, onDetectionDelayChange, detectionDelay }: ControlPanelProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-4 ">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Set Mood Manually</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Set Mood Manually</SheetTitle>
                <SheetDescription>Choose a mood to update the current mood and play a matching song.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {['😊 Happy', '😢 Sad', '😴 Sleepy', '😠 Angry', '😐 Neutral'].map((mood) => (
                  <Button key={mood} onClick={() => onManualMoodChange(mood)}>{mood}</Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          {/* <Button onClick={onSkipSong} className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">
            Skip to Next Song
          </Button> */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Detection Delay:</span>
            <Select onValueChange={onDetectionDelayChange} defaultValue={detectionDelay.toString()}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select delay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 seconds</SelectItem>
                <SelectItem value="10">Every 10 seconds</SelectItem>
                <SelectItem value="60">Every 60 seconds</SelectItem>
                <SelectItem value="120">Every 120 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// FILE __________________ VideoContainer.tsx ____________

// import React from 'react';
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Power } from 'lucide-react'

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentMood: string;
  status: string;
  detectionsEnabled: boolean;
  // setDetectionsEnabled: (enabled: boolean) => void;
  toggleDetections: () => void;
}

export function VideoContainer({ videoRef, currentMood, status, detectionsEnabled, toggleDetections }: VideoContainerProps) {
  return (
    <Card className="w-full md:w-3/5">
      <CardContent className="p-4">
        <div className="relative aspect-video bg-muted-foreground/10 rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <Button
            onClick={() => toggleDetections()}
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4"
          >
            <Power className={`h-4 w-4 ${detectionsEnabled ? 'text-primary/90' : 'text-destructive'}`} />
          </Button>
        </div>
        <div className="text-center text-xl font-semibold mt-4">
          Current Mood: <span className="text-2xl">{currentMood}</span>
        </div>
        <div className="text-center font-bold mt-2 text-muted-foreground">{status}</div>
      </CardContent>
    </Card>
  );
}


// FILE __________________ MusicPlayer.tsx ____________
// import React, { useState, useRef, useCallback } from 'react';
// import ReactPlayer from 'react-player';
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Play, Pause, SkipForward, Volume2, Maximize, Minimize } from 'lucide-react';

// type MusicPlatform = 'youtube' | 'soundcloud' | 'mixcloud';


// import React, { useState, useEffect, useRef } from 'react';
// import ReactPlayer from 'react-player';
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Play, Pause, SkipForward, Volume2, Maximize, Minimize } from 'lucide-react';
// import { useCallback, useState, useEffect } from 'react';
// import debounce from 'lodash/debounce';
interface MusicPlayerProps {
  currentSong: SongMood | null;
  musicPlatform: MusicPlatform;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onNextSong: () => void;
  onVolumeChange: (volume: number) => void;
  onPlatformChange: (platform: MusicPlatform) => void;
}

export function MusicPlayer({
  currentSong,
  musicPlatform,
  isPlaying,
  volume: initialVolume,
  onPlayPause,
  onNextSong,
  onVolumeChange,
  onPlatformChange
}: MusicPlayerProps) {
  // Local state for volume
  const [localVolume, setLocalVolume] = useState(initialVolume * 100);

  // Debounced volume change handler
  const debouncedVolumeChange = useCallback(
    debounce((newValue: number) => {
      onVolumeChange(newValue / 100);
    }, 100),
    [onVolumeChange]
  );

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setLocalVolume(newVolume);
    debouncedVolumeChange(newVolume);
  }, [debouncedVolumeChange]);

  // Sync with external volume changes
  useEffect(() => {
    setLocalVolume(initialVolume * 100);
  }, [initialVolume]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getPlayerUrl = () => {
    if (!currentSong) return '';
    switch (musicPlatform) {
      case 'youtube':
        return `https://www.youtube.com/watch?v=${currentSong.youtube}`;
      case 'soundcloud':
        return currentSong.soundcloud || '';
      case 'mixcloud':
        return currentSong.mixcloud || '';
      default:
        return '';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-3xl mx-auto aspect-video bg-muted-foreground/10 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {currentSong && (
        <ReactPlayer
          ref={playerRef}
          url={getPlayerUrl()}
          playing={isPlaying}
          volume={localVolume}
          width="100%"
          height="100%"
          onEnded={onNextSong}
          onError={(e) => console.error('Player error:', e)}
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-background/80 bg-opacity-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Button onClick={onPlayPause} variant="outline" size="icon">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={onNextSong} variant="outline" size="icon" className="ml-2">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-primary-foreground" />
            <Slider
              value={[localVolume * 100]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={handleVolumeChange}
              />
          </div>
          <Select value={musicPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="soundcloud">SoundCloud</SelectItem>
              <SelectItem value="mixcloud">Mixcloud</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={toggleFullscreen} variant="outline" size="icon">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {currentSong && (
        <div className="absolute top-4 left-4 bg-background/80 bg-opacity-50 p-2 rounded">
          <p className="text-primary-foreground text-sm">Now Playing: {currentSong.title}</p>
        </div>
      )}
    </div>
  );
}

// FILE __________________ MoodLog.tsx ____________

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Smile } from 'lucide-react'

interface MoodLogEntry {
  mood: string;
  time: string;
  image: string | null;
}

interface MoodLogProps {
  moodLog: MoodLogEntry[];
}

export function MoodLog({ moodLog }: MoodLogProps) {
  return (
    <Card className="w-full md:w-2/5">
      <CardHeader>
        <CardTitle>Mood Log</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        <ul className="space-y-4 ">
          {moodLog.map((entry, index) => (
            <li key={index} className="bg-secondary p-2 rounded-md flex items-center">
              {entry.image ? (
                <img 
                  src={entry.image} 
                  alt={`Face for ${entry.mood}`} 
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-muted-foreground/20 rounded-full mr-4 flex items-center justify-center">
                  <Smile className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{entry.mood}</span>
                  <span className="text-sm text-muted-foreground">{entry.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function useFullscreen(ref: React.RefObject<HTMLDivElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && ref.current) {
      ref.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }, [ref])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return { isFullscreen, toggleFullscreen }
}

// FILE __________________ BabyMoodDetectorApp.tsx ____________


// import React, { useState, useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';
// import * as blazeface from '@tensorflow-models/blazeface';
// import { toast, Toaster } from 'sonner';
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
// import { Song, MusicPlatform, MoodLogEntry } from './types';
// import { useFullscreen } from './useFullscreen';
// import { songs } from './songs';
// import { MusicPlayer } from './MusicPlayer';
// import { VideoContainer } from './VideoContainer';
// import { MoodLog } from './MoodLog';
// import { ControlPanel } from './ControlPanel';

export function BabyMoodDetectorComponent() {
  const [loading, setLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState('');
  const [moodLog, setMoodLog] = useState<MoodLogEntry[]>([]);
  const [status, setStatus] = useState('Waiting...');
  const [detectionDelay, setDetectionDelay] = useState(DETECTION_DELAY); // _ DETECTION_DELAY __
  const [detectionsEnabled, setDetectionsEnabled] = useState(true);
  const [currentSong, setCurrentSong] = useState<SongMood | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastDetectedMood, setLastDetectedMood] = useState('')

  const [imageResolution, setImageResolution] = useState(-1); // -1 means keep original resolution
  const { sendImagePrompt, loading: apiLoading, error: apiError } = useImagePrompt();


  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    async function setupTensorFlow() {
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());
    }

    setupTensorFlow().then(() => init());

    return () => cleanup();
  }, []);

  useEffect(() => {
    setupDetectionInterval();
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [detectionDelay, detectionsEnabled]);

  const init = async () => {
    try {
      await setupCamera();
      setLoading(false);
      await loadModel();
      // Don't call detectionCycle immediately, let the interval handle it
      // detectionCycle();
    } catch (error) {
      console.error('Error initializing app:', error);
      setStatus('Error loading. Please refresh and try again.');
    }
  };

  const cleanup = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  const setupDetectionInterval = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (detectionsEnabled) {
      detectionIntervalRef.current = setInterval(detectionCycle, detectionDelay);
    }
  };

  const setupCamera = async () => {
    if (!videoRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    videoRef.current.srcObject = stream;
    return new Promise<void>((resolve) => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => resolve();
      }
    });
  };

  const loadModel = async () => {
    try {
      modelRef.current = await blazeface.load();
    } catch (error) {
      console.error('Error loading blazeface model:', error);
      setStatus('Error loading face detection model. Please refresh and try again.');
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !modelRef.current) return false;
    const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
    const faceDetected = predictions.length > 0;

    if (!faceDetected) {
      playNoFaceAlert();
    }
  
    if (faceDetected) {
      toast.success('Face detected!', {
        position: 'bottom-center',
        action: {
          label: 'Disable for 30min',
          onClick: () => disableDetections(),
        },
      });
    } else {
      toast.error('No face detected', {
        position: 'bottom-center',
        action: {
          label: 'Disable for 30min',
          onClick: () => disableDetections(),
        },
      });
    }

    return faceDetected;
  };



  const toggleDetections = () => {
    if (detectionsEnabled){
      disableDetections();   
    }
    else {
      enableDetectionNow()
    }
  }

  const enableDetectionNow = () =>{
    setDetectionsEnabled(true);
    setupCamera();     
  }
  const disableDetections = (minutes: number = 30) => {
    setDetectionsEnabled(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setTimeout(() => {
      enableDetectionNow()
    }, minutes * 60 * 1000); // 30 minutes
  };

  const playNoFaceAlert = () => {
    try{
      if (audioRef.current) {
        audioRef.current.play();
      }
    }catch(error){
      console.log('error in playNoFaceAlert = ', error)
    }
  };


  const showMoodAlert = (mood: string, moodScores: { [key: string]: number }) => {
    const formattedScores = Object.entries(moodScores)
      .map(([m, score]) => `${m}: ${(score * 100).toFixed(1)}%`)
      .join(', ');
    
    toast.success(
      <div>
        <p>Dominant mood: {mood}</p>
        <p className="text-sm mt-1">{formattedScores}</p>
      </div>,
      { duration: 5000, position: 'bottom-center' }
    );
  };

  
  const mockMoodDetectionAPI = async (faceData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const moods = ['😊 Happy', '😢 Sad', '😴 Sleepy', '😠 Angry', '😐 Neutral'];
    return moods[Math.floor(Math.random() * moods.length)];
  };


   const extractCoordinates = (tensor: [number, number] | tf.Tensor1D): [number, number] => {
    if (Array.isArray(tensor)) {
      return tensor;
    }
    // If it's a tensor, get its values synchronously
    return [tensor.dataSync()[0], tensor.dataSync()[1]];
  }; 

  const captureFaceImage = async (faceData: blazeface.NormalizedFace): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the entire video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Calculate face region with margin
    const [topLeftX, topLeftY] = extractCoordinates(faceData.topLeft);
    const [bottomRightX, bottomRightY] = extractCoordinates(faceData.bottomRight);
    
    const margin = 20;
    const x = Math.max(0, topLeftX - margin);
    const y = Math.max(0, topLeftY - margin);
    const width = Math.min(canvas.width - x, bottomRightX - topLeftX + 2 * margin);
    const height = Math.min(canvas.height - y, bottomRightY - topLeftY + 2 * margin);

    // Crop the face region
    const faceImageData = ctx.getImageData(x, y, width, height);
    
    // Create a new canvas for the cropped face
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = width;
    faceCanvas.height = height;
    const faceCtx = faceCanvas.getContext('2d');
    if (!faceCtx) return null;

    // Put the cropped face data on the new canvas
    faceCtx.putImageData(faceImageData, 0, 0);

    // Convert to base64
    const base64Image = faceCanvas.toDataURL('image/jpeg', 0.8);

    // For debugging: log image dimensions and first few bytes
    console.log(`Captured image dimensions: ${width}x${height}`);
    // console.log(`Image data (first 100 chars): ${base64Image.substring(0, 100)}`);
    console.log(`Image data  ${base64Image}`);

    return base64Image;
  };


  const detectionCycle = useCallback(async () => {
    if (!detectionsEnabled || isDetecting) return;

    try {
      setIsDetecting(true);
      // first making sure we found face (if not alerting user) via status
      const faceDetected = await detectFace();
      if (faceDetected) {
        await detectMood();
      }
      else {
        setStatus("Unable to see face...");  
      }

      setStatus("Waiting for next detection cycle...");
    } finally {
      setIsDetecting(false);
    }
  }, [detectionsEnabled, isDetecting]);

  useEffect(() => {
    const intervalId = setInterval(detectionCycle, detectionDelay)
    return () => clearInterval(intervalId)
  }, [detectionCycle, detectionDelay])



  const updateMoodLog = useCallback((mood: string, faceImage: string | null, isManual: boolean = false) => {
    // Check if this is the same as current mood and not a manual update
    if (mood === currentMood && !isManual) return;
    
    // Also check the most recent entry to prevent duplicates even if currentMood hasn't updated yet
    setMoodLog(prevLog => {
      // If the log has entries and the last entry has the same mood (and wasn't manual), don't add
      if (prevLog.length > 0 && prevLog[0].mood === mood && !isManual) {
        return prevLog;
      }
      
      // Otherwise add the new entry
      return [{
        mood,
        time: new Date().toLocaleTimeString(),
        image: faceImage
      }, ...prevLog.slice(0, 9)];
    });
    
    setCurrentMood(mood);
  }, [currentMood]);


  const handleManualMoodChange = (mood: string) => {
    updateMoodLog(mood, null, true);
  };


  const detectMood = useCallback(async () => {
    if (!detectionsEnabled || !videoRef.current || !modelRef.current) return;

    try {
      setStatus("Detecting mood...");
      const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
      
      if (predictions.length === 0) {
        setStatus("No face detected");
        return;
      }

      const faceImage = await captureFaceImage(predictions[0]);
      if (!faceImage) {
        setStatus("Couldn't capture face image");
        return;
      }

      const moodResult = await sendImagePrompt(faceImage);
      if (!moodResult || !moodResult.moods) {
        setStatus("Invalid mood detection result");
        toast.error("Failed to detect mood. Please try again.");
        return;
      }

      const dominantMood = Object.entries(moodResult.moods)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      updateMoodLog(dominantMood, faceImage, false);
      setStatus(`Mood detected: ${dominantMood}`);
      
      // Show mood scores as toast
      const formattedScores = Object.entries(moodResult.moods)
        .map(([m, score]) => `${m}: ${(score * 100).toFixed(1)}%`)
        .join(', ');
      
      toast.success(
        <div>
          <p>Dominant mood: {dominantMood}</p>
          <p className="text-sm mt-1">{formattedScores}</p>
        </div>
      );
      
    } catch (error) {
      console.error('Error detecting mood:', error);
      setStatus("Couldn't detect mood");
      toast.error("Error detecting mood");
    }
  }, [detectionsEnabled, updateMoodLog, sendImagePrompt, videoRef, modelRef, captureFaceImage]);


  const handleDetectionDelayChange = (value: string) => {
    setDetectionDelay(parseInt(value) * 1000);
  };

  const handleCurrentSongChange = (song: SongMood) => {
    setCurrentSong(song);
    // You can add more logic here if needed when the song changes
  };

  return (
      <div className="w-full max-w-6xl" ref={containerRef}>
      <Toaster />
      {loading && <LoadingOverlay />}
      <div className='flex flex-col md:flex-row justify-between gap-6'>
      {/* <DJ
        songs={songsHardCoded}
        currentMood={currentMood}
        onCurrentSongChange={handleCurrentSongChange}
      /> */}
      <DJPlayer
        songs={songsHardCoded}
        currentMood={currentMood}
        onCurrentSongChange={handleCurrentSongChange}
      />
      <ControlPanel
        onManualMoodChange={handleManualMoodChange}
        onDetectionDelayChange={handleDetectionDelayChange}
        detectionDelay={detectionDelay / 1000}
      />
        
      </div>


      <div className="flex flex-col md:flex-row justify-between gap-6">
        <VideoContainer
          videoRef={videoRef}
          currentMood={currentMood}
          status={status}
          detectionsEnabled={detectionsEnabled}
          // setDetectionsEnabled={setDetectionsEnabled}
          toggleDetections={toggleDetections}
        />
      <MoodLog moodLog={moodLog} />

      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <audio ref={audioRef} src="/sounds/segment_1.mp3" />
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
      <div className="flex items-center">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="text-xl">Loading...</span>
      </div>
    </div>
  );
}
