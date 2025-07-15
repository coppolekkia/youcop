import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { VideoCard } from '@/components/VideoCard';
import { mockVideos } from '@/data/mockVideos';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') {
      return mockVideos;
    }
    return mockVideos.filter(video => video.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <main className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              creator={video.creator}
              views={video.views}
              uploadedAt={video.uploadedAt}
              thumbnail={video.thumbnail}
              duration={video.duration}
            />
          ))}
        </div>
        
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No videos found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
