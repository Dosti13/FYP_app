export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  totalPages: number;
}