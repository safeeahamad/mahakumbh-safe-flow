import React from 'react';
import CameraFeed from '@/components/dashboard/CameraFeed';
import CameraDetailModal from '@/components/dashboard/CameraDetailModal';
import VideoUploadDialog from '@/components/dashboard/VideoUploadDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3x3, LayoutGrid, Upload } from 'lucide-react';
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
  const [cameras, setCameras] = React.useState<CameraData[]>([
    { id: 1, name: 'Camera 1', location: 'Gate 1 - North Entrance', count: 12340, image: cameraFeed1 },
    { id: 2, name: 'Camera 2', location: 'Gate 2 - South Entrance', count: 10580, image: cameraFeed2 },
    { id: 3, name: 'Camera 3', location: 'Main Temple Area', count: 15920, image: cameraFeed3 },
    { id: 4, name: 'Camera 4', location: 'Parking Zone A', count: 6992, image: cameraFeed4 },
    { id: 5, name: 'Camera 5', location: 'Parking Zone B', count: 5430, image: cameraFeed1 },
    { id: 6, name: 'Camera 6', location: 'Food Court', count: 3210, image: cameraFeed2 },
  ]);

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
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 ${gridSize === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {cameras.map((camera) => (
              <div key={camera.id} className="relative group">
                <CameraFeed
                  name={camera.name}
                  location={camera.location}
                  crowdCount={camera.count}
                  image={camera.image}
                  videoUrl={camera.videoUrl}
                  onExpand={() => setSelectedCamera(camera)}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadDialogCamera(camera.id);
                  }}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              </div>
            ))}
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
    </div>
  );
};

export default Cameras;
