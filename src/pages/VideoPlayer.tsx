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

  const currentUrl = `${window.location.origin}/video/${videoId}`;
  const videoDescription = video?.description || `Watch ${video?.title} on our platform`;
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{video ? `${video.title} - Video Platform` : 'Loading...'}</title>
        <meta name="description" content={videoDescription} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={video?.title || 'Video Platform'} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:image" content={video?.thumbnail || ''} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="Video Platform" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={video?.title || 'Video Platform'} />
        <meta name="twitter:description" content={videoDescription} />
        <meta name="twitter:image" content={video?.thumbnail || ''} />
        
        {/* Video specific meta tags */}
        {video && (
          <>
            <meta property="video:duration" content={video.duration} />
            <meta property="video:release_date" content={video.publishedAt} />
            <meta property="article:author" content={video.channelTitle} />
          </>
        )}
      </Helmet>
      {/* Header */}
      <div className="p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Video Player */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="aspect-video mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <p className="text-muted-foreground">
                {formatViews(video.viewCount)} • {timeAgo}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="w-4 h-4" />
              </Button>
              <ShareDialog 
                videoId={videoId!}
                videoTitle={video.title}
                videoThumbnail={video.thumbnail}
              />
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{video.channelTitle}</h3>
            <p className="text-muted-foreground">
              Subscribe for more content like this!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;