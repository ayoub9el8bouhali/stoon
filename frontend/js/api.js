const API_BASE = "/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("stoon_token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Une erreur est survenue.");
  return data;
}
