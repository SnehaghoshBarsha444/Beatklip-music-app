
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import TrackCard from "@/components/TrackCard";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Download, Plus, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

// Mock data for playlists
const mockPlaylists = [
  { id: "1", name: "Chill Vibes", tracksCount: 24 },
  { id: "2", name: "Workout Mix", tracksCount: 18 },
  { id: "3", name: "Focus Flow", tracksCount: 32 },
  { id: "4", name: "Party Starters", tracksCount: 15 },
  { id: "5", name: "Road Trip Playlist", tracksCount: 28 },
  { id: "6", name: "Acoustic Sessions", tracksCount: 12 },
  { id: "7", name: "90s Throwbacks", tracksCount: 20 }
];

// Mock data for tracks in a playlist
const mockTracks = [
  {
    id: "t1",
    title: "Summer Breeze",
    artist: "Chill Artists",
    thumbnail: "https://placehold.co/320x180/9B8AFB/FFFFFF/png?text=Summer+Breeze",
    duration: "3:45",
    views: "1.2M",
    videoId: "mock-video-id-1"
  },
  {
    id: "t2",
    title: "Mountain Echo",
    artist: "Nature Sounds",
    thumbnail: "https://placehold.co/320x180/9B8AFB/FFFFFF/png?text=Mountain+Echo",
    duration: "4:20",
    views: "890K",
    videoId: "mock-video-id-2"
  },
  {
    id: "t3",
    title: "Urban Rhythms",
    artist: "City Beats",
    thumbnail: "https://placehold.co/320x180/9B8AFB/FFFFFF/png?text=Urban+Rhythms",
    duration: "3:15",
    views: "2.5M",
    videoId: "mock-video-id-3"
  }
];

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const { playTrack } = usePlayer();
  
  useEffect(() => {
    // In a real app, fetch playlist details from an API
    // For now, we'll use mock data
    const foundPlaylist = mockPlaylists.find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      // In a real app, fetch tracks for this playlist
      setTracks(mockTracks);
    }
  }, [id]);
  
  if (!playlist) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <p>Loading playlist...</p>
        </div>
      </Layout>
    );
  }
  
  const handlePlayAll = () => {
    if (tracks.length > 0) {
      // Convert the track to the format expected by playTrack
      const firstTrack = {
        id: tracks[0].id,
        videoId: tracks[0].videoId,
        title: tracks[0].title,
        artist: tracks[0].artist,
        thumbnail: tracks[0].thumbnail,
        duration: tracks[0].duration,
        views: tracks[0].views
      };
      playTrack(firstTrack);
    }
  };
  
  const handlePlayTrack = (track: any) => {
    // Convert the track to the format expected by playTrack
    const playerTrack = {
      id: track.id,
      videoId: track.videoId,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail,
      duration: track.duration,
      views: track.views
    };
    playTrack(playerTrack);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
            <Music size={64} className="text-primary" />
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-sm uppercase font-medium text-muted-foreground">Playlist</h4>
              <h1 className="text-3xl font-bold mt-1">{playlist.name}</h1>
              <p className="text-muted-foreground mt-2">{tracks.length} tracks</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button onClick={handlePlayAll}>
                <Play size={16} className="mr-2" />
                Play All
              </Button>
              
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Download All
              </Button>
              
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tracks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tracks</h2>
          
          {tracks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Music size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No tracks in this playlist</h3>
              <p className="text-muted-foreground mb-4">Start adding your favorite tracks.</p>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Tracks
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  thumbnail={track.thumbnail}
                  duration={track.duration}
                  views={track.views}
                  videoId={track.videoId}
                  onPlay={() => handlePlayTrack(track)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistDetail;
