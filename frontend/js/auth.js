import { apiRequest } from "./api.js";

const form = document.querySelector("#auth-form");
const feedback = document.querySelector("#feedback");

form?.addEventListener("submit", async event => {
  event.preventDefault();
  feedback.textContent = "";
  const values = Object.fromEntries(new FormData(form));
  try {
    const result = await apiRequest("/auth/login", { method: "POST", body: JSON.stringify(values) });
    localStorage.setItem("stoon_token", result.token);
    localStorage.setItem("stoon_user", JSON.stringify(result.user));
    location.href = "/pages/dashboard.html";
  } catch (error) {
    feedback.textContent = error.message;
  }
});
