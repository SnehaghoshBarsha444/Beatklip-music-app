
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import TrackCard from "@/components/TrackCard";
import PlaylistCard from "@/components/PlaylistCard";
import { ListMusic, TrendingUp, History } from "lucide-react";

// Mock data for UI presentation
const featuredTracks = [
  {
    id: "1",
    title: "Lost in the Moment",
    artist: "Cosmic Echoes",
    thumbnail: "https://placehold.co/640x360/6C63FF/FFFFFF/png?text=Music+Video",
    duration: "3:45",
    views: "1.2M views"
  },
  {
    id: "2",
    title: "Electric Dreams",
    artist: "Synthwave Masters",
    thumbnail: "https://placehold.co/640x360/FF6B6B/FFFFFF/png?text=Music+Video",
    duration: "4:12",
    views: "852K views"
  },
  {
    id: "3",
    title: "Midnight Drive",
    artist: "The Neon Lights",
    thumbnail: "https://placehold.co/640x360/4ECDC4/FFFFFF/png?text=Music+Video",
    duration: "3:28",
    views: "2.1M views"
  },
  {
    id: "4",
    title: "Summer Memories",
    artist: "Beach Harmony",
    thumbnail: "https://placehold.co/640x360/FFA500/FFFFFF/png?text=Music+Video",
    duration: "3:59",
    views: "975K views"
  }
];

const playlists = [
  { id: "1", name: "Chill Vibes", tracksCount: 24 },
  { id: "2", name: "Workout Mix", tracksCount: 18 },
  { id: "3", name: "Focus Flow", tracksCount: 32 },
  { id: "4", name: "Party Starters", tracksCount: 15 }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // In a real implementation, we would call the YouTube Data API here
    console.log("Searching for:", query);
  };
  
  return (
    <Layout>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Stream. Vibe. Own Your Music.
          </h1>
          <p className="text-lg text-muted-foreground">
            BeatKlip gives you the freedom to enjoy music your way, with seamless
            audio and video streaming powered by YouTube.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Featured Tracks */}
        <section>
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Featured Tracks</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTracks.map(track => (
              <TrackCard
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist}
                thumbnail={track.thumbnail}
                duration={track.duration}
                views={track.views}
                onPlay={() => console.log(`Playing track: ${track.title}`)}
                onToggleAudioOnly={() => console.log(`Toggle audio-only for: ${track.title}`)}
                onAddToPlaylist={() => console.log(`Add to playlist: ${track.title}`)}
              />
            ))}
          </div>
        </section>
        
        {/* Your Playlists */}
        <section>
          <div className="flex items-center mb-4">
            <ListMusic size={20} className="mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Your Playlists</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {playlists.map(playlist => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                name={playlist.name}
                tracksCount={playlist.tracksCount}
                onPlay={() => console.log(`Playing playlist: ${playlist.name}`)}
              />
            ))}
            
            {/* Create Playlist Card */}
            <div className="rounded-lg border border-dashed border-border bg-card hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6 h-full aspect-square">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <ListMusic size={24} className="text-primary" />
              </div>
              <h3 className="font-medium">Create Playlist</h3>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Organize your favorite tracks
              </p>
            </div>
          </div>
        </section>
        
        {/* Recently Played */}
        <section>
          <div className="flex items-center mb-4">
            <History size={20} className="mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Recently Played</h2>
          </div>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {featuredTracks.map((track, index) => (
                <div key={index} className="playlist-item">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-muted-foreground">{index + 1}</span>
                  </div>
                  <img 
                    src={track.thumbnail} 
                    alt={track.title} 
                    className="w-10 h-10 rounded object-cover" 
                  />
                  <div className="flex-1 truncate">
                    <h4 className="font-medium truncate">{track.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
