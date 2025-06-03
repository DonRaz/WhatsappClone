"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Shuffle } from 'lucide-react';
import { MusicPlayerProps, MusicPlatform } from '../types';

export default function MusicPlayer({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNextSong,
  onSongChange 
}: MusicPlayerProps) {
  const [volume, setVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [platform, setPlatform] = useState<MusicPlatform>('youtube');
  const playerRef = useRef<HTMLIFrameElement>(null);

  const handleVolumeChange = (value: number[]): void => {
    setVolume(value[0]);
    if (playerRef.current) {
      // Note: Controlling iframe volume directly is limited for YouTube embeds
      // This would work better with YouTube API or other player implementations
    }
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
    if (playerRef.current) {
      // Note: Muting iframe directly is limited for YouTube embeds
    }
  };

  const getVideoUrl = (): string => {
    if (!currentSong?.youtube_id) return '';
    return `https://www.youtube.com/embed/${currentSong.youtube_id}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`;
  };

  return (
    <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-4 md:p-6 h-full">
        <div className="h-full flex flex-col space-y-4">
          {/* Music Player Display */}
          <div className="flex-1 relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {currentSong ? (
              <iframe
                ref={playerRef}
                src={getVideoUrl()}
                title={currentSong.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                <div className="text-center text-white space-y-4 p-4">
                  <Music className="w-12 md:w-16 h-12 md:h-16 mx-auto opacity-50" />
                  <p className="text-sm md:text-lg font-medium">Ready to play soothing music</p>
                  <p className="text-xs md:text-sm opacity-75">Waiting for mood detection...</p>
                </div>
              </div>
            )}
          </div>

          {/* Song Info */}
          {currentSong && (
            <div className="text-center space-y-1">
              <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
                {currentSong.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{currentSong.artist}</p>
              <div className="flex justify-center gap-1 flex-wrap">
                {currentSong.moods.slice(0, 2).map((mood, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white/80 text-xs font-medium text-gray-700 rounded-full"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-3">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={onPlayPause}
                size="lg"
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-4 md:w-5 h-4 md:h-5 text-white" />
                ) : (
                  <Play className="w-4 md:w-5 h-4 md:h-5 text-white ml-1" />
                )}
              </Button>
              
              <Button
                onClick={onNextSong}
                variant="outline"
                size="lg"
                className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-purple-200 hover:bg-purple-50"
              >
                <SkipForward className="w-3 md:w-4 h-3 md:h-4" />
              </Button>

              <Button
                variant="outline"
                size="lg" 
                className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-purple-200 hover:bg-purple-50"
              >
                <Shuffle className="w-3 md:w-4 h-3 md:h-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-white/60 rounded-2xl p-3">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3 md:w-4 h-3 md:h-4" />
                ) : (
                  <Volume2 className="w-3 md:w-4 h-3 md:h-4" />
                )}
              </Button>
              
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
              
              <span className="text-xs md:text-sm font-medium text-gray-600 w-8 md:w-10">
                {volume}%
              </span>
            </div>

            {/* Platform Selector */}
            <div className="flex items-center justify-center">
              <Select value={platform} onValueChange={(value: MusicPlatform) => setPlatform(value)}>
                <SelectTrigger className="w-32 md:w-40 bg-white/60 border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="apple">Apple Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 