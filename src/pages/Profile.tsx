import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserCircle, Music, Clock, Settings, LogOut, Heart,
  Headphones, Database, Bell, Shield, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const stats = [
    { icon: <Heart size={20} />, text: "Liked Songs", count: 27 },
    { icon: <Clock size={20} />, text: "Recently Played", count: 18 },
    { icon: <Music size={20} />, text: "My Playlists", count: 4 },
    { icon: <Headphones size={20} />, text: "Offline Tracks", count: 12 },
  ];

  const settingsLinks = [
    { icon: <Bell size={20} />, text: "Notifications", action: "Manage" },
    { icon: <Database size={20} />, text: "Storage", action: "45% Used" },
    { icon: <Shield size={20} />, text: "Privacy", action: "Review" },
    { icon: <HelpCircle size={20} />, text: "Help & Support", action: "Contact" },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              <UserCircle size={64} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Free Plan
            </div>
          </div>
          <div className="md:ml-auto">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Storage Usage */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Storage</h2>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used Storage</span>
                <span>{profile?.storage_used}% of {profile?.total_storage}</span>
              </div>
              <Progress value={profile?.storage_used} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Music Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Music</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((item, idx) => (
              <Card key={idx} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.text}</h3>
                    <p className="text-sm text-muted-foreground">{item.count} items</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Card className="divide-y divide-border">
            {settingsLinks.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </div>
                <Button variant="ghost" size="sm">{item.action}</Button>
              </div>
            ))}
          </Card>
        </div>
        
        {/* Sign Out */}
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
            onClick={signOut}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
