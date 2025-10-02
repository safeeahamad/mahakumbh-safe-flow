import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Maximize2, Pause, Play } from 'lucide-react';

interface CameraFeedProps {
  name: string;
  location: string;
  crowdCount: number;
  image?: string;
  videoUrl?: string;
  isLive?: boolean;
  onExpand?: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
  name, 
  location, 
  crowdCount, 
  image,
  videoUrl,
  isLive = true,
  onExpand
}) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  React.useEffect(() => {
    // Auto-play video when it loads
    if (videoRef.current && videoUrl) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, [videoUrl]);

  const hasVideoFeed = videoUrl || (isLive && image);
  const showOfflineState = !videoUrl && !image;

  return (
    <Card className="overflow-hidden border-border group hover:border-primary/50 transition-colors cursor-pointer" onClick={onExpand}>
      <div className="relative aspect-video bg-black">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            loop
            muted
            autoPlay
            playsInline
          />
        ) : image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm mb-2">No Stream Available</div>
              <Badge variant="secondary">Offline</Badge>
            </div>
          </div>
        )}
        
        {isLive && hasVideoFeed && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="gap-1 px-2 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </div>
        )}

        {!isLive && !showOfflineState && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="gap-1 px-2">
              Offline
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {videoUrl && (
            <Button 
              size="icon" 
              variant="secondary"
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
              onClick={togglePlayPause}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          )}
          {hasVideoFeed && (
            <Button 
              size="icon" 
              variant="secondary"
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                onExpand?.();
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-white font-medium text-sm">{name}</p>
          <p className="text-white/70 text-xs">{location}</p>
        </div>
      </div>

      <CardContent className="p-3 bg-card">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current Count</span>
          <span className="text-sm font-bold font-mono">{crowdCount.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
