import React, { useEffect } from 'react';
import CameraFeed from '@/components/dashboard/CameraFeed';
import CameraDetailModal from '@/components/dashboard/CameraDetailModal';
import VideoUploadDialog from '@/components/dashboard/VideoUploadDialog';
import CameraAllocationDialog from '@/components/dashboard/CameraAllocationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3x3, LayoutGrid, Upload, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import cameraFeed1 from '@/assets/camera-feed-1.jpg';
import cameraFeed2 from '@/assets/camera-feed-2.jpg';
import cameraFeed3 from '@/assets/camera-feed-3.jpg';
import cameraFeed4 from '@/assets/camera-feed-4.jpg';

interface CameraData {
  id: number;
  name: string;
  location: string;
  count: number;
  image?: string;
  videoUrl?: string;
}

const Cameras = () => {
  const [gridSize, setGridSize] = React.useState<2 | 3>(2);
  const [selectedCamera, setSelectedCamera] = React.useState<CameraData | null>(null);
  const [uploadDialogCamera, setUploadDialogCamera] = React.useState<number | null>(null);
  const [allocationDialog, setAllocationDialog] = React.useState<{ cameraId: number; allocation?: any } | null>(null);
  const [cameras, setCameras] = React.useState<CameraData[]>([
    { id: 1, name: 'Camera 1', location: 'Gate 1 - North Entrance', count: 12340, image: cameraFeed1 },
    { id: 2, name: 'Camera 2', location: 'Gate 2 - South Entrance', count: 10580, image: cameraFeed2 },
    { id: 3, name: 'Camera 3', location: 'Main Temple Area', count: 15920, image: cameraFeed3 },
    { id: 4, name: 'Camera 4', location: 'Parking Zone A', count: 6992, image: cameraFeed4 },
    { id: 5, name: 'Camera 5', location: 'Parking Zone B', count: 5430, image: cameraFeed1 },
  ]);
  const [allocations, setAllocations] = React.useState<Map<number, any>>(new Map());
  const [streams, setStreams] = React.useState<Map<number, any>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const [allocationsRes, streamsRes] = await Promise.all([
        supabase.from('camera_allocations').select('*').eq('is_active', true),
        supabase.from('camera_streams').select('*')
      ]);

      if (allocationsRes.data) {
        const allocMap = new Map(allocationsRes.data.map(a => [a.camera_id, a]));
        setAllocations(allocMap);
        console.log('Allocations loaded:', allocationsRes.data);
      }

      if (streamsRes.data) {
        const streamMap = new Map(streamsRes.data.map(s => [s.camera_id, s]));
        setStreams(streamMap);
        console.log('Streams loaded:', streamsRes.data);
      }
    };

    fetchData();

    const allocChannel = supabase
      .channel('camera_allocations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'camera_allocations' }, () => {
        console.log('Camera allocation changed');
        fetchData();
      })
      .subscribe();

    const streamChannel = supabase
      .channel('camera_streams_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'camera_streams' }, () => {
        console.log('Camera stream changed');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(allocChannel);
      supabase.removeChannel(streamChannel);
    };
  }, []);

  const handleUploadSuccess = (cameraId: number, videoUrl: string) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId ? { ...cam, videoUrl } : cam
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <CardTitle>Live Camera Feeds</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={gridSize === 2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize(2)}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              2x2
            </Button>
            <Button
              variant={gridSize === 3 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize(3)}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              3x3
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadDialogCamera(1)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Videos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllocationDialog({ cameraId: 1 })}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Allocations
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 ${gridSize === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {cameras.map((camera) => {
              const allocation = allocations.get(camera.id);
              const stream = streams.get(camera.id);
              const displayName = allocation?.camera_name || camera.name;
              const displayLocation = allocation?.location || camera.location;
              const videoUrl = stream?.stream_url || camera.videoUrl;
              const isLive = stream?.is_live || false;

              return (
                <div key={camera.id} className="relative group">
                  <CameraFeed
                    name={displayName}
                    location={displayLocation}
                    crowdCount={camera.count}
                    image={camera.image}
                    videoUrl={videoUrl}
                    isLive={isLive}
                    allocatedTo={allocation?.user_email}
                    onExpand={() => setSelectedCamera({ ...camera, name: displayName, location: displayLocation, videoUrl })}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllocationDialog({ cameraId: camera.id, allocation });
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CameraDetailModal
        isOpen={!!selectedCamera}
        onClose={() => setSelectedCamera(null)}
        camera={selectedCamera || cameras[0]}
      />

      <VideoUploadDialog
        isOpen={uploadDialogCamera !== null}
        onClose={() => setUploadDialogCamera(null)}
        cameraId={uploadDialogCamera || 1}
        onUploadSuccess={(videoUrl) => {
          if (uploadDialogCamera) {
            handleUploadSuccess(uploadDialogCamera, videoUrl);
          }
        }}
      />

      {allocationDialog && (
        <CameraAllocationDialog
          isOpen={true}
          onClose={() => setAllocationDialog(null)}
          cameraId={allocationDialog.cameraId}
          cameraName={`Camera ${allocationDialog.cameraId}`}
          currentAllocation={allocationDialog.allocation}
        />
      )}
    </div>
  );
};

export default Cameras;
