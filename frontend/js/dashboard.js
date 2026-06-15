import { apiRequest } from "./api.js";
import { initAccountNav, requireAuth } from "./account.js";

const welcome = document.querySelector("#welcome");
const profile = document.querySelector("#profile");
const statsRoot = document.querySelector("#stats");
initAccountNav("dashboard");

const user = await requireAuth();
if (user) {
  try {
    welcome.textContent = `Bienvenue ${user.firstName || ""} ${user.lastName || ""}.`;
    profile.innerHTML = `
      <strong>${user.firstName || ""} ${user.lastName || ""}</strong>
      <span>${user.email || ""}</span>
      <span>${user.school || "Établissement à compléter"} · ${user.city || "Ville à compléter"}</span>
    `;
    const { data } = await apiRequest("/users/me/stats");
    const stats = [
      ["Publications", data.publications],
      ["Logements", data.housing],
      ["Covoiturages", data.rides],
      ["Stages & Jobs", data.jobs],
      ["Favoris", data.favorites],
      ["Messages/alertes", data.unreadNotifications]
    ];
    statsRoot.innerHTML = stats.map(([label, value]) => `
      <div class="col-6 col-lg-2"><div class="stat-card"><strong>${value}</strong><span>${label}</span></div></div>
    `).join("");
  } catch (error) {
    statsRoot.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
  }
}
