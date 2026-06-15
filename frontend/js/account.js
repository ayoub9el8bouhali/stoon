import { apiRequest } from "./api.js";

export const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

export const clearSession = () => {
  localStorage.removeItem("stoon_token");
  localStorage.removeItem("stoon_user");
};

export async function requireAuth() {
  if (!localStorage.getItem("stoon_token")) {
    location.replace("/pages/login.html");
    return null;
  }
  try {
    const { user } = await apiRequest("/auth/me");
    localStorage.setItem("stoon_user", JSON.stringify(user));
    return user;
  } catch {
    clearSession();
    location.replace("/pages/login.html");
    return null;
  }
}

export function initAccountNav(active = "") {
  const root = document.querySelector("#account-nav");
  if (!root) return;
  const links = [
    ["dashboard", "/pages/dashboard.html", "Vue d'ensemble"],
    ["publications", "/pages/my-publications.html", "Mes publications"],
    ["publish", "/pages/publish.html", "Publier"],
    ["profile", "/pages/profile.html", "Mon profil"],
    ["messages", "/pages/messages.html", "Mes messages"]
  ];
  root.innerHTML = `
    <a class="navbar-brand brand-box" href="/"><img src="/assets/stoon-logo.svg" alt="STOON"></a>
    <div class="account-links">${links.map(([key, href, label]) =>
      `<a class="${key === active ? "active" : ""}" href="${href}">${label}</a>`).join("")}</div>
    <button id="logout" class="btn btn-dark-stoon" type="button">Déconnexion</button>`;

  root.querySelector("#logout").addEventListener("click", async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // La session locale doit toujours être supprimée.
    }
    clearSession();
    location.href = "/";
  });
}

export const showFeedback = (element, message, success = false) => {
  element.textContent = message;
  element.className = success ? "alert alert-success" : "alert alert-danger";
};
