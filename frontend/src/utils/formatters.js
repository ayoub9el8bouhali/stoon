export const formatPrice = (value, suffix = "MAD") => {
  const amount = Number(value || 0);
  return `${amount.toLocaleString("fr-MA")} ${suffix}`;
};

export const formatDate = (value) => {
  if (!value) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "medium",
    timeStyle: value.includes(":") ? "short" : undefined
  }).format(new Date(value));
};

export const fullName = (user) => `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

export const compactNumber = (value) =>
  new Intl.NumberFormat("fr-MA", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
