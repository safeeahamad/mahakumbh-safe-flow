import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CrowdMap from '@/components/dashboard/CrowdMap';

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
      {/* Title Bar */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Live Crowd Heatmap</h1>
        <p className="text-muted-foreground">Real-time AI-powered crowd density analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Map */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interactive Crowd Density Map</CardTitle>
              <Badge variant="secondary">Auto-refresh: 5s</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              <CrowdMap />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-xs">High Density (81-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-xs">Medium Density (51-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs">Low Density (0-50%)</span>
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
