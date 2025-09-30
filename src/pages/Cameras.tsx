import React from 'react';
import CameraFeed from '@/components/dashboard/CameraFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3x3, LayoutGrid } from 'lucide-react';
import cameraFeed1 from '@/assets/camera-feed-1.jpg';
import cameraFeed2 from '@/assets/camera-feed-2.jpg';
import cameraFeed3 from '@/assets/camera-feed-3.jpg';
import cameraFeed4 from '@/assets/camera-feed-4.jpg';

const Cameras = () => {
  const [gridSize, setGridSize] = React.useState<2 | 3>(2);

  const cameras = [
    { id: 1, name: 'Camera 1', location: 'Gate 1 - North Entrance', count: 12340, image: cameraFeed1 },
    { id: 2, name: 'Camera 2', location: 'Gate 2 - South Entrance', count: 10580, image: cameraFeed2 },
    { id: 3, name: 'Camera 3', location: 'Main Temple Area', count: 15920, image: cameraFeed3 },
    { id: 4, name: 'Camera 4', location: 'Parking Zone A', count: 6992, image: cameraFeed4 },
    { id: 5, name: 'Camera 5', location: 'Parking Zone B', count: 5430, image: cameraFeed1 },
    { id: 6, name: 'Camera 6', location: 'Food Court', count: 3210, image: cameraFeed2 },
  ];

  return (
    <div className="p-6 space-y-6">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Camera Feeds</CardTitle>
          <div className="flex gap-2">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 ${gridSize === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {cameras.map((camera) => (
              <CameraFeed
                key={camera.id}
                name={camera.name}
                location={camera.location}
                crowdCount={camera.count}
                image={camera.image}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cameras;
