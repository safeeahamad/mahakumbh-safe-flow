import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import DispatchTeamDialog from './DispatchTeamDialog';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  location: string;
  timestamp: Date;
}

const AlertPanel = () => {
  const [alerts, setAlerts] = React.useState<Alert[]>([
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
  const [dispatchDialogOpen, setDispatchDialogOpen] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);
  const { toast } = useToast();

  const handleResolveAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast({
      title: "Alert Resolved",
      description: `${alert?.message} has been marked as resolved`,
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast({
      title: "Alert Dismissed",
      description: "Alert has been dismissed",
      variant: "destructive",
    });
  };

  const handleDispatchTeam = (alert: Alert) => {
    setSelectedAlert(alert);
    setDispatchDialogOpen(true);
  };

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
    <>
      <Card className={cn(
        "border-border transition-all duration-300",
        alerts.some(a => a.type === 'critical') && "border-[hsl(var(--status-critical))] shadow-lg shadow-[hsl(var(--status-critical))]/20"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-5 w-5",
              alerts.some(a => a.type === 'critical') && "text-[hsl(var(--status-critical))] animate-pulse"
            )} />
            Active Alerts
            <Badge variant="secondary" className={cn(
              alerts.some(a => a.type === 'critical') && "bg-[hsl(var(--status-critical))] text-white"
            )}>
              {alerts.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-[hsl(var(--status-safe))]" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                  "bg-muted/30 border-border hover:border-primary/50 hover:shadow-md",
                  alert.type === 'critical' && "bg-[hsl(var(--status-critical))]/5 border-[hsl(var(--status-critical))]/30"
                )}
              >
                <div className={cn(
                  "h-2 w-2 rounded-full mt-2 flex-shrink-0 animate-pulse",
                  getAlertColor(alert.type)
                )} />
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-medium leading-tight">{alert.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{alert.location}</span>
                    <span>•</span>
                    <span>{formatTimestamp(alert.timestamp)}</span>
                  </div>
                  {(alert.type === 'critical' || alert.type === 'high') && (
                    <Button
                      size="sm"
                      onClick={() => handleDispatchTeam(alert)}
                      className="h-7 text-xs bg-[hsl(var(--status-critical))] hover:bg-[hsl(var(--status-critical))]/90"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Dispatch Team
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-[hsl(var(--status-safe))] hover:bg-[hsl(var(--status-safe))]/10"
                    onClick={() => handleResolveAlert(alert.id)}
                    title="Mark as resolved"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDismissAlert(alert.id)}
                    title="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {selectedAlert && (
        <DispatchTeamDialog
          open={dispatchDialogOpen}
          onOpenChange={setDispatchDialogOpen}
          alertLocation={selectedAlert.location}
          alertMessage={selectedAlert.message}
        />
      )}
    </>
  );
};

export default AlertPanel;
