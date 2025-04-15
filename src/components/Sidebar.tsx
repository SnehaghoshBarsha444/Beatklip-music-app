
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Search, ListMusic, Download, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <Home size={20} />, text: "Home", path: "/" },
    { icon: <Search size={20} />, text: "Search", path: "/search" },
    { icon: <ListMusic size={20} />, text: "Playlists", path: "/playlists" },
    { icon: <Download size={20} />, text: "Downloads", path: "/downloads" },
    { icon: <User size={20} />, text: "Profile", path: "/profile" },
  ];

  // Mobile bottom navigation bar
  if (isMobile) {
    return (
      <>
        {/* Mobile slide-out menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-30 p-2 rounded-md bg-background border border-border">
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 pt-12">
            <div className="flex items-center gap-2 px-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient flex items-center justify-center">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">BeatKlip</h1>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-foreground/80 hover:text-primary hover:bg-muted transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto">
              <div className="px-3 py-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium mb-2">Need help?</h3>
                  <p className="text-sm text-muted-foreground">Learn how to use BeatKlip to organize and enjoy your music.</p>
                  <button className="mt-3 text-sm text-primary font-medium">Get Started</button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around z-20">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md text-foreground/80 hover:text-primary transition-all"
            >
              {item.icon}
              <span className="text-xs font-medium">{item.text}</span>
            </Link>
          ))}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="bg-card border-r border-border h-full w-60 py-6 px-3 flex flex-col">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-gradient flex items-center justify-center">
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gradient">BeatKlip</h1>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-foreground/80 hover:text-primary hover:bg-muted transition-all"
          >
            {item.icon}
            <span className="font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto">
        <div className="px-3 py-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">Learn how to use BeatKlip to organize and enjoy your music.</p>
            <button className="mt-3 text-sm text-primary font-medium">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
