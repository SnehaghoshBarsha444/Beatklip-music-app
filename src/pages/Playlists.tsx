
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PlaylistCard from "@/components/PlaylistCard";
import { Button } from "@/components/ui/button";
import { ListMusic, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(50, "Playlist name must be 50 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
});

// Mock data initial state
const initialPlaylists = [
  { id: "1", name: "Chill Vibes", tracksCount: 24 },
  { id: "2", name: "Workout Mix", tracksCount: 18 },
  { id: "3", name: "Focus Flow", tracksCount: 32 },
  { id: "4", name: "Party Starters", tracksCount: 15 },
  { id: "5", name: "Road Trip Playlist", tracksCount: 28 },
  { id: "6", name: "Acoustic Sessions", tracksCount: 12 },
  { id: "7", name: "90s Throwbacks", tracksCount: 20 }
];

const Playlists = () => {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreatePlaylist = (values: z.infer<typeof formSchema>) => {
    // Generate a unique ID (in a real app, this would come from the backend)
    const newId = (playlists.length + 1).toString();
    
    // Create the new playlist
    const newPlaylist = {
      id: newId,
      name: values.name,
      tracksCount: 0, // Start with 0 tracks
    };
    
    // Add the new playlist to the state
    setPlaylists([...playlists, newPlaylist]);
    
    // Show success notification
    toast({
      title: "Playlist created",
      description: `"${values.name}" has been created successfully.`,
    });
    
    // Reset the form
    form.reset();
    
    // Close the dialog
    setIsDialogOpen(false);
  };
  
  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
          <Button onClick={openCreateDialog}>
            <Plus size={18} className="mr-2" />
            Create Playlist
          </Button>
        </div>
        
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ListMusic size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">No playlists yet</h2>
            <p className="text-muted-foreground mb-4">
              Create a playlist to start organizing your favorite music.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus size={16} className="mr-2" />
              Create Your First Playlist
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            <div 
              className="rounded-lg border border-dashed border-border bg-card hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6 h-full aspect-square cursor-pointer"
              onClick={openCreateDialog}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus size={24} className="text-primary" />
              </div>
              <h3 className="font-medium">New Playlist</h3>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Create a new collection
              </p>
            </div>
          </div>
        )}
        
        {/* Create Playlist Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Give your playlist a name and optional description.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePlaylist)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Playlist Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Playlist" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be displayed as the title of your playlist.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="A collection of my favorite tracks" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add a short description to help you remember what this playlist is about.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Playlist</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Playlists;
