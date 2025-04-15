
import { useState, useRef, useEffect } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  audioOnly?: boolean;
  volume?: number;
  currentTime?: number;
  onTimeUpdate?: (seconds: number) => void;
  onDurationChange?: (duration: number) => void;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const YouTubePlayer = ({
  videoId,
  autoplay = false,
  audioOnly = false,
  volume = 80,
  currentTime = 0,
  onTimeUpdate = () => {},
  onDurationChange = () => {},
  onReady = () => {},
  onPlay = () => {},
  onPause = () => {},
  onEnd = () => {},
  className = '',
  width = '100%',
  height = '100%',
}: YouTubePlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [lastVideoId, setLastVideoId] = useState('');
  const progressInterval = useRef<number | null>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

  const loadYouTubeScript = () => {
    // Check if YT API script is already loaded
    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
      // Create onYouTubeIframeAPIReady callback
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
        resolve();
      };
      
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
  };

  // Setup progress tracking interval
  const setupProgressTracking = () => {
    if (progressInterval.current !== null) {
      clearInterval(progressInterval.current);
    }
    
    // Use a more frequent interval for smoother progress updates
    progressInterval.current = window.setInterval(() => {
      if (playerRef.current && playerReady) {
        try {
          // Make sure the player has the getCurrentTime method
          if (typeof playerRef.current.getCurrentTime === 'function') {
            const currentTime = playerRef.current.getCurrentTime();
            if (!isNaN(currentTime)) {
              onTimeUpdate(currentTime);
            }
          }
        } catch (e) {
          console.error("Error getting current time", e);
        }
      }
    }, 500); // Update every 500ms for smoother tracking
  };

  const destroyProgressTracking = () => {
    if (progressInterval.current !== null) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Initialize the player
  const initializePlayer = async () => {
    if (!containerRef.current || playerInitialized) return;
    
    try {
      // Make sure YT API is loaded
      await loadYouTubeScript();
      
      // Make sure window.YT is defined
      if (!window.YT || !window.YT.Player) {
        console.error("YouTube API not loaded properly");
        return;
      }
      
      console.log("Creating YouTube player with videoId:", videoId);
      
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: audioOnly ? 0 : 1, 
          disablekb: audioOnly ? 1 : 0,
          fs: audioOnly ? 0 : 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            console.log("YouTube player is ready");
            setPlayerReady(true);
            setLastVideoId(videoId);
            setPlayerInitialized(true);
            
            // Set initial volume - only if the player is ready and has the method
            try {
              if (event.target && typeof event.target.setVolume === 'function') {
                event.target.setVolume(volume);
              }
            } catch (e) {
              console.error("Could not set volume:", e);
            }
            
            // Get and set video duration
            try {
              if (typeof event.target.getDuration === 'function') {
                const duration = event.target.getDuration();
                if (!isNaN(duration)) {
                  onDurationChange(duration);
                }
              }
            } catch (e) {
              console.error("Could not get duration:", e);
            }
            
            // Start tracking progress
            setupProgressTracking();
            
            // Hide video if audio only mode
            if (audioOnly && containerRef.current) {
              const iframe = containerRef.current.querySelector('iframe');
              if (iframe) {
                iframe.style.opacity = '0';
                iframe.style.pointerEvents = 'none';
              }
            }
            
            // Notify that player is ready
            onReady();
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING = 1, YT.PlayerState.PAUSED = 2, YT.PlayerState.ENDED = 0
            if (event.data === 1) {
              console.log("Player state: PLAYING");
              onPlay();
              setupProgressTracking();
            }
            if (event.data === 2) {
              console.log("Player state: PAUSED");
              onPause();
            }
            if (event.data === 0) {
              console.log("Player state: ENDED");
              onEnd();
              destroyProgressTracking();
            }
          },
          onError: (event) => {
            console.error("YouTube player error:", event.data);
          },
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  };

  // Initial setup effect
  useEffect(() => {
    console.log("Initial setup effect running for videoId:", videoId);
    initializePlayer();
    
    return () => {
      destroyProgressTracking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          setPlayerInitialized(false);
          setPlayerReady(false);
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }
    };
  }, [videoId]); // Re-initialize when videoId changes

  // Update player when props change
  useEffect(() => {
    const safePlayerOperation = (operation: () => void) => {
      if (!playerReady || !playerRef.current) return;
      
      try {
        operation();
      } catch (error) {
        console.error("Error during player operation:", error);
      }
    };
    
    if (playerReady && playerRef.current) {
      console.log("Updating player with new props");
      
      // Update volume when it changes
      safePlayerOperation(() => {
        if (typeof playerRef.current?.setVolume === 'function') {
          playerRef.current.setVolume(volume);
        }
      });
      
      // Update player visibility when audioOnly changes
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe) {
        if (audioOnly) {
          iframe.style.opacity = '0';
          iframe.style.pointerEvents = 'none';
        } else {
          iframe.style.opacity = '1';
          iframe.style.pointerEvents = 'auto';
        }
      }
      
      // If videoId changes, load the new video
      if (videoId !== lastVideoId) {
        console.log("Loading new video:", videoId);
        safePlayerOperation(() => {
          if (typeof playerRef.current?.loadVideoById === 'function') {
            playerRef.current.loadVideoById(videoId);
            setLastVideoId(videoId);
          } else if (typeof playerRef.current?.cueVideoById === 'function') {
            playerRef.current.cueVideoById(videoId);
            setLastVideoId(videoId);
          }
        });
      }
      
      // If currentTime was updated externally (e.g., via slider)
      safePlayerOperation(() => {
        if (typeof playerRef.current?.getCurrentTime === 'function' && 
            typeof playerRef.current?.seekTo === 'function') {
          const currentPlayerTime = playerRef.current.getCurrentTime();
          if (!isNaN(currentPlayerTime) && Math.abs(currentPlayerTime - currentTime) > 1) {
            playerRef.current.seekTo(currentTime, true);
          }
        }
      });
      
      // Update play/pause state
      safePlayerOperation(() => {
        if (typeof playerRef.current?.getPlayerState === 'function') {
          const playerState = playerRef.current.getPlayerState();
          if (autoplay && playerState !== 1) {
            if (typeof playerRef.current?.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          } else if (!autoplay && playerState === 1) {
            if (typeof playerRef.current?.pauseVideo === 'function') {
              playerRef.current.pauseVideo();
            }
          }
        }
      });
    }
  }, [audioOnly, playerReady, volume, videoId, lastVideoId, currentTime, autoplay]);

  return (
    <div 
      className={`youtube-player-container ${className} ${audioOnly ? 'audio-only' : ''}`} 
      style={{ width, height, overflow: 'hidden' }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default YouTubePlayer;
