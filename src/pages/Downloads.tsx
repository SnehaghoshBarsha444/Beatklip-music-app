
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Download, Music, Play, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getOfflineLibrary, removeFromOfflineLibrary } from "@/lib/youtube-api";

interface OfflineTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  addedAt: string;
}

const Downloads = () => {
  const [downloadedTracks, setDownloadedTracks] = useState<OfflineTrack[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadDownloadedTracks();
    calculateStorageUsage();
  }, []);

  const loadDownloadedTracks = () => {
    const library = getOfflineLibrary();
    const tracks = Object.values(library) as OfflineTrack[];
    setDownloadedTracks(tracks.sort((a, b) => 
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    ));
  };

  const calculateStorageUsage = () => {
    // This is a mock calculation - in a real app, you'd calculate actual storage usage
    const mockUsedStorage = Math.floor(Math.random() * 75); // Random number between 0-75%
    setStorageUsed(mockUsedStorage);
  };

  const handlePlay = (trackId: string) => {
    // In a real app, this would play the locally downloaded file
    console.log("Playing downloaded track:", trackId);
  };

  const handleDelete = (trackId: string) => {
    removeFromOfflineLibrary(trackId);
    loadDownloadedTracks();
    toast({
      title: "Track removed",
      description: "The track has been removed from your downloads",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Downloads</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Database size={16} />
            Manage Storage
          </Button>
        </div>
        
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Storage Used</span>
              <span className="font-medium">{storageUsed}%</span>
            </div>
            <Progress value={storageUsed} className="h-2" />
          </div>
        </Card>
        
        {downloadedTracks.length > 0 ? (
          <div className="space-y-4">
            {downloadedTracks.map((track) => (
              <Card key={track.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    <img 
                      src={track.thumbnail} 
                      alt={track.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{track.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(track.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handlePlay(track.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Play size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(track.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Music size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Downloads Yet</h3>
            <p className="text-muted-foreground mb-6">
              Your downloaded tracks will appear here for offline listening
            </p>
            <Button>Explore Music</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Downloads;
