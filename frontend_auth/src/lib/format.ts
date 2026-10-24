export function initials(firstName?: string, lastName?: string, username = "") {
  return (
    (firstName?.[0] || username[0] || "N") + (lastName?.[0] || "")
  ).toUpperCase();
}
export function formatDate(value?: string) {
  if (!value) return "Nie podano";
  const date = new Date(value + "T12:00:00");
  return Number.isNaN(date.getTime())
    ? "Nie podano"
    : new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
}
export function roleLabel(role?: string) {
  return role
    ? role
        .replaceAll("ROLE_", "")
        .split(/[ ,]+/)
        .filter(Boolean)
        .map((r) =>
          r === "USER" ? "Użytkownik" : r === "ADMIN" ? "Administrator" : r,
        )
        .join(", ")
    : "Brak danych";
}
