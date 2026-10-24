import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./useAuth";
import { getUserInfo } from "../features/user/services/UserService";
import { authClient } from "../services/apiClient";
import type UserDto from "../features/user/types/UserDto";
let initialRequest: Promise<UserDto> | null = null;
function checkSession() {
  return (initialRequest ??= getUserInfo().finally(() => {
    initialRequest = null;
  }));
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const expired = () => {
      setUser(null);
      setError(null);
    };
    window.addEventListener("auth:expired", expired);
    checkSession()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch((failure) => {
        if (
          active &&
          !(
            axios.isAxiosError(failure) &&
            [400, 401, 403].includes(failure.response?.status ?? 0)
          )
        )
          setError("Nie udało się sprawdzić sesji konta. Spróbuj ponownie.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      window.removeEventListener("auth:expired", expired);
    };
  }, [attempt]);
  const retry = () => {
    setLoading(true);
    setError(null);
    setAttempt((v) => v + 1);
  };
  const logout = async () => {
    await authClient.post("/auth/logout", null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, error, retry, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
