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
    <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b bg-background sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="sm" className="p-2 sm:p-2">
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="flex items-center gap-1 sm:gap-2">
          <Video className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-lg sm:text-xl font-bold hidden xs:block">Puulp</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-2 sm:mx-8">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            placeholder="Cerca video..."
            value={localQuery}
            onChange={handleInputChange}
            className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 rounded-full border-border text-sm sm:text-base"
          />
          <Button 
            type="submit"
            size="sm" 
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="sm" className="p-2 hidden sm:flex">
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </header>
  );
}