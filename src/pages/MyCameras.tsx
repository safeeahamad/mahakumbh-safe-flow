import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserCameraStream from '@/components/dashboard/UserCameraStream';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MyCameras = () => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;

    const fetchAllocations = async () => {
      const { data } = await supabase
        .from('camera_allocations')
        .select('*')
        .eq('user_email', user.email.toLowerCase())
        .eq('is_active', true);

      setAllocations(data || []);
    };

    fetchAllocations();

    const channel = supabase
      .channel('camera_allocations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'camera_allocations',
          filter: `user_email=eq.${user.email.toLowerCase()}`
        },
        () => fetchAllocations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (allocations.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Camera Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have any cameras allocated to you yet. Contact an admin to get access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Camera Feeds</h1>
        <p className="text-muted-foreground">Manage your allocated camera streams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allocations.map((allocation) => (
          <UserCameraStream key={allocation.camera_id} allocation={allocation} />
        ))}
      </div>
    </div>
  );
};

export default MyCameras;
