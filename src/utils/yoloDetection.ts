import { pipeline, type PipelineType } from '@huggingface/transformers';

let detector: any = null;

export async function initializeDetector() {
  if (!detector) {
    console.log('Initializing YOLOv8 object detector...');
    try {
      // Try to use YOLOv8n (nano) with WebGPU for better performance
      try {
        detector = await pipeline(
          'object-detection' as PipelineType,
          'Xenova/yolov8n',
          { device: 'webgpu' }
        );
        console.log('YOLOv8 detector initialized with WebGPU');
      } catch (webgpuError) {
        // Fallback to WASM if WebGPU is not available
        console.log('WebGPU not available, using WASM backend');
        detector = await pipeline(
          'object-detection' as PipelineType,
          'Xenova/yolov8n'
        );
        console.log('YOLOv8 detector initialized with WASM');
      }
    } catch (error) {
      console.error('Failed to initialize YOLOv8 detector:', error);
      throw error;
    }
  }
  return detector;
}

export interface Detection {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export async function detectObjects(imageElement: HTMLVideoElement | HTMLImageElement): Promise<Detection[]> {
  if (!detector) {
    await initializeDetector();
  }
  
  const results = await detector(imageElement, {
    threshold: 0.25, // Lower threshold for better detection sensitivity
    percentage: false,
  });
  
  console.log('YOLOv8 detection results:', results);
  
  // Filter for person detections only and ensure consistent label matching
  const peopleDetections = results.filter((d: Detection) => 
    d.label.toLowerCase() === 'person'
  );
  
  console.log(`YOLOv8 detected ${peopleDetections.length} people`);
  return peopleDetections;
}

export function countPeople(detections: Detection[]): number {
  return detections.filter(d => d.label === 'person').length;
}

export function drawDetections(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  detections: Detection[]
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Count people
  const peopleCount = detections.length;

  // Draw each person detection
  detections.forEach((detection, index) => {
    const { xmin, ymin, xmax, ymax } = detection.box;
    
    // Draw bounding box with vibrant green
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 3;
    ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

    // Draw label background
    ctx.fillStyle = '#00ff41';
    const confidence = Math.round(detection.score * 100);
    const label = `Person ${index + 1} (${confidence}%)`;
    ctx.font = 'bold 16px Arial';
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(xmin, ymin - 28, textWidth + 12, 28);

    // Draw label text
    ctx.fillStyle = '#000000';
    ctx.fillText(label, xmin + 6, ymin - 8);
    
    // Draw confidence indicator
    const barWidth = 50;
    const barHeight = 4;
    ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
    ctx.fillRect(xmin, ymax + 5, barWidth, barHeight);
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(xmin, ymax + 5, barWidth * detection.score, barHeight);
  });

  // Draw total count banner at top
  if (peopleCount > 0) {
    const countText = `Total: ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'} detected`;
    ctx.font = 'bold 20px Arial';
    const textWidth = ctx.measureText(countText).width;
    
    // Draw banner background
    ctx.fillStyle = 'rgba(0, 255, 65, 0.95)';
    ctx.fillRect(10, 10, textWidth + 20, 40);
    
    // Draw banner text
    ctx.fillStyle = '#000000';
    ctx.fillText(countText, 20, 38);
  }
}
