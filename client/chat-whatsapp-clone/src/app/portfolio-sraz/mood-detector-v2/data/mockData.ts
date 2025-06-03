import { Song, MoodDetectionEntry, MoodType } from '../types';

// Mock songs data similar to songsHardCoded from baby-mood-detector.tsx
export const mockSongs: Song[] = [
  {
    id: 'jNQXAC9IVRw',
    title: 'Me at the zoo',
    youtube_id: 'jNQXAC9IVRw',
    artist: 'First YouTube Video',
    moods: ['happy', 'neutral']
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    youtube_id: 'dQw4w9WgXcQ',
    artist: 'Rick Astley',
    moods: ['happy', 'sad', 'neutral']
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito',
    youtube_id: 'kJQP7kiw5Fk',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    moods: ['happy', 'angry']
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Shape of You',
    youtube_id: 'JGwWNGJdvx8',
    artist: 'Ed Sheeran',
    moods: ['happy', 'neutral']
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Uptown Funk',
    youtube_id: 'OPf0YbXqDm0',
    artist: 'Mark Ronson ft. Bruno Mars',
    moods: ['happy', 'angry']
  },
  {
    id: 'RgKAFK5djSk',
    title: 'See You Again',
    youtube_id: 'RgKAFK5djSk',
    artist: 'Wiz Khalifa ft. Charlie Puth',
    moods: ['sad', 'neutral']
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars',
    youtube_id: 'hT_nvWreIhg',
    artist: 'OneRepublic',
    moods: ['happy', 'neutral', 'sleepy']
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Hello',
    youtube_id: 'YQHsXMglC9A',
    artist: 'Adele',
    moods: ['sad', 'neutral']
  },
  {
    id: 'fRh_vgS2dFE',
    title: 'Despacito (Lullaby Version)',
    youtube_id: 'fRh_vgS2dFE',
    artist: 'Baby Sleep Music',
    moods: ['happy', 'sad', 'sleepy', 'angry', 'neutral']
  },
  {
    id: 'JcdXKXY_qTA',
    title: 'Baby Shark Dance',
    youtube_id: 'JcdXKXY_qTA',
    artist: 'Pinkfong',
    moods: ['happy', 'neutral', 'angry']
  },
  // Additional lullabies and baby songs
  {
    id: '9Fxq7VBL0WI',
    title: 'Brahms Lullaby',
    youtube_id: '9Fxq7VBL0WI',
    artist: 'Classical Baby Music',
    moods: ['sleepy', 'neutral']
  },
  {
    id: 'BX3bN5YeiQs',
    title: 'Twinkle Twinkle Little Star',
    youtube_id: 'BX3bN5YeiQs',
    artist: 'Nursery Rhymes',
    moods: ['happy', 'sleepy', 'neutral']
  },
  {
    id: 'kLnl4gO-ffw',
    title: 'Rock-a-Bye Baby',
    youtube_id: 'kLnl4gO-ffw',
    artist: 'Baby Lullabies',
    moods: ['sleepy', 'neutral']
  },
  {
    id: 'SWQeJH1GGJM',
    title: 'Wheels on the Bus',
    youtube_id: 'SWQeJH1GGJM',
    artist: 'Super Simple Songs',
    moods: ['happy', 'angry', 'neutral']
  },
  {
    id: 'YbgnlkJPga4',
    title: 'Old MacDonald Had a Farm',
    youtube_id: 'YbgnlkJPga4',
    artist: 'Kids Songs',
    moods: ['happy', 'neutral']
  }
];

export const defaultPlaylist: Song[] = [
  {
    id: 'fRh_vgS2dFE',
    title: 'Despacito (Lullaby Version)',
    youtube_id: 'fRh_vgS2dFE',
    artist: 'Baby Sleep Music',
    moods: ['happy', 'sad', 'sleepy', 'angry', 'neutral']
  },
  {
    id: 'JcdXKXY_qTA',
    title: 'Baby Shark Dance',
    youtube_id: 'JcdXKXY_qTA',
    artist: 'Pinkfong',
    moods: ['happy', 'neutral', 'angry']
  }
];

// Mock mood detection entries for history
export const mockMoodDetections: MoodDetectionEntry[] = [
  {
    id: '1',
    detected_mood: 'happy',
    confidence_score: 0.85,
    face_image_url: null,
    detection_method: 'automatic',
    song_played: 'Baby Shark Dance',
    mood_scores: {
      happy: 0.85,
      sad: 0.05,
      sleepy: 0.03,
      angry: 0.02,
      neutral: 0.05
    },
    created_date: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
  },
  {
    id: '2',
    detected_mood: 'sleepy',
    confidence_score: 0.92,
    face_image_url: null,
    detection_method: 'automatic',
    song_played: 'Brahms Lullaby',
    mood_scores: {
      happy: 0.02,
      sad: 0.01,
      sleepy: 0.92,
      angry: 0.01,
      neutral: 0.04
    },
    created_date: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
  },
  {
    id: '3',
    detected_mood: 'neutral',
    confidence_score: 0.78,
    face_image_url: null,
    detection_method: 'manual',
    song_played: 'Twinkle Twinkle Little Star',
    mood_scores: {
      happy: 0.15,
      sad: 0.02,
      sleepy: 0.05,
      angry: 0.00,
      neutral: 0.78
    },
    created_date: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: '4',
    detected_mood: 'sad',
    confidence_score: 0.73,
    face_image_url: null,
    detection_method: 'automatic',
    song_played: 'Hello',
    mood_scores: {
      happy: 0.08,
      sad: 0.73,
      sleepy: 0.12,
      angry: 0.02,
      neutral: 0.05
    },
    created_date: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
  },
  {
    id: '5',
    detected_mood: 'angry',
    confidence_score: 0.67,
    face_image_url: null,
    detection_method: 'automatic',
    song_played: 'Wheels on the Bus',
    mood_scores: {
      happy: 0.12,
      sad: 0.08,
      sleepy: 0.03,
      angry: 0.67,
      neutral: 0.10
    },
    created_date: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
  }
]; 