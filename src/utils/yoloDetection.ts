import { pipeline, type PipelineType } from '@huggingface/transformers';

let detector: any = null;

export async function initializeDetector() {
  if (!detector) {
    console.log('Initializing YOLO detector...');
    detector = await pipeline(
      'object-detection' as PipelineType,
      'Xenova/yolov9-c',
      { device: 'webgpu' }
    );
    console.log('YOLO detector initialized');
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
    threshold: 0.3,
    percentage: true,
  });
  
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
      const x = xmin * canvas.width / 100;
      const y = ymin * canvas.height / 100;
      const width = (xmax - xmin) * canvas.width / 100;
      const height = (ymax - ymin) * canvas.height / 100;

      // Draw bounding box
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      ctx.fillStyle = '#3b82f6';
      const label = `Person ${Math.round(detection.score * 100)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText(label, x + 5, y - 7);
    }
  });
}
