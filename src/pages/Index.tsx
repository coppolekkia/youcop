import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { VideoCard } from '@/components/VideoCard';
import { VideoFilters, FilterOptions } from '@/components/VideoFilters';
import { youtubeApi, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'relevance',
    uploadDate: 'all',
    duration: 'all',
    viewCount: 'all'
  });
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

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'relevance',
      uploadDate: 'all',
      duration: 'all',
      viewCount: 'all'
    });
  };

  // Helper function to parse duration string to minutes
  const parseDurationToMinutes = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) + parseInt(parts[1]) / 60;
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 60;
    }
    return 0;
  };

  // Apply filters to videos
  const filteredVideos = useMemo(() => {
    if (!videos.length) return videos;

    let filtered = [...videos];

    // Apply upload date filter
    if (filters.uploadDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.uploadDate) {
        case 'hour':
          filterDate.setHours(now.getHours() - 1);
          break;
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(video => 
        new Date(video.publishedAt) >= filterDate
      );
    }

    // Apply duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(video => {
        const minutes = parseDurationToMinutes(video.duration || '0:00');
        switch (filters.duration) {
          case 'short':
            return minutes < 4;
          case 'medium':
            return minutes >= 4 && minutes <= 20;
          case 'long':
            return minutes > 20;
          default:
            return true;
        }
      });
    }

    // Apply view count filter
    if (filters.viewCount !== 'all') {
      filtered = filtered.filter(video => {
        const views = video.viewCount || 0;
        switch (filters.viewCount) {
          case 'low':
            return views < 100000;
          case 'medium':
            return views >= 100000 && views <= 1000000;
          case 'high':
            return views > 1000000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'mostViewed':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'leastViewed':
        filtered.sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [videos, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <VideoFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        totalVideos={filteredVideos.length}
      />
      
      <main className="px-3 sm:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg mb-2 sm:mb-3 aspect-video"></div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-2 sm:h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                {...video}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredVideos.length === 0 && (
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
