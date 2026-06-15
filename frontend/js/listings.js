import { apiRequest } from "./api.js";

const root = document.querySelector("#listings");
const endpoint = document.body.dataset.endpoint;
const emptyMessage = document.body.dataset.empty || "Aucune annonce disponible.";

const money = value => value ? `${Number(value).toLocaleString("fr-FR")} MAD` : "Nous contacter";
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

try {
  const result = await apiRequest(endpoint);
  const items = result.data || result.items || result.rides || result.jobs || result.housing || [];
  root.innerHTML = items.length ? items.map(item => `
    <div class="col-md-6 col-lg-4">
      <article class="listing-card">
        <div class="card-body">
          <span class="badge text-bg-light mb-2">${escapeHtml(item.city || item.departureCity || "STOON")}</span>
          <h3>${escapeHtml(item.title || `${item.departureCity || ""} → ${item.destinationCity || ""}`)}</h3>
          <p class="text-secondary">${escapeHtml(item.description || item.school || "Annonce étudiante STOON")}</p>
          <div class="price">${money(item.price || item.monthlyRent)}</div>
        </div>
      </article>
    </div>`).join("") : `<p class="text-center text-secondary">${emptyMessage}</p>`;
} catch (error) {
  root.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}
