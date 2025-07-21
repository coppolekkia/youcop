import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { VideoCard } from '@/components/VideoCard';
import { VideoFilters, FilterOptions } from '@/components/VideoFilters';
import { youtubeApi, YouTubeVideo, YOUTUBE_CATEGORIES } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

interface CategoryVideos {
  category: string;
  categoryId: string;
  videos: YouTubeVideo[];
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [categoryVideos, setCategoryVideos] = useState<CategoryVideos[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'relevance',
    uploadDate: 'all',
    duration: 'all',
    viewCount: 'all'
  });
  const { toast } = useToast();

  // Categorie principali da mostrare in home
  const popularCategories = [
    'Music',
    'Gaming', 
    'Entertainment',
    'Sports',
    'Comedy',
    'Science & Technology',
    'News & Politics',
    'Education'
  ];

  const loadCategoryVideos = async () => {
    setLoading(true);
    try {
      const categoryPromises = popularCategories.map(async (category) => {
        try {
          const videos = await youtubeApi.getPopularVideos(YOUTUBE_CATEGORIES[category], 6);
          return {
            category,
            categoryId: YOUTUBE_CATEGORIES[category],
            videos: videos.slice(0, 6)
          };
        } catch (error) {
          console.error(`Error loading videos for category ${category}:`, error);
          return {
            category,
            categoryId: YOUTUBE_CATEGORIES[category],
            videos: []
          };
        }
      });

      const results = await Promise.all(categoryPromises);
      setCategoryVideos(results.filter(result => result.videos.length > 0));
    } catch (error) {
      console.error('Error loading category videos:', error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSearchVideos = async (query: string) => {
    setLoading(true);
    try {
      const searchResults = await youtubeApi.searchVideos(query);
      setCategoryVideos([{
        category: 'Search Results',
        categoryId: '',
        videos: searchResults
      }]);
    } catch (error) {
      console.error('Error searching videos:', error);
      toast({
        title: "Error", 
        description: "Failed to search videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      loadSearchVideos(searchQuery);
    } else {
      loadCategoryVideos();
    }
  }, [searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('All'); // Reset to All when searching
  };

  const handleViewAll = (category: string) => {
    setExpandedCategories(prev => [...prev, category]);
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

  const totalVideos = useMemo(() => {
    return categoryVideos.reduce((total, category) => total + category.videos.length, 0);
  }, [categoryVideos]);

  // Filtra le categorie quando c'è una ricerca attiva
  const displayCategories = useMemo(() => {
    if (searchQuery.trim()) {
      return categoryVideos;
    }
    
    // Se non c'è ricerca, mostra tutte le categorie caricate
    return categoryVideos;
  }, [categoryVideos, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Video Platform - I Video Più Visti del Giorno</title>
        <meta name="description" content="Scopri i video più popolari di oggi divisi per categoria: Musica, Gaming, Intrattenimento, Sport e molto altro!" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Video Platform - I Video Più Visti del Giorno" />
        <meta property="og:description" content="Scopri i video più popolari di oggi divisi per categoria: Musica, Gaming, Intrattenimento, Sport e molto altro!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Video Platform" />
        <meta property="og:locale" content="it_IT" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@VideoPlatform" />
        <meta name="twitter:title" content="Video Platform - I Video Più Visti del Giorno" />
        <meta name="twitter:description" content="Scopri i video più popolari di oggi divisi per categoria: Musica, Gaming, Intrattenimento, Sport e molto altro!" />
      </Helmet>
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      {!searchQuery && (
        <CategoryNav 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      {/* Video Filters */}
      <VideoFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        totalVideos={totalVideos}
      />
      
      <main className="px-3 sm:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="space-y-8">
            {/* Loading skeleton per categorie */}
            {Array.from({ length: 4 }).map((_, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, videoIndex) => (
                    <div key={videoIndex} className="animate-pulse">
                      <div className="bg-muted rounded-lg mb-2 sm:mb-3 aspect-video"></div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-2 sm:h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {displayCategories.map((categoryData) => (
              <section key={categoryData.category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    {searchQuery ? 'Risultati della ricerca' : `Video più visti in ${categoryData.category}`}
                  </h2>
                  {!searchQuery && categoryData.videos.length === 6 && !expandedCategories.includes(categoryData.category) && (
                    <button 
                      onClick={() => handleViewAll(categoryData.category)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Vedi tutti
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {categoryData.videos
                    .slice(0, expandedCategories.includes(categoryData.category) ? undefined : 6)
                    .map((video) => (
                    <VideoCard
                      key={video.id}
                      {...video}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
        
        {!loading && displayCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'Nessun video trovato per la tua ricerca.' : 'Nessun video trovato.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
