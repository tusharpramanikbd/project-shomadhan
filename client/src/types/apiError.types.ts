export interface ApiError {
  message: string | null;
  status: number | null;
  code: string | null;
  [key: string]: unknown;
}
