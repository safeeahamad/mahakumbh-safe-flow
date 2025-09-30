import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  location: string;
  timestamp: Date;
}

const AlertPanel = () => {
  const [alerts] = React.useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      message: 'Gate 1 has exceeded 85% capacity',
      location: 'Gate 1 - North Entrance',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: '2',
      type: 'high',
      message: 'Rapid influx detected - 500+ people in 5 minutes',
      location: 'Main Temple Area',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '3',
      type: 'medium',
      message: 'Camera 3 connection unstable',
      location: 'Parking Zone B',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
    },
  ]);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-[hsl(var(--status-critical))]';
      case 'high':
        return 'bg-[hsl(var(--status-high))]';
      case 'medium':
        return 'bg-[hsl(var(--status-moderate))]';
      case 'low':
        return 'bg-[hsl(var(--status-safe))]';
    }
  };

  const formatTimestamp = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <Card className={cn(
      "border-border",
      alerts.some(a => a.type === 'critical') && "border-[hsl(var(--status-critical))] alert-critical"
    )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Active Alerts
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
          >
            <div className={cn("h-2 w-2 rounded-full mt-2 flex-shrink-0", getAlertColor(alert.type))} />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{alert.location}</span>
                <span>•</span>
                <span>{formatTimestamp(alert.timestamp)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-[hsl(var(--status-safe))]">
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
