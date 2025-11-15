export interface ApiError {
  message: string | null;
  status: number | null;
  [key: string]: unknown;
}
