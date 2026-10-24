import axios from "axios";
import { api, refreshCookies } from "../../lib/api";
import type { Session, SessionsSlice } from "./types";

const path = import.meta.env.VITE_URL_SESSIONS || "/auth/sessions";
// Retry only after an explicit authentication rejection, never on a network failure.
async function authenticated<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshCookies();
    return request();
  }
}
export function getSessions(
  page: number,
  signal?: AbortSignal,
): Promise<SessionsSlice> {
  return authenticated(
    async () =>
      (await api.get<SessionsSlice>(path, { params: { page }, signal })).data,
  );
}
export function getSession(id: string, signal?: AbortSignal): Promise<Session> {
  return authenticated(
    async () =>
      (await api.get<Session>(`${path}/${encodeURIComponent(id)}`, { signal }))
        .data,
  );
}
export function revokeSession(id: string): Promise<void> {
  return authenticated(async () => {
    await api.delete(`${path}/${encodeURIComponent(id)}`);
  });
}
export function revokeAllSessions(): Promise<void> {
  return authenticated(async () => {
    await api.delete(path);
  });
}
export function sessionDate(value: string | null): string {
  if (!value) return "Brak danych";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Brak danych";
  // Backend returns LocalDateTime: display its wall-clock time, do not invent a timezone.
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
