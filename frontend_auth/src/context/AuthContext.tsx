import { useEffect, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { UserDto } from "../features/user/types/UserDto";
import type LoginRequest from "../features/auth/types/LoginRequest";
import { postLogin, postLogout } from "../features/auth/services/AuthService";
import type { AuthResult } from "../features/auth/services/AuthService";
import { getUser } from "../features/user/service/UserService";
import { errorMessage } from "../lib/api";

import { AuthContext } from "./useAuth";
let initialRequest: Promise<UserDto> | null = null;
function checkSession() {
  if (!initialRequest)
    initialRequest = getUser().finally(() => {
      initialRequest = null;
    });
  return initialRequest;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const generation = useRef(0);

  const invalidateSession = useCallback(() => {
    generation.current++;
    setUserInfo(null);
    setSessionError(null);
    setIsLoading(false);
  }, []);

  const retrySession = useCallback(async () => {
    const request = ++generation.current;
    setIsLoading(true);
    setSessionError(null);
    try {
      const user = await checkSession();
      if (request === generation.current) setUserInfo(user);
    } catch (error) {
      if (request !== generation.current) return;
      setUserInfo(null);
      if (
        !axios.isAxiosError(error) ||
        ![400, 401, 403].includes(error.response?.status ?? 0)
      )
        setSessionError(errorMessage(error));
    } finally {
      if (request === generation.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    checkSession()
      .then((user) => {
        if (active) setUserInfo(user);
      })
      .catch((error) => {
        if (
          active &&
          (!axios.isAxiosError(error) ||
            ![400, 401, 403].includes(error.response?.status ?? 0))
        )
          setSessionError(errorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const logInUser = async (request: {
    loginData: LoginRequest;
  }): Promise<AuthResult> => {
    generation.current++;
    const result = await postLogin(request);
    if (!result.success) return result;
    try {
      setUserInfo(await getUser());
      setSessionError(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error) };
    }
  };

  const logOutUser = async (): Promise<AuthResult> => {
    const result = await postLogout();
    if (result.success) {
      generation.current++;
      setUserInfo(null);
      setSessionError(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userInfo,
        userInfo,
        isLoading,
        sessionError,
        retrySession,
        invalidateSession,
        logInUser,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
