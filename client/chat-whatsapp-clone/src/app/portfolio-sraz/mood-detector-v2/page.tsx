import React, { useState, useEffect, useCallback } from 'react';
import { Song } from '@/entities/Song';
import { MoodDetection } from '@/entities/MoodDetection';
import { InvokeLLM, UploadFile } from '@/integrations/Core';
import { toast } from 'sonner';

import VideoFeed from './components/VideoFeed';
import MusicPlayer from './components/MusicPlayer';
import MoodHistory from './components/MoodHistory';
import ControlPanel from './components/ControlPanel';

import { 
  MoodType, 
  Song as SongType, 
  MoodDetectionEntry, 
  MoodDetectionResult,
  MoodScores,
  VALID_MOODS 
} from './types';

export default function BabyMoodDetector() {
  const [songs, setSongs] = useState<SongType[]>([]);
  const [moodDetections, setMoodDetections] = useState<MoodDetectionEntry[]>([]);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDetectionActive, setIsDetectionActive] = useState<boolean>(true);
  const [detectionInterval, setDetectionInterval] = useState<number>(5); // Default interval in seconds for LLM
  const [currentMood, setCurrentMood] = useState<MoodType | null>(null); // e.g., "happy"

  useEffect(() => {
    loadSongs();
    loadMoodHistory();
  }, []);

  const loadSongs = async (): Promise<void> => {
    try {
      const fetchedSongs: any[] = await Song.list();
      // Transform the data to match our Song interface
      const typedSongs: SongType[] = fetchedSongs.map(song => ({
        id: song.id,
        title: song.title,
        youtube_id: song.youtube_id,
        artist: song.artist,
        moods: song.moods as MoodType[],
        spotify_url: song.spotify_url,
        apple_music_url: song.apple_music_url,
        duration: song.duration
      }));
      setSongs(typedSongs);
      if (typedSongs.length > 0 && !currentSong) {
        setCurrentSong(typedSongs[0]); // Initialize with a song
      }
    } catch (error) {
      console.error('Error loading songs:', error);
      toast.error('Failed to load songs');
    }
  };

  const loadMoodHistory = async (): Promise<void> => {
    try {
      const detections: any[] = await MoodDetection.list('-created_date', 20);
      // Transform the data to match our MoodDetectionEntry interface
      const typedDetections: MoodDetectionEntry[] = detections.map(detection => ({
        id: detection.id,
        detected_mood: detection.detected_mood as MoodType,
        confidence_score: detection.confidence_score,
        face_image_url: detection.face_image_url,
        detection_method: detection.detection_method,
        song_played: detection.song_played,
        mood_scores: detection.mood_scores as MoodScores,
        created_date: detection.created_date
      }));
      setMoodDetections(typedDetections);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const detectMoodFromImage = async (imageDataUrl: string): Promise<void> => {
    if (!imageDataUrl) {
      console.warn("No image data received for mood detection.");
      return;
    }
    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'baby-face.jpg', { type: 'image/jpeg' });
      
      const { file_url } = await UploadFile({ file });
      
      const moodResult: MoodDetectionResult = await InvokeLLM({
        prompt: `Analyze this baby's facial expression. Determine their dominant mood from: happy, sad, sleepy, angry, neutral. Also provide confidence scores (0-1) for each of these five moods and a brief reasoning.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            detected_mood: { type: "string", enum: VALID_MOODS },
            confidence_score: { type: "number", minimum: 0, maximum: 1 },
            mood_scores: {
              type: "object",
              properties: {
                happy: { type: "number" },
                sad: { type: "number" },
                sleepy: { type: "number" },
                angry: { type: "number" },
                neutral: { type: "number" }
              },
              required: VALID_MOODS // Ensure all moods are present
            },
            reasoning: { type: "string" }
          },
          required: ["detected_mood", "confidence_score", "mood_scores", "reasoning"]
        }
      });

      if (moodResult && moodResult.detected_mood) {
        // Sanitize data before saving
        const sanitizedMoodResult: MoodDetectionResult = {
          detected_mood: moodResult.detected_mood.toLowerCase() as MoodType,
          confidence_score: Math.max(0, Math.min(1, Number(moodResult.confidence_score) || 0)),
          mood_scores: VALID_MOODS.reduce((acc: MoodScores, mood: MoodType) => {
            acc[mood] = Math.max(0, Math.min(1, Number(moodResult.mood_scores?.[mood]) || 0));
            return acc;
          }, {} as MoodScores),
          reasoning: moodResult.reasoning || "N/A"
        };

        if (!VALID_MOODS.includes(sanitizedMoodResult.detected_mood)) {
          console.error("LLM returned an invalid detected_mood:", moodResult.detected_mood);
          toast.error(`Invalid mood detected: ${moodResult.detected_mood}`);
          return;
        }

        await saveMoodDetection(sanitizedMoodResult, file_url, 'automatic');
        selectSongForMood(sanitizedMoodResult.detected_mood);
        setCurrentMood(sanitizedMoodResult.detected_mood);
        
        toast.success(`Mood: ${sanitizedMoodResult.detected_mood} (${Math.round(sanitizedMoodResult.confidence_score * 100)}%)`, {
          description: sanitizedMoodResult.reasoning
        });
      } else {
        toast.error("Mood detection failed or returned invalid data.");
      }
    } catch (error) {
      console.error('Error detecting mood:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to detect mood: ${errorMessage}`);
    }
  };

  const saveMoodDetection = async (
    moodData: MoodDetectionResult, 
    imageUrl: string | null, 
    method: 'automatic' | 'manual'
  ): Promise<void> => {
    try {
      const payload = {
        detected_mood: moodData.detected_mood,
        confidence_score: moodData.confidence_score,
        face_image_url: imageUrl,
        detection_method: method,
        song_played: currentSong?.title || 'N/A',
        mood_scores: moodData.mood_scores
      };

      // Validate required fields again before sending
      if (!payload.detected_mood || typeof payload.confidence_score !== 'number') {
        console.error("Invalid payload for MoodDetection:", payload);
        toast.error("Internal error: Invalid data for mood record.");
        return;
      }
      
      const detection: any = await MoodDetection.create(payload);
      const typedDetection: MoodDetectionEntry = {
        id: detection.id,
        detected_mood: detection.detected_mood as MoodType,
        confidence_score: detection.confidence_score,
        face_image_url: detection.face_image_url,
        detection_method: detection.detection_method,
        song_played: detection.song_played,
        mood_scores: detection.mood_scores as MoodScores,
        created_date: detection.created_date
      };
      setMoodDetections(prev => [typedDetection, ...prev.slice(0, 19)]);
    } catch (error) {
      console.error('Error saving mood detection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unprocessable Entity';
      toast.error(`Error saving mood: ${errorMessage}`);
    }
  };

  const selectSongForMood = (mood: MoodType): void => {
    const matchingSongs = songs.filter(song => 
      song.moods.includes(mood)
    );
    
    if (matchingSongs.length > 0) {
      const randomSong = matchingSongs[Math.floor(Math.random() * matchingSongs.length)];
      setCurrentSong(randomSong);
      setIsPlaying(true);
    } else if (songs.length > 0) { // Fallback to any song if no mood match
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      setCurrentSong(randomSong);
      setIsPlaying(true);
      toast.info(`No specific song for ${mood}, playing a random one.`);
    }
  };

  const handleManualMoodSelect = async (mood: MoodType): Promise<void> => {
    if (!VALID_MOODS.includes(mood)) {
      toast.error(`Invalid manual mood: ${mood}`);
      return;
    }
    setCurrentMood(mood);
    selectSongForMood(mood);
    
    const manualMoodData: MoodDetectionResult = {
      detected_mood: mood,
      confidence_score: 1.0,
      mood_scores: VALID_MOODS.reduce((acc: MoodScores, m: MoodType) => ({ 
        ...acc, 
        [m]: m === mood ? 1.0 : 0 
      }), {} as MoodScores),
      reasoning: "Manually selected"
    };
    await saveMoodDetection(manualMoodData, null, 'manual');
    
    toast.info(`Mood set manually: ${mood}`);
  };

  const handlePlayRandomSong = (): void => {
    if (songs.length > 0) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      setCurrentSong(randomSong);
      setIsPlaying(true);
      toast.success(`Now playing: ${randomSong.title}`);
    }
  };

  const handleNextSong = (): void => {
    if (currentMood) {
      selectSongForMood(currentMood);
    } else {
      handlePlayRandomSong();
    }
  };

  const handleSongChange = (song: SongType): void => {
    setCurrentSong(song);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Baby Mood Detector
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            AI-powered mood detection with soothing music for your little one
          </p>
        </div>

        {/* Main Layout - Using 12 point grid system */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Top Row - Video Feed and Music Player */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="h-64 md:h-80 lg:h-96">
              <VideoFeed
                onFrameForLLM={detectMoodFromImage}
                isDetectionActive={isDetectionActive}
                onToggleDetection={setIsDetectionActive}
                currentDisplayMood={currentMood} 
                llmDetectionInterval={detectionInterval}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <div className="h-64 md:h-80 lg:h-96">
              <MusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNextSong={handleNextSong}
                onSongChange={handleSongChange}
              />
            </div>
          </div>

          {/* Bottom Row - Controls and Mood History */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
            <ControlPanel
              detectionInterval={detectionInterval}
              onIntervalChange={setDetectionInterval}
              onManualMoodSelect={handleManualMoodSelect}
              onPlayRandomSong={handlePlayRandomSong}
            />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-9">
            <MoodHistory moodDetections={moodDetections} />
          </div>
        </div>
      </div>
    </div>
  );
}