export function safeNextPath(value) {
  const next = String(value || "");
  return next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/pages/dashboard.html";
}
