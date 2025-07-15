import { Search, Menu, Video, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Video className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Puulp</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            placeholder="Search videos..."
            value={localQuery}
            onChange={handleInputChange}
            className="w-full pl-4 pr-12 py-2 rounded-full border-border"
          />
          <Button 
            type="submit"
            size="sm" 
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}