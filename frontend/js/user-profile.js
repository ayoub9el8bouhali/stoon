import { apiRequest } from "./api.js";
import { escapeHtml, showFeedback } from "./account.js";

const currentUser = JSON.parse(localStorage.getItem("stoon_user") || "null");
const isAuthenticated = Boolean(localStorage.getItem("stoon_token"));
const id = new URLSearchParams(location.search).get("id");
const profile = document.querySelector("#public-profile");
const reviewsRoot = document.querySelector("#reviews");
const form = document.querySelector("#review-form");
const feedback = document.querySelector("#feedback");

const renderReviews = reviews => {
  reviewsRoot.innerHTML = reviews.length ? reviews.map(review => `
    <article class="review-card"><strong>${escapeHtml(review.reviewer?.firstName)} ${escapeHtml(review.reviewer?.lastName)}</strong>
    <span>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span><p>${escapeHtml(review.comment)}</p></article>
  `).join("") : `<p class="text-secondary">Aucun avis pour le moment.</p>`;
};

try {
  const [{ data: user }, { data: reviews }] = await Promise.all([
    apiRequest(`/users/${id}`), apiRequest(`/reviews/user/${id}`)
  ]);
  profile.innerHTML = `<div class="profile-avatar">${escapeHtml(user.firstName?.[0])}${escapeHtml(user.lastName?.[0])}</div>
    <div><span class="hero-badge">Profil étudiant</span><h1>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</h1>
    <p>${escapeHtml(user.school)} · ${escapeHtml(user.fieldOfStudy)} · ${escapeHtml(user.city)}</p>
    <p>${escapeHtml(user.bio || "Membre de la communauté STOON.")}</p><strong>Réputation ${escapeHtml(user.reputation)} / 5</strong>
    ${currentUser?.id === user.id
      ? `<div class="mt-3"><a class="btn btn-stoon" href="/pages/profile.html">Modifier mon profil</a></div>`
      : isAuthenticated
        ? `<div class="mt-3"><a class="btn btn-stoon" href="/pages/messages.html?participantId=${user.id}">Contacter cette personne</a></div>`
        : `<div class="mt-3"><a class="btn btn-stoon" href="/pages/login.html?next=${encodeURIComponent(`/pages/messages.html?participantId=${user.id}`)}">Connectez-vous pour contacter</a></div>`}</div>`;
  renderReviews(reviews);
  if (!isAuthenticated || currentUser?.id === user.id) {
    form.hidden = true;
    if (!isAuthenticated) reviewsRoot.insertAdjacentHTML("afterend", `<p class="mt-3"><a href="/pages/login.html?next=${encodeURIComponent(location.pathname + location.search)}">Connectez-vous pour publier un avis.</a></p>`);
  }
} catch (error) {
  profile.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(form));
    payload.targetUserId = Number(id);
    payload.rating = Number(payload.rating);
    const result = await apiRequest("/reviews", { method: "POST", body: JSON.stringify(payload) });
    showFeedback(feedback, result.message, true);
    form.reset();
    const { data } = await apiRequest(`/reviews/user/${id}`);
    renderReviews(data);
  } catch (error) {
    showFeedback(feedback, error.message);
  }
});
