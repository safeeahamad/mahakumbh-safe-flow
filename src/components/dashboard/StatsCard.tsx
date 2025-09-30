import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  status?: 'safe' | 'moderate' | 'high' | 'critical';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, status }) => {
  const statusColors = {
    safe: 'text-[hsl(var(--status-safe))]',
    moderate: 'text-[hsl(var(--status-moderate))]',
    high: 'text-[hsl(var(--status-high))]',
    critical: 'text-[hsl(var(--status-critical))]',
  };

  return (
    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn(
              "text-3xl font-bold",
              status && statusColors[status]
            )}>
              {value}
            </p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            status ? `bg-[hsl(var(--status-${status}))] bg-opacity-10` : "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              status ? statusColors[status] : "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
