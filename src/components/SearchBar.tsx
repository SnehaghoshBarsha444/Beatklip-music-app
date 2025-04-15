
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
}

const SearchBar = ({ 
  onSearch = () => {}, 
  placeholder = "Search for songs, artists, or music...",
  initialQuery = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Call the onSearch callback
      onSearch(query);
      
      // Navigate to search results page with the query parameter
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
  };
  
  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-12 py-6 rounded-full bg-muted text-foreground"
        />
        {query && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute right-2"
            onClick={clearSearch}
          >
            <X size={18} />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
