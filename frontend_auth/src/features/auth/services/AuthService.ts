import axios from "axios";
import { api, endpoints, errorMessage, refreshCookies } from "../../../lib/api";
import type LoginRequest from "../types/LoginRequest";
import type RegisterRequest from "../types/RegisterRequest";
export interface AuthResult {
  success: boolean;
  error?: string;
}
export async function postLogin({
  loginData,
}: {
  loginData: LoginRequest;
}): Promise<AuthResult> {
  try {
    await api.post(endpoints.login, loginData);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error, "login") };
  }
}
export async function postRegister({
  registerData,
}: {
  registerData: RegisterRequest;
}): Promise<AuthResult> {
  try {
    await api.post(endpoints.register, registerData);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error, "register") };
  }
}
export async function postLogout(): Promise<AuthResult> {
  try {
    try {
      await api.post(endpoints.logout, null);
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401)
        throw error;
      await refreshCookies();
      await api.post(endpoints.logout, null);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
export async function refreshSession(): Promise<boolean> {
  try {
    await refreshCookies();
    return true;
  } catch {
    return false;
  }
}
