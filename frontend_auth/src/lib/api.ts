import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE || "/api",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json", "X-Client-Type": "WEB" },
});

export const endpoints = {
  login: import.meta.env.VITE_URL_LOGIN || "/auth/login",
  register: import.meta.env.VITE_URL_REGISTER || "/auth/register",
  refresh: import.meta.env.VITE_URL_REFRESH || "/auth/refresh",
  logout: import.meta.env.VITE_URL_LOGOUT || "/auth/logout",
  me: import.meta.env.VITE_URL_USER_ME || "/auth/user/me",
};

export function errorMessage(
  error: unknown,
  action: "login" | "register" | "general" = "general",
): string {
  if (!axios.isAxiosError(error))
    return "Coś poszło nie tak. Spróbuj ponownie.";
  if (!error.response)
    return "Nie możemy połączyć się z serwerem. Sprawdź połączenie i spróbuj ponownie.";
  const status = error.response.status;
  if (status === 429)
    return "Zbyt wiele prób. Odczekaj chwilę przed kolejną próbą.";
  if (action === "login" && (status === 401 || status === 403))
    return "Nieprawidłowa nazwa użytkownika lub hasło albo konto jest niedostępne.";
  if (action === "register" && status === 409)
    return "Nie można utworzyć konta z tymi danymi. Sprawdź nazwę użytkownika i adres e-mail.";
  if (status === 400)
    return "Sprawdź poprawność danych w formularzu i spróbuj ponownie.";
  if (status === 401) return "Sesja wygasła. Zaloguj się ponownie.";
  if (status === 403) return "Ta operacja jest niedostępna dla Twojego konta.";
  return "Usługa jest chwilowo niedostępna. Spróbuj ponownie za moment.";
}

let refreshing: Promise<void> | null = null;
export function refreshCookies() {
  if (!refreshing)
    refreshing = api
      .post(endpoints.refresh, null)
      .then(() => undefined)
      .finally(() => {
        refreshing = null;
      });
  return refreshing;
}
