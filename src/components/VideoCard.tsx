import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  id: string;
  title: string;
  creator: string;
  views: number;
  uploadedAt: Date;
  thumbnail: string;
  duration?: string;
}

export function VideoCard({ title, creator, views, uploadedAt, thumbnail, duration }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const timeAgo = formatDistanceToNow(uploadedAt, { addSuffix: true });

  return (
    <div className="group cursor-pointer animate-fade-in">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-muted">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {creator}
        </p>
        <p className="text-muted-foreground text-sm">
          {formatViews(views)} • {timeAgo}
        </p>
      </div>
    </div>
  );
}