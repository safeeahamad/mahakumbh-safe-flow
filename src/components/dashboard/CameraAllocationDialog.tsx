import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CameraAllocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cameraId: number;
  cameraName: string;
  currentAllocation?: {
    user_email: string;
    camera_name: string;
    location: string;
  };
}

const CameraAllocationDialog = ({ 
  isOpen, 
  onClose, 
  cameraId, 
  cameraName,
  currentAllocation 
}: CameraAllocationDialogProps) => {
  const [email, setEmail] = useState(currentAllocation?.user_email || '');
  const [location, setLocation] = useState(currentAllocation?.location || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAllocate = async () => {
    if (!email || !location) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('camera_allocations')
        .upsert({
          camera_id: cameraId,
          user_email: email.toLowerCase(),
          camera_name: cameraName,
          location: location,
          is_active: true
        }, {
          onConflict: 'camera_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Camera ${cameraId} allocated to ${email}`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('camera_allocations')
        .delete()
        .eq('camera_id', cameraId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Camera ${cameraId} allocation removed`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Allocate Camera {cameraId}</DialogTitle>
          <DialogDescription>
            Assign this camera to a user by their email address
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Main Entrance, Food Court"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {currentAllocation && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove Allocation
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAllocate} disabled={loading}>
              {loading ? 'Saving...' : 'Allocate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraAllocationDialog;
