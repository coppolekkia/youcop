import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { youtubeApi, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { ShareDialog } from '@/components/ShareDialog';

const VideoPlayer = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVideoDetails = async () => {
      if (!videoId) return;
      
      setLoading(true);
      try {
        const videoDetails = await youtubeApi.getVideoDetails(videoId);
        setVideo(videoDetails);
      } catch (error) {
        console.error('Error loading video details:', error);
        toast({
          title: "Error",
          description: "Failed to load video details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideoDetails();
  }, [videoId, toast]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="aspect-video bg-muted mb-4"></div>
          <div className="px-4 space-y-3">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Video not found</h2>
          <p className="text-muted-foreground mb-4">The video you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const videoDescription = video?.description?.slice(0, 160) || `Guarda "${video?.title}" di ${video?.channelTitle}`;
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });
  const highResThumb = video?.thumbnail?.replace('hqdefault', 'maxresdefault').replace('default', 'maxresdefault');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{video ? `${video.title}` : 'Caricamento...'}</title>
        <meta name="description" content={video?.title ? `Guarda "${video.title}" di ${video.channelTitle}. ${video.description || 'Video fantastico sulla nostra piattaforma.'}` : videoDescription} />
        
        {/* Rimuovi meta tag di default e sostituisci con quelli specifici del video */}
        <meta property="og:title" content={video?.title || 'Video Platform'} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:image" content={highResThumb || ''} />
        <meta property="og:image:alt" content={`Anteprima: ${video?.title || 'Video'}`} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="Video Platform" />
        <meta property="og:locale" content="it_IT" />
        
        {/* Video meta tags specifici */}
        <meta property="og:video" content={`https://www.youtube.com/watch?v=${videoId}`} />
        <meta property="og:video:url" content={`https://www.youtube.com/watch?v=${videoId}`} />
        <meta property="og:video:secure_url" content={`https://www.youtube.com/watch?v=${videoId}`} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        
        {/* Twitter/X Card tags specifici */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@VideoPlattform" />
        <meta name="twitter:creator" content={`@${video?.channelTitle?.replace(/\s+/g, '') || 'VideoPlattform'}`} />
        <meta name="twitter:title" content={video?.title || 'Video Platform'} />
        <meta name="twitter:description" content={videoDescription} />
        <meta name="twitter:image" content={highResThumb || ''} />
        <meta name="twitter:image:alt" content={`Anteprima del video: ${video?.title || 'Video'}`} />
        <meta name="twitter:player" content={`https://www.youtube.com/embed/${videoId}`} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        
        {/* Meta tag aggiuntivi per il SEO */}
        <meta name="author" content={video?.channelTitle || 'Video Platform'} />
        <meta property="article:author" content={video?.channelTitle || 'Video Platform'} />
        <meta property="article:published_time" content={video?.publishedAt || ''} />
        <meta property="video:duration" content={video?.duration || ''} />
        <meta property="video:release_date" content={video?.publishedAt || ''} />
        
        {/* URL canonico */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Preload immagine per migliorare le performance */}
        {video?.thumbnail && (
          <link rel="preload" as="image" href={video.thumbnail.replace('hqdefault', 'maxresdefault')} />
        )}
      </Helmet>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>

      {/* Video Player */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        <div className="aspect-video mb-4 sm:mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-lg sm:text-2xl font-bold leading-tight">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <p className="text-muted-foreground text-sm sm:text-base">
                {formatViews(video.viewCount)} • {timeAgo}
              </p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Like</span>
              </Button>
              <Button variant="outline" size="sm" className="px-2 sm:px-3">
                <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <ShareDialog 
                videoId={videoId!}
                videoTitle={video.title}
                videoThumbnail={video.thumbnail}
              />
              <Button variant="outline" size="sm" className="whitespace-nowrap hidden sm:flex">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" className="px-2 sm:px-3">
                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2">{video.channelTitle}</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Iscriviti per altri contenuti come questo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;