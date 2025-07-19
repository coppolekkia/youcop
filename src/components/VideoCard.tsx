import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { YouTubeVideo } from '@/services/youtubeApi';

interface VideoCardProps extends YouTubeVideo {
  onClick?: () => void;
}

export function VideoCard({ 
  id, 
  title, 
  channelTitle, 
  publishedAt, 
  thumbnail, 
  viewCount, 
  duration, 
  onClick 
}: VideoCardProps) {
  const navigate = useNavigate();
  
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Naviga alla pagina del video
      navigate(`/video/${id}`);
    }
  };

  return (
    <div className="group cursor-pointer animate-fade-in" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg mb-2 sm:mb-3 bg-muted">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {duration && (
          <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black/80 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded">
            {duration}
          </div>
        )}
      </div>
      
      <div className="space-y-0.5 sm:space-y-1">
        <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">
          {channelTitle}
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {formatViews(viewCount)} • {timeAgo}
        </p>
      </div>
    </div>
  );
}