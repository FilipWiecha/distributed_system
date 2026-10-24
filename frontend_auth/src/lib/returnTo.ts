export function gymReturnTo(search: string): string | null {
  const value = new URLSearchParams(search).get("returnTo");
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin === "http://gym.mojprojekt.test" &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
