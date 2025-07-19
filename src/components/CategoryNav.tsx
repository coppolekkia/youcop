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
    <div className="w-full border-b bg-background sticky top-[60px] sm:top-[68px] z-10">
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`whitespace-nowrap transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ${
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