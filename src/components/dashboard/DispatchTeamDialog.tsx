import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DispatchTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertLocation: string;
  alertMessage: string;
}

const teamLeads = [
  { id: '1', name: 'Gaurav Singh', phone: '+91-7394028088', zone: 'Emergency Response Team' },
  { id: '2', name: 'Rajesh Kumar', phone: '+91-98765-43210', zone: 'North Gate' },
  { id: '3', name: 'Priya Sharma', phone: '+91-98765-43211', zone: 'Main Temple' },
  { id: '4', name: 'Amit Patel', phone: '+91-98765-43212', zone: 'South Entrance' },
  { id: '5', name: 'Lakshmi Reddy', phone: '+91-98765-43213', zone: 'Parking Zones' },
];

const DispatchTeamDialog = ({ open, onOpenChange, alertLocation, alertMessage }: DispatchTeamDialogProps) => {
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState(false);
  const { toast } = useToast();

  const handleDispatch = () => {
    if (!selectedLead) {
      toast({
        title: "Error",
        description: "Please select a team lead",
        variant: "destructive",
      });
      return;
    }

    setIsDispatching(true);
    const lead = teamLeads.find(l => l.id === selectedLead);
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Emergency Team Dispatched', {
        body: `${lead?.name} dispatched to ${alertLocation}`,
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Emergency Team Dispatched', {
            body: `${lead?.name} dispatched to ${alertLocation}`,
            icon: '/favicon.ico',
            requireInteraction: true,
          });
        }
      });
    }
    
    // Simulate dispatch notification
    setTimeout(() => {
      toast({
        title: "Team Dispatched Successfully",
        description: `${lead?.name} has been notified via call and SMS. En route to ${alertLocation}`,
      });
      setIsDispatching(false);
      onOpenChange(false);
      setSelectedLead('');
    }, 1500);
  };

  const handleCall = () => {
    if (!selectedLead) {
      toast({
        title: "Error",
        description: "Please select a team lead to call",
        variant: "destructive",
      });
      return;
    }

    const lead = teamLeads.find(l => l.id === selectedLead);
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Emergency Call Initiated', {
        body: `Calling ${lead?.name} at ${lead?.phone}`,
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Emergency Call Initiated', {
            body: `Calling ${lead?.name} at ${lead?.phone}`,
            icon: '/favicon.ico',
          });
        }
      });
    }
    
    // Initiate actual call
    const phoneNumber = lead?.phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${phoneNumber}`;
    
    toast({
      title: "Call Initiated",
      description: `Calling ${lead?.name} at ${lead?.phone}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[hsl(var(--status-critical))]">
            <Phone className="h-5 w-5" />
            Dispatch Emergency Team
          </DialogTitle>
          <DialogDescription>
            Select a team lead to dispatch to the incident location
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted border border-border">
              <MapPin className="h-4 w-4 mt-0.5 text-[hsl(var(--status-critical))]" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Alert Location</p>
                <p className="text-sm text-muted-foreground">{alertLocation}</p>
                <p className="text-xs text-muted-foreground mt-2">{alertMessage}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-lead">Select Team Lead</Label>
            <Select value={selectedLead} onValueChange={setSelectedLead}>
              <SelectTrigger id="team-lead">
                <SelectValue placeholder="Choose a team lead" />
              </SelectTrigger>
              <SelectContent>
                {teamLeads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.zone} • {lead.phone}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-1"
              disabled={!selectedLead || isDispatching}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Lead
            </Button>
            <Button
              onClick={handleDispatch}
              className="flex-1 bg-[hsl(var(--status-critical))] hover:bg-[hsl(var(--status-critical))]/90"
              disabled={!selectedLead || isDispatching}
            >
              {isDispatching ? 'Dispatching...' : 'Dispatch Team'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchTeamDialog;
