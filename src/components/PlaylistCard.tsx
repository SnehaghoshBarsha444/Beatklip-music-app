
import { ListMusic, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  id: string;
  name: string;
  tracksCount: number;
  thumbnail?: string;
  onPlay?: () => void;
}

const PlaylistCard = ({
  id,
  name,
  tracksCount,
  thumbnail,
  onPlay = () => {},
}: PlaylistCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const defaultThumbnail = "https://placehold.co/240x240/9B8AFB/FFFFFF/png?text=♫";
  
  const handleCardClick = () => {
    navigate(`/playlists/${id}`);
  };
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-beatklip-purple/10">
            <ListMusic size={48} className="text-beatklip-purple opacity-50" />
          </div>
        )}
        
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity",
          isHovered && "opacity-100"
        )}>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            size="icon" 
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12"
          >
            <Play size={20} className="ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium truncate">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {tracksCount} {tracksCount === 1 ? 'track' : 'tracks'}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
