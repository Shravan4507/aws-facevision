export type ProcessingStatus = 'SUCCESS' | 'FAILED' | 'PROCESSING';

export interface BoundingBox {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface FaceTelemetry {
  bounding_box: BoundingBox;
  age_range: {
    low: number;
    high: number;
  };
  smile: boolean;
  gender: string;
  eyeglasses: boolean;
  top_emotion: {
    type: string;
    confidence: number;
  };
}

export interface ImageResult {
  image_id: string;
  image_name: string;
  s3_key: string;
  bucket_name?: string;
  status: ProcessingStatus;
  face_count?: number;
  faces?: FaceTelemetry[];
  error_message?: string;
  processed_at: string;
  preview_url?: string;
}

export interface DashboardStats {
  total_images: number;
  total_faces: number;
  successful: number;
  failed: number;
}
