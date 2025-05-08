'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipForward, Volume2, VolumeX, Maximize, Minimize, Repeat, AlertTriangle } from 'lucide-react'
import debounce from 'lodash.debounce'

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

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function DJPlayer({ songs, currentMood, onCurrentSongChange }: DJPlayerProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState<SongMood[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [playHistory, setPlayHistory] = useState<Set<string>>(new Set())
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  
  // React-Player state
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [loop, setLoop] = useState(false)
  const [seeking, setSeeking] = useState(false)

  const [musicPlatform, setMusicPlatform] = useState<MusicPlatform>('youtube')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [playerError, setPlayerError] = useState<string | null>(null)
  const [lastSongChangeTime, setLastSongChangeTime] = useState(0)
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')

  const handlePlayerReady = useCallback(() => {
    setIsPlayerReady(true)
    setLoadingState('ready')
    setPlayerError(null)
    console.log('Player ready!')
  }, [])

  
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentPlaylist.length === 0) {
      console.log('Initializing playlist with mood:', currentMood)
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
    const exactMatches = songs.filter(song => song.moods.includes(mood))
    if (exactMatches.length > 0) {
      return shuffleArray(exactMatches)
    }
    
    const moodKeyword = mood.split(' ')[1]
    if (moodKeyword) {
      const keywordMatches = songs.filter(song => 
        song.moods.some(m => m.includes(moodKeyword))
      )
      if (keywordMatches.length > 0) {
        return shuffleArray(keywordMatches)
      }
    }
    
    return shuffleArray([...songs])
  }, [songs])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const debouncedMoodUpdate = useCallback(
    debounce((mood: string) => {
      if (!mood) return
      console.log('Updating playlist based on mood:', mood)
      
      const matchingSongs = findBestFitSongs(mood)
      
      if (matchingSongs.length > 0) {
        setCurrentPlaylist(matchingSongs)
        if (currentSongIndex >= matchingSongs.length) {
          setCurrentSongIndex(0)
          if (playing) {
            onCurrentSongChange(matchingSongs[0])
          }
        }
      }
    }, 1500),
    [findBestFitSongs, onCurrentSongChange, playing, currentSongIndex]
  )

  useEffect(() => {
    debouncedMoodUpdate(currentMood)
  }, [currentMood, debouncedMoodUpdate])

  const debouncedPlayNextSong = useCallback(
    debounce(() => {
      if (isLoading || loadingState === 'loading') {
        console.log('Still loading, not changing song yet')
        return
      }
      
      const now = Date.now()
      if (now - lastSongChangeTime < 2000) {
        console.log('Song changed too recently, skipping this change')
        return
      }
      
      setLoadingState('loading')
      setLastSongChangeTime(now)
      
      const currentSong = currentPlaylist[currentSongIndex]
      if (currentSong) {
        setPlayHistory(prevHistory => {
          const newHistory = new Set(prevHistory)
          newHistory.add(currentSong.id)
          return newHistory
        })
      }
      
      let nextIndex = (currentSongIndex + 1) % currentPlaylist.length
      if (nextIndex === 0) {
        const newPlaylist = shuffleArray([...songs])
        setCurrentPlaylist(newPlaylist)
        
        const unplayedSong = newPlaylist.findIndex(song => !playHistory.has(song.id))
        nextIndex = unplayedSong >= 0 ? unplayedSong : 0
      }
      
      setCurrentSongIndex(nextIndex)
      if (currentPlaylist[nextIndex]) {
        onCurrentSongChange(currentPlaylist[nextIndex])
        console.log('Playing next song:', currentPlaylist[nextIndex].title)
      }
      
      setPlayerError(null)
      
      setTimeout(() => {
        setLoadingState('idle')
      }, 1000)
    }, 500),
    [currentPlaylist, currentSongIndex, songs, playHistory, onCurrentSongChange, isLoading, loadingState, lastSongChangeTime]
  )

  const playNextSong = useCallback(() => {
    debouncedPlayNextSong()
  }, [debouncedPlayNextSong])

  const handlePlayPause = () => setPlaying(!playing)
  const handleVolumeChange = (value: number[]) => setVolume(value[0])
  const handleToggleMuted = () => setMuted(!muted)
  const handleSetPlaybackRate = (rate: number) => setPlaybackRate(rate)
  const handleToggleLoop = () => setLoop(!loop)

  const handleSeekMouseDown = () => setSeeking(true)
  const handleSeekChange = (value: number[]) => {
    setSeeking(true)
    setPlayed(value[0])
  }
  const handleSeekMouseUp = () => {
    setSeeking(false)
    playerRef.current?.seekTo(played)
  }

  const handleProgress = (state: { played: number; loaded: number }) => {
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
    }
  }

  const handleDuration = (duration: number) => setDuration(duration)

  const handlePlatformChange = (platform: MusicPlatform) => {
    setLoadingState('loading')
    setMusicPlatform(platform)
    setPlayerError(null)
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        screenfull.request(containerRef.current).catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
      } else {
        screenfull.exit()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const getPlayerUrl = () => {
    if (loadingState === 'error' || !currentPlaylist[currentSongIndex]) {
      return ''
    }
    
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

  const handlePlayerError = useCallback((error: any) => {
    console.error('Player error:', error)
    setPlayerError(`Error playing ${currentPlaylist[currentSongIndex]?.title}. Trying a different source...`)
    setLoadingState('error')
    
    setTimeout(() => {
      if (musicPlatform === 'youtube' && currentPlaylist[currentSongIndex]?.soundcloud) {
        setMusicPlatform('soundcloud')
      } else {
        playNextSong()
      }
    }, 2000)
  }, [currentPlaylist, currentSongIndex, musicPlatform, playNextSong])

  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div ref={containerRef} className={`relative aspect-video bg-gray-200 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10 p-4 text-center">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
              <p className="text-white mb-4">{playerError}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={playNextSong}>
                  Try Next Song
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMusicPlatform(musicPlatform === 'youtube' ? 'soundcloud' : 'youtube')}>
                  Try {musicPlatform === 'youtube' ? 'SoundCloud' : 'YouTube'}
                </Button>
              </div>
            </div>
          )}
          
          {loadingState === 'loading' && !playerError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          <ReactPlayer
            ref={playerRef}
            onReady={handlePlayerReady}
            playing={isPlayerReady && playing && !playerError && loadingState !== 'loading'}
            url={getPlayerUrl()}
            volume={volume}
            muted={muted}
            played={played}
            loaded={loaded}
            width="100%"
            height="100%"
            onPlay={() => {
              setPlaying(true)
              setLoadingState('ready')
            }}
            onPause={() => setPlaying(false)}
            onEnded={playNextSong}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onError={handlePlayerError}
            onBuffer={() => setLoadingState('loading')}
            onBufferEnd={() => setLoadingState('ready')}
            config={{
              youtube: {
                playerVars: { 
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                  modestbranding: 1,
                  showinfo: 0,
                  controls: 0
                }
              },
              soundcloud: {
                options: {
                  auto_play: false
                }
              }
            }}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-white">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={playNextSong} variant="ghost" size="icon" className="text-white">
                  <SkipForward className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[played * 100]}
                    min={0}
                    max={100}
                    step={0.01}
                    onValueChange={(value) => handleSeekChange([value[0] / 100])}
                    onValueCommit={() => handleSeekMouseUp()}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleToggleMuted} variant="ghost" size="icon" className="text-white">
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
                <Button onClick={toggleFullscreen} variant="ghost" size="icon" className="text-white">
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">
                  {currentPlaylist[currentSongIndex]?.title || 'No song selected'}
                </span>
                <Select
                  value={musicPlatform}
                  onValueChange={(value: MusicPlatform) => handlePlatformChange(value)}
                >
                  <SelectTrigger className="w-[150px] h-7 text-xs bg-gray-800 text-white">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="soundcloud">SoundCloud</SelectItem>
                    <SelectItem value="mixcloud">Mixcloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-white text-xs opacity-70">
                <span>Current Mood: </span>
                <span className="font-semibold">{currentMood || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}