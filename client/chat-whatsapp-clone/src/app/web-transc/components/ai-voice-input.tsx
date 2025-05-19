"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Add WebKit AudioContext interface
interface Window {
  webkitAudioContext: typeof AudioContext;
}

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
  stream?: MediaStream;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  stream
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [audioData, setAudioData] = useState<number[]>(Array(visualizerBars).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      onStop?.(time);
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [submitted, time, onStart, onStop]);

  // Setup audio visualization from stream
  useEffect(() => {
    if (!stream || !isClient) return;
    
    // Handle cross-browser AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyserRef.current = analyser;
    
    const updateAudioData = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Map the frequency data to our visualizer bars
      const newData = Array(visualizerBars).fill(0).map((_, i) => {
        const index = Math.floor(i * (bufferLength / visualizerBars));
        return dataArray[index] / 255; // Normalize to 0-1
      });
      
      setAudioData(newData);
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      source.disconnect();
    };
  }, [stream, isClient, visualizerBars]);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      setSubmitted((prev) => !prev);
    }
  };

  // Determine if we should show real audio visualization or demo animation
  const isActive = submitted || stream;

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isActive
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {isActive ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isActive
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-16 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => {
            // Calculate height based on audio data when stream is available
            const heightPercentage = stream && isClient 
              ? `${Math.max(5, audioData[i] * 100)}%` 
              : isActive && isClient
                ? `${20 + Math.random() * 80}%`
                : "10%";
                
            return (
              <div
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-100",
                  isActive
                    ? "bg-primary dark:bg-primary animate-none"
                    : "bg-black/10 dark:bg-white/10 h-1"
                )}
                style={{
                  height: heightPercentage,
                  animationDelay: isActive && !stream ? `${i * 0.05}s` : undefined,
                  transition: stream ? "height 50ms ease" : undefined
                }}
              />
            );
          })}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isActive ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}