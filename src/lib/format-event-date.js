/**
 * Format tanggal Supabase ke Bahasa Indonesia (WIB).
 *
 * Mendukung input:
 * - 2026-08-26T02:14:35.123Z
 * - 2026-08-26T02:14:35+00:00
 * - 2026-08-26T09:14:35 (tanpa timezone)
 */
export const formatEventDate = (
  dateString,
  format = "full",
  isJakartaTime = true,
) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  switch (format) {
    case "time":
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(date);

    case "short":
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);

    case "full":
    default:
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);
  }
};
