import axios from "axios";
import { api, errorMessage, refreshCookies } from "../../../lib/api";
export function validateDeletionPassword(password: string): string | null {
  if (!password.trim())
    return "Wpisz obecne hasło, aby potwierdzić usunięcie konta.";
  if (new TextEncoder().encode(password).length > 72)
    return "Hasło może mieć maksymalnie 72 bajty.";
  return null;
}
export async function deleteAccount(password: string): Promise<void> {
  const send = () =>
    api.delete(
      import.meta.env.VITE_URL_DELETE_ACCOUNT || "/auth/user/delete-account",
      { data: { password } },
    );
  try {
    await send();
  } catch (error) {
    // An explicit 401 means the action was rejected. Never retry uncertain outcomes.
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshCookies();
    await send();
  }
}
export function deletionError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response || error.response.status >= 500)
      return "Nie otrzymaliśmy potwierdzenia usunięcia. Operacja mogła zostać częściowo lub w całości wykonana. Sprawdź dostęp do konta przed kolejną próbą.";
    if (error.response.status === 400)
      return "Nie udało się usunąć konta. Sprawdź obecne hasło i spróbuj ponownie.";
  }
  return errorMessage(error);
}
