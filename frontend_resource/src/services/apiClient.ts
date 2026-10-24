import axios, { type InternalAxiosRequestConfig } from "axios";
export const ACCOUNT_ORIGIN =
  import.meta.env.VITE_ACCOUNT_ORIGIN || "http://account.mojprojekt.test";
export const authClient = axios.create({
  baseURL: ACCOUNT_ORIGIN + "/api",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json", "X-Client-Type": "WEB" },
});
export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json", "X-Client-Type": "WEB" },
});
export function accountUrl(path = "/login", returnTo = window.location.href) {
  const url = new URL(path, ACCOUNT_ORIGIN);
  url.searchParams.set("returnTo", returnTo);
  return url.href;
}
let refresh: Promise<void> | null = null;
export function refreshSession(): Promise<void> {
  if (!refresh)
    refresh = authClient
      .post("/auth/refresh", null)
      .then(() => undefined)
      .finally(() => {
        refresh = null;
      });
  return refresh;
}
type RetryConfig = InternalAxiosRequestConfig & { sessionRetried?: boolean };
for (const client of [apiClient, authClient]) {
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) throw error;
      const config = error.config as RetryConfig | undefined;
      if (
        !config ||
        error.response?.status !== 401 ||
        config.url === "/auth/refresh"
      )
        throw error;
      if (config.sessionRetried) {
        window.dispatchEvent(new Event("auth:expired"));
        throw error;
      }
      config.sessionRetried = true;
      try {
        await refreshSession();
      } catch (failure) {
        if (
          axios.isAxiosError(failure) &&
          [400, 401, 403].includes(failure.response?.status ?? 0)
        )
          window.dispatchEvent(new Event("auth:expired"));
        throw failure;
      }
      return client.request(config);
    },
  );
}
