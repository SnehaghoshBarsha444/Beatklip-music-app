
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import TrackCard from "@/components/TrackCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchVideos, getVideoDetails, formatDuration, formatViewCount } from "@/lib/youtube-api";
import { Loader2, Music, User, ListMusic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePlayer } from "@/context/PlayerContext";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const { toast } = useToast();
  const { playTrack, toggleAudioOnly } = usePlayer();
  const [isAudioOnlyMode, setIsAudioOnlyMode] = useState(true);
  
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch
  } = useQuery({
    queryKey: ['youtubeSearch', searchQuery],
    queryFn: () => searchVideos(searchQuery),
    enabled: !!searchQuery,
  });

  const videoIds = searchResults?.map(item => item.id.videoId).filter(Boolean) as string[] || [];

  const {
    data: videoDetails,
    isLoading: isDetailsLoading,
    error: detailsError
  } = useQuery({
    queryKey: ['videoDetails', videoIds],
    queryFn: () => getVideoDetails(videoIds),
    enabled: videoIds.length > 0,
  });

  useEffect(() => {
    if (searchError) {
      toast({
        title: "Search Error",
        description: "Failed to fetch search results. Please try again.",
        variant: "destructive",
      });
    }
    
    if (detailsError) {
      toast({
        title: "Error Loading Video Details",
        description: "Failed to fetch video details. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchError, detailsError, toast]);
  
  const handleSearch = (query: string) => {
    if (query !== searchQuery) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      refetchSearch();
    }
  };
  
  const handlePlay = (track) => {
    // Play the track using the PlayerContext
    playTrack(track);
    
    // Show a toast notification
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist}`,
    });
  };
  
  const handleToggleAudioOnly = (track) => {
    // Toggle audio-only mode for the track
    setIsAudioOnlyMode(!isAudioOnlyMode);
    playTrack({...track, audioOnly: !isAudioOnlyMode});
    toggleAudioOnly();
    
    toast({
      title: isAudioOnlyMode ? "Video mode enabled" : "Audio-only mode enabled",
      description: isAudioOnlyMode ? "Playing with video" : "Playing audio only to save data",
    });
  };
  
  // Combine search results with video details to create track data
  const tracks = searchResults?.map(item => {
    const videoId = item.id.videoId;
    const details = videoDetails?.find(v => v.id === videoId);
    
    return {
      id: videoId || '',
      videoId: videoId || '',
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
      views: details ? formatViewCount(details.statistics.viewCount) : '',
    };
  }) || [];
  
  // Improved categorization for better filtering
  const songTracks = tracks.filter(track => {
    const lowerTitle = track.title.toLowerCase();
    return (
      lowerTitle.includes('song') || 
      lowerTitle.includes('audio') ||
      lowerTitle.includes('music') || 
      lowerTitle.includes('official') ||
      lowerTitle.includes('lyric') ||
      lowerTitle.includes('ft.') || 
      lowerTitle.includes('feat') ||
      !lowerTitle.includes('playlist') &&
      !lowerTitle.includes('mix') &&
      !lowerTitle.includes('album')
    );
  });
  
  // Get unique artists for artist tab
  const uniqueArtists = [...new Map(tracks.map(track => 
    [track.artist, { name: track.artist, thumbnail: track.thumbnail }]
  )).values()];
  
  // Filter potential playlists (videos with "playlist" in the title)
  const playlistTracks = tracks.filter(track => {
    const lowerTitle = track.title.toLowerCase();
    return (
      lowerTitle.includes('playlist') ||
      lowerTitle.includes('album') ||
      lowerTitle.includes('mix') ||
      lowerTitle.includes('compilation')
    );
  });
  
  const isLoading = isSearchLoading || isDetailsLoading;
  
  const renderTracks = (tracksList) => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={36} className="animate-spin text-primary mb-4" />
          <div>Loading results...</div>
        </div>
      );
    }
    
    if (!tracksList || tracksList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No results found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground mt-2">Try searching for something else</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracksList.map(track => (
          <TrackCard
            key={track.id}
            id={track.id}
            title={track.title}
            artist={track.artist}
            thumbnail={track.thumbnail}
            duration={track.duration}
            views={track.views}
            videoId={track.videoId}
            onPlay={() => handlePlay(track)}
            onToggleAudioOnly={() => handleToggleAudioOnly(track)}
            onAddToPlaylist={() => console.log(`Add to playlist: ${track.title}`)}
          />
        ))}
      </div>
    );
  };
  
  const renderArtists = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={36} className="animate-spin text-primary mb-4" />
          <div>Loading results...</div>
        </div>
      );
    }
    
    if (!uniqueArtists || uniqueArtists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No artists found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground mt-2">Try searching for something else</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {uniqueArtists.map((artist, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
              <img 
                src={artist.thumbnail} 
                alt={artist.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="font-medium text-sm truncate max-w-full">{artist.name}</h3>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for music..." 
            initialQuery={searchQuery}
          />
        </div>
        
        {/* Results Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-1">
              All
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex items-center gap-1">
              <Music size={16} />
              Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-1">
              <User size={16} />
              Artists
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-1">
              <ListMusic size={16} />
              Playlists
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {renderTracks(tracks)}
          </TabsContent>
          
          <TabsContent value="songs" className="space-y-6">
            {renderTracks(songTracks)}
          </TabsContent>
          
          <TabsContent value="artists" className="space-y-6">
            {renderArtists()}
          </TabsContent>
          
          <TabsContent value="playlists" className="space-y-6">
            {renderTracks(playlistTracks)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SearchResults;
