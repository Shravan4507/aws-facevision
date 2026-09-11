export type ProcessingStatus = 'SUCCESS' | 'FAILED';

export interface ImageResult {
  image_id: string;
  image_name: string;
  s3_key: string;
  bucket_name?: string;
  status: ProcessingStatus;
  face_count?: number;
  error_message?: string;
  processed_at: string;
}

export interface DashboardStats {
  total_images: number;
  total_faces: number;
  successful: number;
  failed: number;
}
