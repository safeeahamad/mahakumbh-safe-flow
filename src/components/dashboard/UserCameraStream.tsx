import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Upload, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { detectObjects, countPeople, drawDetections } from '@/utils/yoloDetection';

interface UserCameraStreamProps {
  allocation: {
    camera_id: number;
    camera_name: string;
    location: string;
  };
}

const UserCameraStream = ({ allocation }: UserCameraStreamProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [personCount, setPersonCount] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      stopStream();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const startDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsDetecting(true);
    
    const runDetection = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        const detections = await detectObjects(videoRef.current);
        const count = countPeople(detections);
        setPersonCount(count);
        drawDetections(canvasRef.current, videoRef.current, detections);
        
        // Update crowd count in database
        await supabase
          .from('camera_streams')
          .update({ 
            is_live: true,
          })
          .eq('camera_id', allocation.camera_id);
      } catch (error) {
        console.error('Detection error:', error);
      }
    };

    // Run detection every 2 seconds
    detectionIntervalRef.current = window.setInterval(runDetection, 2000);
    runDetection(); // Run immediately
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
    setPersonCount(0);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);

        await supabase
          .from('camera_streams')
          .upsert({
            camera_id: allocation.camera_id,
            user_email: user?.email || '',
            is_live: true,
            stream_url: null
          }, {
            onConflict: 'camera_id'
          });

        toast({
          title: "Camera Started",
          description: "Starting YOLO person detection..."
        });
        
        // Start YOLO detection after a short delay
        setTimeout(() => {
          startDetection();
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to access camera: " + error.message,
        variant: "destructive"
      });
    }
  };

  const stopStream = async () => {
    stopDetection();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);

    await supabase
      .from('camera_streams')
      .update({ is_live: false })
      .eq('camera_id', allocation.camera_id);

    toast({
      title: "Camera Stopped",
      description: "Your camera feed has been stopped"
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${allocation.camera_id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('camera-videos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('camera-videos')
        .getPublicUrl(filePath);

      setUploadedVideo(publicUrl);

      await supabase
        .from('camera_streams')
        .upsert({
          camera_id: allocation.camera_id,
          user_email: user?.email || '',
          stream_url: publicUrl,
          is_live: true
        }, {
          onConflict: 'camera_id'
        });

      toast({
        title: "Video Uploaded",
        description: "Your video is now streaming"
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Camera {allocation.camera_id}</CardTitle>
          <div className="flex items-center gap-2">
            {isDetecting && (
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {personCount} {personCount === 1 ? 'Person' : 'People'}
              </Badge>
            )}
            <Badge variant={isStreaming ? "default" : "secondary"}>
              {isStreaming ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{allocation.location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            src={uploadedVideo || undefined}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          {!isStreaming && !uploadedVideo && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <VideoOff className="h-12 w-12" />
            </div>
          )}
          {isDetecting && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              YOLO Detection Active
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isStreaming ? (
            <Button onClick={startStream} className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopStream} variant="destructive" className="flex-1">
              <VideoOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCameraStream;
