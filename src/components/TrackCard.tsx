
import { Play, Mic, Plus, Check, Download, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addToOfflineLibrary, isVideoOffline, removeFromOfflineLibrary } from "@/lib/youtube-api";
import { useToast } from "@/components/ui/use-toast";

interface TrackCardProps {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  views?: string;
  videoId?: string; // YouTube video ID
  onPlay?: () => void;
  onToggleAudioOnly?: () => void;
  onAddToPlaylist?: () => void;
}

const TrackCard = ({
  id,
  title,
  artist,
  thumbnail,
  duration,
  views,
  videoId,
  onPlay = () => {},
  onToggleAudioOnly = () => {},
  onAddToPlaylist = () => {},
}: TrackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the track is in offline library
    if (videoId) {
      setIsOffline(isVideoOffline(videoId));
    }
  }, [videoId]);
  
  const handleAddToPlaylist = () => {
    setInPlaylist(!inPlaylist);
    onAddToPlaylist();
  };
  
  const handleToggleOffline = () => {
    if (!videoId) return;
    
    if (isOffline) {
      // Remove from offline library
      removeFromOfflineLibrary(videoId);
      setIsOffline(false);
      toast({
        title: "Removed from offline library",
        description: `${title} is no longer available offline`,
      });
    } else {
      // Add to offline library (in a real app, this would download the actual content)
      // For this demo, we're just storing the video metadata
      addToOfflineLibrary(videoId, {
        id: videoId,
        snippet: {
          title,
          description: "",
          channelTitle: artist,
          thumbnails: {
            default: { url: "", width: 120, height: 90 },
            medium: { url: thumbnail, width: 320, height: 180 },
            high: { url: "", width: 480, height: 360 }
          }
        },
        contentDetails: {
          duration: "PT0M0S", // Placeholder duration
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
        description: `${title} is now available offline`,
      });
    }
  };
  
  return (
    <div 
      className="relative group rounded-lg overflow-hidden bg-card border border-border hover:border-primary/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity",
          isHovered && "opacity-100"
        )}>
          <Button 
            onClick={onPlay}
            size="icon" 
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12"
          >
            <Play size={20} className="ml-1" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium truncate">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={onToggleAudioOnly}
              title="Toggle audio-only mode"
            >
              <Mic size={16} />
            </Button>
            
            <Button 
              variant={inPlaylist ? "default" : "ghost"} 
              size="sm" 
              className={cn("h-8 w-8 p-0", inPlaylist && "bg-primary text-primary-foreground")} 
              onClick={handleAddToPlaylist}
              title={inPlaylist ? "Remove from playlist" : "Add to playlist"}
            >
              {inPlaylist ? <Check size={16} /> : <Plus size={16} />}
            </Button>
            
            {videoId && (
              <Button 
                variant={isOffline ? "default" : "ghost"} 
                size="sm" 
                className={cn("h-8 w-8 p-0", isOffline && "bg-primary text-primary-foreground")} 
                onClick={handleToggleOffline}
                title={isOffline ? "Remove from offline library" : "Save for offline"}
              >
                {isOffline ? <X size={16} /> : <Download size={16} />}
              </Button>
            )}
          </div>
          
          {views && (
            <span className="text-xs text-muted-foreground">{views}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
