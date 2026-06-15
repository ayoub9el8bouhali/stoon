const API_BASE = "/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("stoon_token");
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : {};
    if (!response.ok) throw new Error(data.message || `La requête a échoué (${response.status}).`);
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Le serveur STOON est momentanément inaccessible. Réessayez dans quelques instants.");
    }
    throw error;
  }
}
