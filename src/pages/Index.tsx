import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Video, Map, Bell } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto text-center p-8 space-y-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            Ujjain Mahakumbh 2025
          </h1>
          <p className="text-2xl text-muted-foreground">
            Smart Crowd Management System
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring and intelligent crowd management for large-scale public events.
            Monitor live camera feeds, track crowd density, and respond to alerts instantly.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <Video className="h-5 w-5 text-primary" />
            <span className="text-sm">Live Cameras</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <Map className="h-5 w-5 text-primary" />
            <span className="text-sm">Heatmap View</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <Bell className="h-5 w-5 text-primary" />
            <span className="text-sm">Real-time Alerts</span>
          </div>
        </div>

        <div className="pt-8">
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
            Access Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
