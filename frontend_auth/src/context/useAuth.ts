import { createContext, useContext } from "react";
import type { UserDto } from "../features/user/types/UserDto";
import type LoginRequest from "../features/auth/types/LoginRequest";
import type { AuthResult } from "../features/auth/services/AuthService";
export interface AuthContextTypes {
  isAuthenticated: boolean;
  userInfo: UserDto | null;
  isLoading: boolean;
  sessionError: string | null;
  retrySession: () => Promise<void>;
  invalidateSession: () => void;
  logInUser: (request: { loginData: LoginRequest }) => Promise<AuthResult>;
  logOutUser: () => Promise<AuthResult>;
}
export const AuthContext = createContext<AuthContextTypes | null>(null);
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth requires AuthProvider");
  return value;
}
