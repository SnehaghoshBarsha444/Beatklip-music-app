import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic, Download, Share2, X, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import YouTubePlayer from "./YouTubePlayer";
import { addToOfflineLibrary, isVideoOffline, removeFromOfflineLibrary } from "@/lib/youtube-api";
import { useToast } from "@/hooks/use-toast";
import { usePlayer } from "@/context/PlayerContext";

const MusicPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isAudioOnly, 
    togglePlay, 
    toggleAudioOnly, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    shareTrack
  } = usePlayer();
  
  const [seeking, setSeeking] = useState(false);
  const [tempSeekValue, setTempSeekValue] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isHoveringTracker, setIsHoveringTracker] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState("0:00");
  const [isTrackerExpanded, setIsTrackerExpanded] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const previousVolumeRef = useRef(volume);
  const { toast } = useToast();

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (currentTrack?.videoId) {
      setIsOffline(isVideoOffline(currentTrack.videoId));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (duration > 0 && currentTime >= 0) {
      const percentage = (currentTime / duration) * 100;
      setProgressPercentage(percentage);
    } else {
      setProgressPercentage(0);
    }
  }, [currentTime, duration]);

  const handleToggleAudioMode = () => {
    toggleAudioOnly();
    toast({
      title: !isAudioOnly ? "Audio-only mode enabled" : "Video mode enabled",
      description: !isAudioOnly 
        ? "Playing audio only to save data" 
        : "Video playback enabled"
    });
  };

  const handlePlayerReady = () => {
    console.log("YouTube player ready");
  };

  const handlePlayerPlay = () => {
    console.log("YouTube player started playing");
  };

  const handlePlayerPause = () => {
    console.log("YouTube player paused");
  };

  const handleToggleOffline = () => {
    if (!currentTrack?.videoId) return;
    
    if (isOffline) {
      removeFromOfflineLibrary(currentTrack.videoId);
      setIsOffline(false);
      toast({
        title: "Removed from offline library",
        description: `${currentTrack.title} is no longer available offline`,
      });
    } else {
      addToOfflineLibrary(currentTrack.videoId, {
        id: currentTrack.videoId,
        snippet: {
          title: currentTrack.title,
          description: "",
          channelTitle: currentTrack.artist,
          thumbnails: {
            default: { url: "", width: 120, height: 90 },
            medium: { url: currentTrack.thumbnail, width: 320, height: 180 },
            high: { url: "", width: 480, height: 360 }
          }
        },
        contentDetails: {
          duration: "PT0M0S",
          dimension: "2d",
          definition: "hd"
        },
        statistics: {
          viewCount: "0",
          likeCount: "0",
          favoriteCount: "0",
          commentCount: "0"
        }
      });
      setIsOffline(true);
      toast({
        title: "Added to offline library",
        description: `${currentTrack.title} is now available offline`,
      });
    }
  };

  const handleShare = async () => {
    try {
      await shareTrack();
      toast({
        title: "Shared successfully",
        description: "Link has been shared or copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share the track",
        variant: "destructive"
      });
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false);
    }
    previousVolumeRef.current = newVolume[0];
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = (time: number) => {
    if (!seeking) {
      setCurrentTime(time);
    }
  };

  const handleDurationChange = (newDuration: number) => {
    if (!isNaN(newDuration) && newDuration > 0) {
      setDuration(newDuration);
    }
  };

  const handleSeekStart = (value: number[]) => {
    setSeeking(true);
    setTempSeekValue(value[0]);
  };

  const handleSeekChange = (value: number[]) => {
    setTempSeekValue(value[0]);
  };

  const handleSeekEnd = () => {
    setCurrentTime(tempSeekValue);
    setSeeking(false);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width);
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const mousePosition = e.clientX - rect.left;
    const percentage = (mousePosition / rect.width) * 100;
    const timeAtPosition = (percentage / 100) * duration;
    
    setHoverPosition(percentage);
    setHoverTime(formatTime(timeAtPosition));
  };

  const toggleTracker = () => {
    setIsTrackerExpanded(!isTrackerExpanded);
  };

  const youtubePlayer = currentTrack?.videoId ? (
    <div className="absolute top-0 left-0 opacity-0 pointer-events-none h-1 w-1 overflow-hidden">
      <YouTubePlayer
        videoId={currentTrack.videoId}
        audioOnly={isAudioOnly}
        autoplay={isPlaying}
        volume={volume}
        currentTime={currentTime}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onReady={handlePlayerReady}
        onPlay={handlePlayerPlay}
        onPause={handlePlayerPause}
        onEnd={() => nextTrack()}
      />
    </div>
  ) : null;

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 animate-slideUp">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Pause size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">No track selected</p>
              <p className="text-sm text-muted-foreground">Select a track to play</p>
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 animate-slideUp">
      <div className="flex justify-center mb-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={toggleTracker}
          title={isTrackerExpanded ? "Collapse tracker" : "Expand tracker"}
        >
          {isTrackerExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </Button>
      </div>
      
      <div 
        ref={progressBarRef}
        className={cn(
          "relative cursor-pointer mb-2 transition-all duration-300",
          isTrackerExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}
        onClick={handleProgressBarClick}
        onMouseEnter={() => setIsHoveringTracker(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsHoveringTracker(false)}
        title="Click to seek"
      >
        <div className="relative flex flex-col">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${progressPercentage}%` }}
            />
            
            <div 
              className="absolute top-0 h-2 w-2 rounded-full bg-white shadow-sm border border-white transform -translate-y-0 -translate-x-1"
              style={{ left: `${progressPercentage}%` }}
            />
            
            {isHoveringTracker && (
              <>
                <div 
                  className="absolute top-0 h-2 w-2 rounded-full bg-white/70 transform -translate-y-0 -translate-x-1"
                  style={{ left: `${hoverPosition}%` }}
                />
                
                <div 
                  className="absolute bottom-4 px-2 py-1 rounded text-xs bg-background border text-foreground shadow-md transform -translate-x-1/2"
                  style={{ left: `${hoverPosition}%` }}
                >
                  {hoverTime}
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : currentTrack?.duration}</span>
          </div>
        </div>
      </div>
      
      {youtubePlayer}
      
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 w-1/4">
          <img 
            src={currentTrack.thumbnail} 
            alt={`${currentTrack.title} thumbnail`} 
            className="w-12 h-12 rounded object-cover"
          />
          <div className="truncate">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center gap-4 player-controls">
            <Button variant="ghost" size="icon" onClick={previousTrack}>
              <SkipBack size={20} />
            </Button>
            <Button 
              onClick={togglePlay} 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack}>
              <SkipForward size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-1/4 justify-end">
          <Toggle
            aria-label="Audio-only mode"
            pressed={isAudioOnly}
            onPressedChange={handleToggleAudioMode}
            title={isAudioOnly ? "Switch to video mode" : "Switch to audio-only mode"}
          >
            <Mic size={18} />
          </Toggle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleMute}
              className="h-8 w-8 p-0"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            <Slider 
              max={100}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
          
          <Button 
            variant={isOffline ? "default" : "ghost"} 
            size="icon"
            onClick={handleToggleOffline}
            title={isOffline ? "Remove from offline library" : "Save for offline"}
          >
            {isOffline ? <X size={18} /> : <Download size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            title="Share track"
          >
            <Share2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
