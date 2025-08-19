import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { VideoCard } from '@/components/VideoCard';
import { VideoFilters, FilterOptions } from '@/components/VideoFilters';
import { youtubeApi, YouTubeVideo } from '@/services/youtubeApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Crown } from 'lucide-react';

export default function Beauty() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    duration: 'all',
    viewCount: 'all',
    uploadDate: 'all',
    sortBy: 'relevance'
  });

  const loadBeautyVideos = async () => {
    setLoading(true);
    try {
      let fetchedVideos: YouTubeVideo[] = [];
      
      if (searchQuery.trim()) {
        // Search with beauty-related terms
        const beautyQuery = `${searchQuery} bellezza trucco makeup skincare`;
        fetchedVideos = await youtubeApi.searchVideos(beautyQuery, 50);
      } else {
        // Load from Howto & Style category with beauty keywords
        const [styleVideos, beautySearchResults] = await Promise.all([
          youtubeApi.getVideosByCategory('Howto & Style', 25),
          youtubeApi.searchVideos('bellezza trucco makeup skincare tutorial', 25)
        ]);
        
        // Combine and deduplicate
        const allVideos = [...styleVideos, ...beautySearchResults];
        const uniqueVideos = allVideos.filter((video, index, self) => 
          index === self.findIndex(v => v.id === video.id)
        );
        
        fetchedVideos = uniqueVideos;
      }
      
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error loading beauty videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeautyVideos();
  }, [searchQuery]);

  const applyFilters = (videoList: YouTubeVideo[]): YouTubeVideo[] => {
    let filtered = [...videoList];

    // Filter by duration
    if (filters.duration !== 'all') {
      filtered = filtered.filter(video => {
        const [minutes] = video.duration.split(':').map(Number);
        const totalMinutes = minutes || 0;
        
        switch (filters.duration) {
          case 'short': return totalMinutes <= 4;
          case 'medium': return totalMinutes > 4 && totalMinutes <= 20;
          case 'long': return totalMinutes > 20;
          default: return true;
        }
      });
    }

    // Filter by view count
    if (filters.viewCount !== 'all') {
      filtered = filtered.filter(video => {
        switch (filters.viewCount) {
          case 'low': return video.viewCount < 100000;
          case 'medium': return video.viewCount >= 100000 && video.viewCount < 1000000;
          case 'high': return video.viewCount >= 1000000;
          default: return true;
        }
      });
    }

    // Filter by upload date
    if (filters.uploadDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter(video => {
        const uploadDate = new Date(video.publishedAt);
        const diffTime = now.getTime() - uploadDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        
        switch (filters.uploadDate) {
          case 'hour': return diffHours <= 1;
          case 'today': return diffDays <= 1;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case 'year': return diffDays <= 365;
          default: return true;
        }
      });
    }

    // Sort videos
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'mostViewed':
          return b.viewCount - a.viewCount;
        case 'leastViewed':
          return a.viewCount - b.viewCount;
        case 'relevance':
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      duration: 'all',
      viewCount: 'all',
      uploadDate: 'all',
      sortBy: 'relevance'
    });
  };

  const filteredVideos = useMemo(() => applyFilters(videos), [videos, filters]);

  return (
    <>
      <Helmet>
        <title>Beauty & Makeup - Tutorial e Consigli di Bellezza</title>
        <meta name="description" content="Scopri i migliori tutorial di bellezza, trucco e skincare. Consigli di makeup, routine di cura della pelle e tendenze beauty." />
        <meta name="keywords" content="bellezza, makeup, trucco, skincare, tutorial, beauty, cosmetici, cura della pelle" />
        <link rel="canonical" href="/beauty" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-beauty-secondary via-background to-beauty-accent/30">
        <Header onSearch={handleSearch} searchQuery={searchQuery} />
        
        {/* Beauty Hero Section */}
        <div className="bg-beauty-gradient text-beauty-primary-foreground py-8 px-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute top-8 right-8 animate-pulse delay-1000">
              <Heart className="h-8 w-8" />
            </div>
            <div className="absolute bottom-4 left-1/3 animate-pulse delay-500">
              <Crown className="h-7 w-7" />
            </div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-beauty-primary-foreground bg-clip-text">
              💄 Beauty & Makeup
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto mb-6">
              Scopri i migliori tutorial di bellezza, consigli di makeup e routine di skincare per valorizzare la tua naturale bellezza ✨
            </p>
            <a 
              href="https://amzn.to/45Hdhoc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform duration-300"
            >
              <img 
                src="/lovable-uploads/a5136b04-66fa-4708-a588-8a4c3bf1de64.png" 
                alt="Sconti prodotti bellezza - La tua routine di bellezza a prezzo speciale"
                className="max-w-md mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </a>
          </div>
        </div>

        {/* Filters Section */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-beauty-accent/50">
          <div className="px-3 sm:px-6 py-4">
            <VideoFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalVideos={filteredVideos.length}
            />
          </div>
        </div>

        {/* Content */}
        <main className="px-3 sm:px-6 py-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <Heart className="h-16 w-16 mx-auto text-beauty-primary opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nessun video trovato
              </h3>
              <p className="text-muted-foreground mb-6">
                Prova a modificare i filtri o la ricerca per trovare più contenuti di bellezza
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="border-beauty-primary text-beauty-primary hover:bg-beauty-primary hover:text-beauty-primary-foreground"
              >
                Cancella filtri
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}