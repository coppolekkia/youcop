import { useState } from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  'All',
  'Film & Animation',
  'Autos & Vehicles', 
  'Music',
  'Pets & Animals',
  'Sports',
  'Short Movies',
  'Travel & Events',
  'Gaming',
  'Videoblogging',
  'People & Blogs',
  'Comedy',
  'Entertainment',
  'News & Politics',
  'Howto & Style',
  'Education',
  'Science & Technology'
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="w-full border-b bg-background sticky top-0 z-10">
      <div className="flex gap-3 px-6 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`whitespace-nowrap transition-all duration-200 ${
              activeCategory === category 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}