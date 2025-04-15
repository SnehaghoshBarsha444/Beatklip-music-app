const YOUTUBE_API_KEY = 'AIzaSyDheaRladZLWCq-7ikfa34BBrIYeuJgAeA';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeSearchResult {
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
  };
  contentDetails: {
    duration: string; // ISO 8601 format
    dimension: string;
    definition: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}

// Search for videos based on a query, focusing on music content
export const searchVideos = async (query: string, maxResults = 20): Promise<YouTubeSearchResult[]> => {
  try {
    // Enhance query with music-specific keywords if not already present
    const musicKeywords = ['song', 'music', 'audio', 'lyrics', 'instrumental'];
    let musicQuery = query;
    
    // Only append music keywords if the query doesn't already contain them
    const containsMusicKeyword = musicKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!containsMusicKeyword) {
      musicQuery = `${query} music`;
    }
    
    // Use videoCategoryId=10 to restrict to Music category
    const url = `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(musicQuery)}&type=video&videoCategoryId=10&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch YouTube data');
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
};

// Get detailed information for specific videos
export const getVideoDetails = async (videoIds: string[]): Promise<YouTubeVideoDetails[]> => {
  try {
    const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch video details');
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

// Parse ISO 8601 duration to formatted string (PT1H2M3S to 1:02:03)
export const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count to readable format (e.g., 1234567 to 1.2M)
export const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  }
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  
  return `${count} views`;
};

// Add a video to "offline" storage (stored in localStorage)
export const addToOfflineLibrary = (videoId: string, videoDetails: YouTubeVideoDetails): void => {
  try {
    const offlineLibrary = JSON.parse(localStorage.getItem('offlineLibrary') || '{}');
    
    offlineLibrary[videoId] = {
      id: videoId,
      title: videoDetails.snippet.title,
      artist: videoDetails.snippet.channelTitle,
      thumbnail: videoDetails.snippet.thumbnails.medium.url,
      duration: formatDuration(videoDetails.contentDetails.duration),
      addedAt: new Date().toISOString()
    };
    
    localStorage.setItem('offlineLibrary', JSON.stringify(offlineLibrary));
  } catch (error) {
    console.error('Error adding video to offline library:', error);
  }
};

// Get all videos saved for offline
export const getOfflineLibrary = () => {
  try {
    return JSON.parse(localStorage.getItem('offlineLibrary') || '{}');
  } catch (error) {
    console.error('Error retrieving offline library:', error);
    return {};
  }
};

// Check if a video is saved for offline
export const isVideoOffline = (videoId: string): boolean => {
  const offlineLibrary = getOfflineLibrary();
  return !!offlineLibrary[videoId];
};

// Remove a video from offline storage
export const removeFromOfflineLibrary = (videoId: string): void => {
  try {
    const offlineLibrary = getOfflineLibrary();
    
    if (offlineLibrary[videoId]) {
      delete offlineLibrary[videoId];
      localStorage.setItem('offlineLibrary', JSON.stringify(offlineLibrary));
    }
  } catch (error) {
    console.error('Error removing video from offline library:', error);
  }
};
