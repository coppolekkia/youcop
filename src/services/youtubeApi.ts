const YOUTUBE_API_KEY = 'AIzaSyCtRQnkh8_PMD5pM9WGwa84mNVXag5ItuA';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: number;
  duration: string;
  description: string;
  categoryId: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

// Mappa delle categorie YouTube
export const YOUTUBE_CATEGORIES = {
  'All': '',
  'Film & Animation': '1',
  'Autos & Vehicles': '2',
  'Music': '10',
  'Pets & Animals': '15',
  'Sports': '17',
  'Short Movies': '1',
  'Travel & Events': '19',
  'Gaming': '20',
  'Videoblogging': '22',
  'People & Blogs': '22',
  'Comedy': '23',
  'Entertainment': '24',
  'News & Politics': '25',
  'Howto & Style': '26',
  'Education': '27',
  'Science & Technology': '28',
  'Bellezza': '26' // Howto & Style include beauty content
};

class YouTubeApiService {
  private async fetchFromYouTube(endpoint: string, params: Record<string, string>) {
    const url = new URL(`${YOUTUBE_API_BASE_URL}/${endpoint}`);
    url.searchParams.append('key', YOUTUBE_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    return response.json();
  }

  private parseIsoDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private formatViewCount(viewCount: string): number {
    return parseInt(viewCount) || 0;
  }

  async getPopularVideos(categoryId?: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    try {
      const params: Record<string, string> = {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: 'IT',
        maxResults: maxResults.toString(),
      };

      if (categoryId) {
        params.videoCategoryId = categoryId;
      }

      const data = await this.fetchFromYouTube('videos', params);

      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        viewCount: this.formatViewCount(item.statistics.viewCount),
        duration: this.parseIsoDuration(item.contentDetails.duration),
        description: item.snippet.description,
        categoryId: item.snippet.categoryId,
      }));
    } catch (error) {
      console.error('Error fetching popular videos:', error);
      throw error;
    }
  }

  async searchVideos(query: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
    try {
      // Prima chiamata per cercare i video
      const searchParams = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order: 'relevance',
      };

      const searchData = await this.fetchFromYouTube('search', searchParams);
      
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Seconda chiamata per ottenere statistiche e durata
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const videoParams = {
        part: 'statistics,contentDetails',
        id: videoIds,
      };

      const videoData = await this.fetchFromYouTube('videos', videoParams);

      // Combina i dati
      return searchData.items.map((searchItem: any, index: number) => {
        const videoStats = videoData.items[index] || {};
        return {
          id: searchItem.id.videoId,
          title: searchItem.snippet.title,
          channelTitle: searchItem.snippet.channelTitle,
          publishedAt: searchItem.snippet.publishedAt,
          thumbnail: searchItem.snippet.thumbnails.medium?.url || searchItem.snippet.thumbnails.default?.url,
          viewCount: this.formatViewCount(videoStats.statistics?.viewCount || '0'),
          duration: this.parseIsoDuration(videoStats.contentDetails?.duration || 'PT0S'),
          description: searchItem.snippet.description,
          categoryId: searchItem.snippet.categoryId,
        };
      });
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  async getVideosByCategory(categoryName: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    const categoryId = YOUTUBE_CATEGORIES[categoryName as keyof typeof YOUTUBE_CATEGORIES];
    
    if (categoryName === 'All') {
      return this.getPopularVideos(undefined, maxResults);
    }
    
    return this.getPopularVideos(categoryId, maxResults);
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo> {
    try {
      const params = {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
      };

      const data = await this.fetchFromYouTube('videos', params);
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found');
      }

      const item = data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        viewCount: this.formatViewCount(item.statistics.viewCount),
        duration: this.parseIsoDuration(item.contentDetails.duration),
        description: item.snippet.description,
        categoryId: item.snippet.categoryId,
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }
}

export const youtubeApi = new YouTubeApiService();