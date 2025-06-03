# Baby Mood Detector v2 - TypeScript Version

## Overview
This is a fully TypeScript-converted version of the Baby Mood Detector application, featuring AI-powered mood detection with soothing music for babies.

## Features
- 🎯 **Real-time Mood Detection**: Uses TensorFlow.js and BlazeFace for face detection
- 🎵 **Smart Music Selection**: Automatically plays mood-appropriate songs
- 📊 **Mood History Tracking**: Tracks and displays mood detection history
- 🎛️ **Manual Controls**: Override automatic detection with manual mood selection
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **TypeScript**: Fully typed for better development experience and reliability

## Technology Stack
- **React 18** with TypeScript
- **Next.js 14** App Router
- **TensorFlow.js** for AI model inference
- **BlazeFace** for facial detection
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Sonner** for toast notifications
- **date-fns** for date formatting
- **Lucide React** for icons

## File Structure
```
mood-detector-v2/
├── components/
│   ├── ControlPanel.tsx      # Detection controls and manual mood selection
│   ├── MoodHistory.tsx       # Mood detection history display
│   ├── MusicPlayer.tsx       # YouTube music player with controls
│   └── VideoFeed.tsx         # Camera feed with face detection
├── data/
│   └── mockData.ts          # Mock songs and mood detection data
├── types/
│   └── index.ts             # TypeScript type definitions
├── page.tsx                 # Main application component
└── README.md               # This file
```

## Types Defined
- `MoodType`: Union type for valid moods ('happy', 'sad', 'sleepy', 'angry', 'neutral')
- `Song`: Interface for song data with YouTube ID, artist, moods, etc.
- `MoodDetectionEntry`: Interface for mood detection history entries
- `MoodDetectionResult`: Interface for AI mood detection results
- Component prop interfaces for all components

## Mock Data Included
- **15 Songs**: Various nursery rhymes, lullabies, and popular songs
- **5 Mood Detections**: Sample mood detection history with timestamps
- All data is properly typed and includes realistic confidence scores

## Key Improvements from JavaScript Version
1. **Type Safety**: All functions, props, and state are properly typed
2. **Better Error Handling**: Improved error handling with TypeScript's type checking
3. **IntelliSense Support**: Full IDE autocomplete and error detection
4. **Maintainability**: Easier to refactor and maintain with explicit types
5. **Documentation**: Types serve as inline documentation for data structures

## Usage
The application automatically:
1. Loads TensorFlow.js and BlazeFace model
2. Starts camera feed and face detection
3. Simulates mood detection (uses mock data instead of real AI)
4. Plays appropriate music based on detected mood
5. Logs mood history with timestamps

## Controls
- **Power Button**: Toggle detection on/off
- **Detection Interval**: Adjust how often mood detection runs
- **Manual Mood Selection**: Override automatic detection
- **Music Controls**: Play/pause, skip, volume control
- **Platform Selection**: Choose music platform (YouTube, Spotify, Apple Music)

## Notes
- Currently uses mock mood detection instead of real AI for demonstration
- Camera access required for face detection
- TensorFlow.js models are loaded client-side
- YouTube embeds are used for music playback
- All components are responsive and mobile-friendly

## Future Enhancements
- Integration with real mood detection API
- Support for multiple music platforms
- Playlist management
- User preferences and settings
- Advanced mood analytics
- Real-time mood tracking charts 