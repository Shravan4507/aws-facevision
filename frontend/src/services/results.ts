import { ImageResult, DashboardStats } from '../types/index.ts';
import { isLiveApiConfigured, request, ApiError } from './api.ts';

export async function fetchResults(): Promise<ImageResult[]> {
  if (!isLiveApiConfigured()) {
    // Zero placeholders: clean empty list until backend is hooked up or user uploads
    return [];
  }

  try {
    const data = await request<{ items: ImageResult[] }>('results');
    return data.items || [];
  } catch (err) {
    console.warn('Could not fetch results from API Gateway:', err);
    return [];
  }
}

export async function fetchStats(): Promise<DashboardStats> {
  if (!isLiveApiConfigured()) {
    return {
      total_images: 0,
      total_faces: 0,
      successful: 0,
      failed: 0,
    };
  }

  try {
    return await request<DashboardStats>('stats');
  } catch (err) {
    console.warn('Could not fetch stats from API Gateway:', err);
    return {
      total_images: 0,
      total_faces: 0,
      successful: 0,
      failed: 0,
    };
  }
}

export async function uploadImageToBackend(file: File): Promise<ImageResult> {
  if (!isLiveApiConfigured()) {
    throw new ApiError(
      'AWS API Gateway is not deployed yet! Complete the backend & AWS setup in the next step to connect live processing.',
      0
    );
  }

  const formData = new FormData();
  formData.append('image', file, file.name);

  return await request<ImageResult>('upload', {
    method: 'POST',
    body: formData,
  });
}
