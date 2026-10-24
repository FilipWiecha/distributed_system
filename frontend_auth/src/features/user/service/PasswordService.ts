import axios from "axios";
import { api, refreshCookies, errorMessage } from "../../../lib/api";
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}
export function validatePasswordChange(
  data: PasswordChange,
  confirmation: string,
): string | null {
  if (!data.currentPassword.trim()) return "Wpisz obecne hasło.";
  if (new TextEncoder().encode(data.currentPassword).length > 72)
    return "Obecne hasło może mieć maksymalnie 72 bajty.";
  if (!data.newPassword.trim() || data.newPassword.length < 12)
    return "Nowe hasło musi mieć co najmniej 12 znaków.";
  if (new TextEncoder().encode(data.newPassword).length > 72)
    return "Nowe hasło może mieć maksymalnie 72 bajty. Polskie litery i emoji zajmują więcej miejsca.";
  if (data.newPassword !== confirmation)
    return "Nowe hasło i jego powtórzenie muszą być identyczne.";
  return null;
}
export async function changePassword(data: PasswordChange): Promise<void> {
  const send = () =>
    api.post(
      import.meta.env.VITE_URL_CHANGE_PASSWORD || "/auth/user/password",
      data,
    );
  try {
    await send();
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshCookies();
    await send();
  }
}
export function passwordChangeError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 400)
    return "Nie udało się zmienić hasła. Sprawdź obecne hasło i wymagania nowego hasła.";
  if (axios.isAxiosError(error) && !error.response)
    return "Nie otrzymaliśmy potwierdzenia zmiany hasła. Operacja mogła zostać wykonana. Sprawdź połączenie; w razie problemów z obecnym hasłem użyj nowego.";
  return errorMessage(error);
}
