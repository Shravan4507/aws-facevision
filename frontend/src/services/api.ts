/**
 * Base API client for AWS FaceVision dashboard with API Gateway integration.
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';

export const isLiveApiConfigured = (): boolean => {
  return Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);
};

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!isLiveApiConfigured()) {
    throw new ApiError('AWS API Gateway endpoint is not configured in .env yet.', 0);
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string> || {}),
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // Not JSON
      }
      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to communicate with AWS API Gateway',
      0
    );
  }
}
