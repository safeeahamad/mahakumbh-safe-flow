import { pipeline, type PipelineType } from '@huggingface/transformers';

let detector: any = null;

export async function initializeDetector() {
  if (!detector) {
    console.log('Initializing object detector...');
    try {
      detector = await pipeline(
        'object-detection' as PipelineType,
        'Xenova/detr-resnet-50'
      );
      console.log('Object detector initialized successfully');
    } catch (error) {
      console.error('Failed to initialize detector:', error);
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
    threshold: 0.5,
    percentage: false,
  });
  
  console.log('Detection results:', results);
  return results;
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

  // Draw each detection
  detections.forEach(detection => {
    if (detection.label === 'person') {
      const { xmin, ymin, xmax, ymax } = detection.box;
      
      // Draw bounding box
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

      // Draw label background
      ctx.fillStyle = '#3b82f6';
      const label = `Person ${Math.round(detection.score * 100)}%`;
      ctx.font = '16px sans-serif';
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(xmin, ymin - 25, textWidth + 10, 25);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, xmin + 5, ymin - 7);
    }
  });
}
