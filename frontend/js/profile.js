import { apiRequest } from "./api.js";
import { initAccountNav, requireAuth, showFeedback } from "./account.js";

initAccountNav("profile");
const user = await requireAuth();
const form = document.querySelector("#profile-form");
const feedback = document.querySelector("#feedback");

if (user) {
  ["firstName", "lastName", "city", "school", "fieldOfStudy", "bio"].forEach(key => {
    form.elements[key].value = user[key] || "";
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const payload = Object.fromEntries(new FormData(form));
    const result = await apiRequest("/users/profile", { method: "PUT", body: JSON.stringify(payload) });
    localStorage.setItem("stoon_user", JSON.stringify(result.user));
    showFeedback(feedback, result.message, true);
  } catch (error) {
    showFeedback(feedback, error.message);
  } finally {
    button.disabled = false;
  }
});
