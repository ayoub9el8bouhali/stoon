import { apiRequest } from "./api.js";

const welcome = document.querySelector("#welcome");
const profile = document.querySelector("#profile");
const logout = document.querySelector("#logout");

const clearSession = () => {
  localStorage.removeItem("stoon_token");
  localStorage.removeItem("stoon_user");
};

if (!localStorage.getItem("stoon_token")) {
  location.replace("/pages/login.html");
} else {
  try {
    const { user } = await apiRequest("/auth/me");
    localStorage.setItem("stoon_user", JSON.stringify(user));
    welcome.textContent = `Bienvenue ${user.firstName || ""} ${user.lastName || ""}.`;
    profile.innerHTML = `
      <strong>${user.firstName || ""} ${user.lastName || ""}</strong>
      <span>${user.email || ""}</span>
      <span>${user.school || "Établissement à compléter"} · ${user.city || "Ville à compléter"}</span>
    `;
  } catch {
    clearSession();
    location.replace("/pages/login.html");
  }
}

logout?.addEventListener("click", async () => {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // La session locale doit être supprimée même si le serveur est indisponible.
  }
  clearSession();
  location.href = "/";
});
