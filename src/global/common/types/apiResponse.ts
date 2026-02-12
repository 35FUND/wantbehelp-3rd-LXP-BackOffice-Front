export interface ApiResponse<T> {
  success: boolean;
  code?: string | null;
  message?: string | null;
  request?: string | null;
  data: T;
}
