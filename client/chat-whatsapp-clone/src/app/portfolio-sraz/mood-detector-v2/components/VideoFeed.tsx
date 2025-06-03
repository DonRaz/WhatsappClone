"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Play, Pause } from 'lucide-react';
import { VideoFeedProps, MOOD_EMOJIS } from '../types';

export default function VideoFeed({ 
  onFrameForLLM, 
  isDetectionActive, 
  onToggleDetection, 
  currentDisplayMood,
  llmDetectionInterval = 5 
}: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detectionTimer, setDetectionTimer] = useState<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsStreamActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isStreamActive]);

  const handleDetection = useCallback(() => {
    if (!isDetectionActive || !isStreamActive) return;

    const imageDataUrl = captureFrame();
    if (imageDataUrl) {
      onFrameForLLM(imageDataUrl);
    }
  }, [isDetectionActive, isStreamActive, captureFrame, onFrameForLLM]);

  // Start/stop detection timer
  useEffect(() => {
    if (isDetectionActive && isStreamActive) {
      const timer = setInterval(handleDetection, llmDetectionInterval * 1000);
      setDetectionTimer(timer);
      return () => clearInterval(timer);
    } else if (detectionTimer) {
      clearInterval(detectionTimer);
      setDetectionTimer(null);
    }
  }, [isDetectionActive, isStreamActive, handleDetection, llmDetectionInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (detectionTimer) clearInterval(detectionTimer);
    };
  }, [stopCamera, detectionTimer]);

  return (
    <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4 md:p-6 h-full">
        <div className="h-full flex flex-col space-y-4">
          {/* Camera Feed */}
          <div className="flex-1 relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {isStreamActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Mood Overlay */}
                {currentDisplayMood && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                    <span className="text-2xl md:text-3xl">
                      {MOOD_EMOJIS[currentDisplayMood]}
                    </span>
                  </div>
                )}

                {/* Detection Status */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                    isDetectionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <span className="text-white text-xs md:text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {isDetectionActive ? 'Detecting' : 'Paused'}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center text-white space-y-4 p-4">
                  <Camera className="w-12 md:w-16 h-12 md:h-16 mx-auto opacity-50" />
                  <p className="text-sm md:text-lg font-medium">Camera not active</p>
                  <p className="text-xs md:text-sm opacity-75">Start camera to begin mood detection</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={isStreamActive ? stopCamera : startCamera}
              size="lg"
              className={`h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg ${
                isStreamActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isStreamActive ? (
                <CameraOff className="w-4 md:w-5 h-4 md:h-5 text-white" />
              ) : (
                <Camera className="w-4 md:w-5 h-4 md:h-5 text-white" />
              )}
            </Button>

            <Button
              onClick={() => onToggleDetection(!isDetectionActive)}
              disabled={!isStreamActive}
              variant="outline"
              size="lg"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-blue-200 hover:bg-blue-50 disabled:opacity-50"
            >
              {isDetectionActive ? (
                <Pause className="w-3 md:w-4 h-3 md:h-4" />
              ) : (
                <Play className="w-3 md:w-4 h-3 md:h-4 ml-1" />
              )}
            </Button>
          </div>

          {/* Manual Capture Button */}
          <Button
            onClick={handleDetection}
            disabled={!isStreamActive}
            variant="outline"
            className="w-full bg-white/60 border-blue-200 hover:bg-blue-50 disabled:opacity-50 text-xs md:text-sm"
          >
            Capture & Detect Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 