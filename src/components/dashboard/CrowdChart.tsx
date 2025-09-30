import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CrowdChart = () => {
  // Generate mock data for the last 24 hours
  const data = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() - 23 + i + 24) % 24;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      total: Math.floor(Math.random() * 3000) + 5000,
      gate1: Math.floor(Math.random() * 1000) + 1000,
      gate2: Math.floor(Math.random() * 1000) + 1000,
      temple: Math.floor(Math.random() * 1500) + 2000,
    };
  });

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Crowd Trends (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Total"
            />
            <Line 
              type="monotone" 
              dataKey="gate1" 
              stroke="hsl(var(--status-safe))" 
              strokeWidth={2}
              name="Gate 1"
            />
            <Line 
              type="monotone" 
              dataKey="gate2" 
              stroke="hsl(var(--status-moderate))" 
              strokeWidth={2}
              name="Gate 2"
            />
            <Line 
              type="monotone" 
              dataKey="temple" 
              stroke="hsl(var(--status-high))" 
              strokeWidth={2}
              name="Temple"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CrowdChart;
