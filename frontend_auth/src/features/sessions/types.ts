export interface Session {
  sessionId: string;
  platform: string | null;
  revoked: boolean;
  rotatedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}
export interface SessionsSlice {
  sessions: Session[];
  hasNext: boolean;
}
