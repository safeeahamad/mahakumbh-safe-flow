import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Navigation, Users, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: {
    id: number;
    name: string;
    location: string;
    count: number;
    image?: string;
    videoUrl?: string;
  };
}

interface DetectedPerson {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RouteRecommendation {
  route: string;
  distance: string;
  crowdLevel: 'low' | 'moderate' | 'high';
  estimatedTime: string;
}

const CameraDetailModal: React.FC<CameraDetailModalProps> = ({ isOpen, onClose, camera }) => {
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Simulated AI detection
  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      setShowRoutes(false);
      
      // Simulate AI processing delay
      setTimeout(() => {
        // Generate random person detections
        const peopleCount = Math.floor(Math.random() * 15) + 5;
        const detected: DetectedPerson[] = [];
        
        for (let i = 0; i < peopleCount; i++) {
          detected.push({
            id: i,
            x: Math.random() * 80 + 5,
            y: Math.random() * 70 + 10,
            width: 3 + Math.random() * 2,
            height: 4 + Math.random() * 3,
          });
        }
        
        setDetectedPeople(detected);
        setAnalyzing(false);
        
        // Show route recommendations if crowd is high
        if (camera.count > 10000) {
          setShowRoutes(true);
        }
      }, 1500);
    }
  }, [isOpen, camera.count]);

  const densityLevel = camera.count > 12000 ? 'critical' : camera.count > 8000 ? 'high' : camera.count > 5000 ? 'moderate' : 'safe';
  
  const routes: RouteRecommendation[] = [
    {
      route: 'Via Gate 3 → Eastern Path',
      distance: '450m',
      crowdLevel: 'low',
      estimatedTime: '8 min'
    },
    {
      route: 'Via Service Road → Back Entrance',
      distance: '620m',
      crowdLevel: 'low',
      estimatedTime: '12 min'
    },
    {
      route: 'Via Parking Zone B → Side Gate',
      distance: '380m',
      crowdLevel: 'moderate',
      estimatedTime: '7 min'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{camera.name}</span>
              <Badge variant="destructive" className="gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="live-indicator animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Camera Feed with Detection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {camera.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={camera.videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img 
                      src={camera.image} 
                      alt={camera.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Person Detection Overlays */}
                  {!analyzing && detectedPeople.map((person) => (
                    <div
                      key={person.id}
                      className="absolute border-2 border-primary animate-pulse"
                      style={{
                        left: `${person.x}%`,
                        top: `${person.y}%`,
                        width: `${person.width}%`,
                        height: `${person.height}%`,
                      }}
                    >
                      <div className="absolute -top-5 left-0 bg-primary text-primary-foreground text-xs px-1 rounded">
                        Person
                      </div>
                    </div>
                  ))}

                  {analyzing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                        <p>AI Analyzing Feed...</p>
                      </div>
                    </div>
                  )}

                  {/* Location Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {camera.location}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Detection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-2xl font-bold font-mono">{detectedPeople.length}</p>
                    <p className="text-xs text-muted-foreground">Detected in Frame</p>
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "h-6 w-6 rounded-full mx-auto mb-1",
                      densityLevel === 'critical' && "bg-critical",
                      densityLevel === 'high' && "bg-high", 
                      densityLevel === 'moderate' && "bg-moderate",
                      densityLevel === 'safe' && "bg-safe"
                    )}></div>
                    <p className="text-2xl font-bold capitalize">{densityLevel}</p>
                    <p className="text-xs text-muted-foreground">Density Level</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-2xl font-bold font-mono">{camera.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total in Zone</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-2">AI Model: YOLOv8-Crowd Detection</p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((camera.count / 15000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-muted-foreground">{Math.min(Math.round((camera.count / 15000) * 100), 100)}% Capacity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Recommendations */}
          <div className="space-y-4">
            <Card className={cn(
              "border-2",
              showRoutes && "border-warning animate-pulse"
            )}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Alternate Routes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {showRoutes ? (
                  <>
                    <div className="bg-warning/10 border border-warning rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-warning flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        High Density Detected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI recommends using alternate routes to avoid congestion
                      </p>
                    </div>

                    {routes.map((route, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{route.route}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>📍 {route.distance}</span>
                                <span>⏱️ {route.estimatedTime}</span>
                              </div>
                            </div>
                            <Badge 
                              variant={route.crowdLevel === 'low' ? 'default' : 'secondary'}
                              className={cn(
                                route.crowdLevel === 'low' && "bg-safe",
                                route.crowdLevel === 'moderate' && "bg-moderate"
                              )}
                            >
                              {route.crowdLevel}
                            </Badge>
                          </div>
                          <Button size="sm" className="w-full" variant="outline">
                            Navigate
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Navigation className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No alternate routes needed</p>
                    <p className="text-xs mt-1">Current path is optimal</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Detection Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-mono font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="font-mono font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frame Rate:</span>
                  <span className="font-mono font-medium">30 FPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-mono font-medium">Live</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDetailModal;
