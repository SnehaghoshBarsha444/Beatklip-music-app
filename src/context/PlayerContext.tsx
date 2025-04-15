
import { createContext, useContext, useState, ReactNode } from "react";

interface Track {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  views?: string;
  audioOnly?: boolean;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isAudioOnly: boolean;
  queue: Track[];
  volume: number;
  currentTime: number;
  duration: number;
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  toggleAudioOnly: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  shareTrack: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(true);  // Default to audio-only mode
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = (track: Track) => {
    // Add the track to the queue if it's not already there
    if (!queue.some(t => t.id === track.id)) {
      setQueue([...queue, track]);
      setCurrentIndex(queue.length);
    } else {
      // Find the index of the track in the queue
      const index = queue.findIndex(t => t.id === track.id);
      setCurrentIndex(index);
    }
    
    // Set audio-only mode if specified in the track
    if (track.audioOnly !== undefined) {
      setIsAudioOnly(track.audioOnly);
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleAudioOnly = () => {
    setIsAudioOnly(!isAudioOnly);
  };

  const addToQueue = (track: Track) => {
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
  };

  const nextTrack = () => {
    if (queue.length === 0 || currentIndex >= queue.length - 1) return;
    
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const previousTrack = () => {
    if (queue.length === 0 || currentIndex <= 0) return;
    
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const shareTrack = async () => {
    if (!currentTrack) return;
    
    try {
      const shareData = {
        title: `Listen to ${currentTrack.title}`,
        text: `Check out ${currentTrack.title} by ${currentTrack.artist}`,
        url: `https://www.youtube.com/watch?v=${currentTrack.videoId}`
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(shareData.url);
        console.log('URL copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const value = {
    currentTrack,
    isPlaying,
    isAudioOnly,
    queue,
    volume,
    currentTime,
    duration,
    setCurrentTrack,
    playTrack,
    pauseTrack,
    togglePlay,
    toggleAudioOnly,
    addToQueue,
    clearQueue,
    nextTrack,
    previousTrack,
    setVolume,
    setCurrentTime,
    setDuration,
    shareTrack
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
