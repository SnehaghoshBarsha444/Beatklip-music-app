
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MusicPlayer from "./MusicPlayer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
  showPlayer?: boolean;
}

const Layout = ({ children, showPlayer = true }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className={`flex-1 overflow-auto ${isMobile ? 'pb-40' : 'pb-24'}`}>
        <div className={`container py-6 ${isMobile ? 'pt-16' : ''}`}>
          {children}
        </div>
      </main>
      
      {showPlayer && <MusicPlayer />}
    </div>
  );
};

export default Layout;
