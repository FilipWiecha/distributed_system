export interface UserSessionDto {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrentSession: boolean;
}
