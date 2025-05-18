'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipForward, Volume2, VolumeX, Maximize, Minimize, Repeat } from 'lucide-react'

type SongMood = {
  id: string
  title: string
  youtube: string
  spotify?: string
  appleMusic?: string
  youtubeMusic?: string
  moods: string[]
  soundcloud?: string
  mixcloud?: string
}

type MusicPlatform = 'youtube' | 'spotify' | 'appleMusic' | 'youtubeMusic' | 'soundcloud' | 'mixcloud'

interface DJPlayerProps {
  songs: SongMood[]
  currentMood: string
  onCurrentSongChange: (song: SongMood) => void
}

export default function DJPlayer({ songs, currentMood, onCurrentSongChange }: DJPlayerProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState<SongMood[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [playHistory, setPlayHistory] = useState<Set<string>>(new Set())
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  
  // React-Player state
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [loop, setLoop] = useState(false)
  const [seeking, setSeeking] = useState(false)

  const [musicPlatform, setMusicPlatform] = useState<MusicPlatform>('youtube')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePlayerReady = useCallback(() => {
    setIsPlayerReady(true);
  }, []);

  
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentPlaylist.length === 0) {
      const initialPlaylist = shuffleArray([...songs])
      setCurrentPlaylist(initialPlaylist)
      setCurrentSongIndex(0)
      onCurrentSongChange(initialPlaylist[0])
    }
  }, [songs, onCurrentSongChange])

  useEffect(() => {
    if (playing && currentPlaylist.length > 0) {
      onCurrentSongChange(currentPlaylist[currentSongIndex])
    }
  }, [playing, currentPlaylist, currentSongIndex, onCurrentSongChange])

  useEffect(() => {
    const matchingSongs = findBestFitSongs(currentMood)
    if (matchingSongs.length > 0) {
      setCurrentPlaylist(matchingSongs)
      setCurrentSongIndex(0)
      if (playing) {
        onCurrentSongChange(matchingSongs[0])
      }
    }
  }, [currentMood, songs, onCurrentSongChange, playing])

  const findBestFitSongs = useCallback((mood: string): SongMood[] => {
    const matchingSongs = songs.filter(song => song.moods.includes(mood))
    return matchingSongs.length > 0 ? shuffleArray(matchingSongs) : shuffleArray([...songs])
  }, [songs])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const playNextSong = useCallback(() => {
    const currentSong = currentPlaylist[currentSongIndex]
    if (currentSong) {
      setPlayHistory(prev => new Set(prev).add(currentSong.id))
    }

    let nextIndex = (currentSongIndex + 1) % currentPlaylist.length
    
    if (nextIndex === 0) {
      const newPlaylist = shuffleArray([...songs])
      setCurrentPlaylist(newPlaylist)
      nextIndex = 0
    }

    setCurrentSongIndex(nextIndex)
    onCurrentSongChange(currentPlaylist[nextIndex])
  }, [currentPlaylist, currentSongIndex, songs, onCurrentSongChange])

  const handlePlayPause = () => setPlaying(!playing)
  const handleVolumeChange = (value: number[]) => setVolume(value[0])
  const handleToggleMuted = () => setMuted(!muted)
  const handleSetPlaybackRate = (rate: number) => setPlaybackRate(rate)
  const handleToggleLoop = () => setLoop(!loop)

  const handleSeekMouseDown = () => setSeeking(true)
  const handleSeekChange = (value: number[]) => setPlayed(value[0])
  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false)
    playerRef.current?.seekTo(value[0])
  }

  const handleProgress = (state: { played: number; loaded: number }) => {
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
    }
  }

  const handleDuration = (duration: number) => setDuration(duration)

  const handlePlatformChange = (platform: MusicPlatform) => setMusicPlatform(platform)

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(containerRef.current as Element)
      setIsFullscreen(!isFullscreen)
    }
  }

  const getPlayerUrl = () => {
    const currentSong = currentPlaylist[currentSongIndex]
    if (!currentSong) return ''
    switch (musicPlatform) {
      case 'youtube':
        return `https://www.youtube.com/watch?v=${currentSong.youtube}`
      case 'soundcloud':
        return currentSong.soundcloud || ''
      case 'mixcloud':
        return currentSong.mixcloud || ''
      default:
        return ''
    }
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div ref={containerRef} className={`relative aspect-video bg-muted-foreground/10 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          <ReactPlayer
            ref={playerRef}
            onReady={handlePlayerReady}
            playing={isPlayerReady && playing}
            url={getPlayerUrl()}
            // playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            loop={loop}
            width="100%"
            height="100%"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={playNextSong}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onError={(e) => console.error('Player error:', e)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-secondary bg-opacity-50 p-4">
            <div className="flex flex-col space-y-2">
              <Slider
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekMouseUp}
                onPointerDown={handleSeekMouseDown}
                aria-label="Seek"
              />
              <div className="flex justify-between text-primary-foreground text-sm">
                <span>{formatTime(duration * played)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={handlePlayPause} variant="outline" size="icon" aria-label={playing ? 'Pause' : 'Play'}>
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button onClick={playNextSong} variant="outline" size="icon" aria-label="Next song">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleToggleMuted} variant="outline" size="icon" aria-label={muted ? 'Unmute' : 'Mute'}>
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.01}
                      className="w-24"
                      onValueChange={handleVolumeChange}
                      aria-label="Volume"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={musicPlatform} onValueChange={handlePlatformChange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="soundcloud">SoundCloud</SelectItem>
                      <SelectItem value="mixcloud">Mixcloud</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleToggleLoop} variant="outline" size="icon" aria-label={loop ? 'Disable loop' : 'Enable loop'}>
                    <Repeat className={`h-4 w-4 ${loop ? 'text-primary' : ''}`} />
                  </Button>
                  <Button onClick={toggleFullscreen} variant="outline" size="icon" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {currentPlaylist[currentSongIndex] && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Now Playing: {currentPlaylist[currentSongIndex].title}</p>
            <p className="text-sm text-muted-foreground">Playback Rate: {playbackRate}x</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}