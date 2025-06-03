// Type definitions for Mood Detector v2

export type MoodType = 'happy' | 'sad' | 'sleepy' | 'angry' | 'neutral';

export type MusicPlatform = 'youtube' | 'spotify' | 'apple' | 'soundcloud' | 'mixcloud';

export type DetectionMethod = 'automatic' | 'manual';

// Song interface based on the Song.json entity schema
export interface Song {
  id?: string;
  title: string;
  youtube_id: string;
  artist?: string;
  moods: MoodType[];
  spotify_url?: string;
  apple_music_url?: string;
  duration?: number;
}

// Mood scores for all five mood types
export interface MoodScores {
  happy: number;
  sad: number;
  sleepy: number;
  angry: number;
  neutral: number;
}

// Mood detection result from LLM
export interface MoodDetectionResult {
  detected_mood: MoodType;
  confidence_score: number;
  mood_scores: MoodScores;
  reasoning: string;
}

// Mood detection entry for history
export interface MoodDetectionEntry {
  id?: string;
  detected_mood: MoodType;
  confidence_score: number;
  face_image_url?: string | null;
  detection_method: DetectionMethod;
  song_played?: string;
  mood_scores: MoodScores;
  created_date?: string;
}

// Mood log entry (for display purposes)
export interface MoodLogEntry {
  mood: string;
  time: string;
  image: string | null;
}

// Component Props Interfaces
export interface ControlPanelProps {
  detectionInterval: number;
  onIntervalChange: (interval: number) => void;
  onManualMoodSelect: (mood: MoodType) => void;
  onPlayRandomSong: () => void;
}

export interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextSong: () => void;
  onSongChange: (song: Song) => void;
}

export interface MoodHistoryProps {
  moodDetections: MoodDetectionEntry[];
}

export interface VideoFeedProps {
  onFrameForLLM: (imageDataUrl: string) => void;
  isDetectionActive: boolean;
  onToggleDetection: (active: boolean) => void;
  currentDisplayMood: MoodType | null;
  llmDetectionInterval?: number;
}

// Mood option for UI display
export interface MoodOption {
  value: MoodType;
  label: string;
  emoji: string;
}

// Constants
export const VALID_MOODS: MoodType[] = ['happy', 'sad', 'sleepy', 'angry', 'neutral'];

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'sleepy', label: 'Sleepy', emoji: '😴' },
  { value: 'angry', label: 'Angry', emoji: '😠' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' }
];

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  sleepy: '😴',
  angry: '😠',
  neutral: '😐'
}; 