import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Zone {
  id: string;
  name: string;
  capacity: number;
  current: number;
  status: 'safe' | 'moderate' | 'high' | 'critical';
  x: number;
  y: number;
}

const Heatmap = () => {
  const zones: Zone[] = [
    { id: '1', name: 'Gate 1', capacity: 15000, current: 12340, status: 'high', x: 20, y: 10 },
    { id: '2', name: 'Gate 2', capacity: 15000, current: 10580, status: 'moderate', x: 80, y: 10 },
    { id: '3', name: 'Temple', capacity: 20000, current: 15920, status: 'high', x: 50, y: 35 },
    { id: '4', name: 'Parking A', capacity: 10000, current: 6992, status: 'moderate', x: 15, y: 60 },
    { id: '5', name: 'Parking B', capacity: 10000, current: 5430, status: 'safe', x: 85, y: 60 },
    { id: '6', name: 'Food Court', capacity: 5000, current: 3210, status: 'moderate', x: 50, y: 75 },
  ];

  const getStatusColor = (status: Zone['status']) => {
    switch (status) {
      case 'safe':
        return 'bg-[hsl(var(--status-safe))]';
      case 'moderate':
        return 'bg-[hsl(var(--status-moderate))]';
      case 'high':
        return 'bg-[hsl(var(--status-high))]';
      case 'critical':
        return 'bg-[hsl(var(--status-critical))]';
    }
  };

  const getPercentage = (zone: Zone) => {
    return Math.round((zone.current / zone.capacity) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Crowd Density Map</CardTitle>
              <Badge variant="secondary">Auto-refresh: 5s</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg border border-border overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-border"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-border"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Zones */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                >
                  <div className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center transition-all",
                    "group-hover:scale-110",
                    getStatusColor(zone.status),
                    "bg-opacity-40 backdrop-blur-sm border-2 border-white/20"
                  )}>
                    <div className="text-center">
                      <p className="text-xs font-bold text-white">{zone.name}</p>
                      <p className="text-lg font-bold text-white">{getPercentage(zone)}%</p>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <p className="text-sm font-semibold">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {zone.current.toLocaleString()} / {zone.capacity.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(var(--status-safe))]" />
                <span className="text-xs">Safe (0-30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(var(--status-moderate))]" />
                <span className="text-xs">Moderate (31-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(var(--status-high))]" />
                <span className="text-xs">High (61-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[hsl(var(--status-critical))]" />
                <span className="text-xs">Critical (81-100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Zone Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{zone.name}</span>
                  <Badge variant="secondary" className={cn("text-xs", getStatusColor(zone.status))}>
                    {getPercentage(zone)}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={cn("h-full transition-all", getStatusColor(zone.status))}
                    style={{ width: `${getPercentage(zone)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{zone.current.toLocaleString()}</span>
                  <span>{zone.capacity.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Heatmap;
