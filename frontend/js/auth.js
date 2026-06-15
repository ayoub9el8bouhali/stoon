import { apiRequest } from "./api.js";
import { safeNextPath } from "./navigation.js";

const form = document.querySelector("#auth-form");
const feedback = document.querySelector("#feedback");

form?.addEventListener("submit", async event => {
  event.preventDefault();
  feedback.textContent = "";
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  const values = Object.fromEntries(new FormData(form));
  try {
    const result = await apiRequest("/auth/login", { method: "POST", body: JSON.stringify(values) });
    localStorage.setItem("stoon_token", result.token);
    localStorage.setItem("stoon_user", JSON.stringify(result.user));
    location.href = safeNextPath(new URLSearchParams(location.search).get("next"));
  } catch (error) {
    feedback.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
