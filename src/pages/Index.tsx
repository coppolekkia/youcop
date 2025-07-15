import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { VideoCard } from '@/components/VideoCard';
import { youtubeApi, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const loadVideos = async (category: string, query?: string) => {
    setLoading(true);
    try {
      let fetchedVideos: YouTubeVideo[];
      
      if (query && query.trim()) {
        fetchedVideos = await youtubeApi.searchVideos(query);
      } else {
        fetchedVideos = await youtubeApi.getVideosByCategory(category);
      }
      
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(activeCategory, searchQuery);
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('All'); // Reset to All when searching
    loadVideos('All', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <main className="px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg mb-3 aspect-video"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                {...video}
              />
            ))}
          </div>
        )}
        
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'No videos found for your search.' : 'No videos found in this category.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
