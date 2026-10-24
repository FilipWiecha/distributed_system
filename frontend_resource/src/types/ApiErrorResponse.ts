export interface ApiErrorResponse {
  detail: string;
  instance: string;
  status: number;
  title: string;
  errors?: Record<string, string>;
}
