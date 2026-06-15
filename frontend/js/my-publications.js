import { apiRequest } from "./api.js";
import { escapeHtml, initAccountNav, requireAuth } from "./account.js";
import { presentListing } from "./listingPresentation.js";

initAccountNav("publications");
await requireAuth();
const root = document.querySelector("#my-publications");
const endpoints = { housing: "housing", ride: "rides", job: "jobs", document: "marketplace" };

const render = items => {
  root.innerHTML = items.length ? items.map(item => {
    const display = presentListing(item);
    return `<div class="col-md-6 col-lg-4"><article class="listing-card"><div class="card-body">
      <span class="badge text-bg-light mb-2">${escapeHtml(item.resourceType)}</span>
      <h3>${escapeHtml(display.title)}</h3><p class="text-secondary">${escapeHtml(display.description)}</p>
      <div class="price mb-3">${escapeHtml(display.price)}</div>
      <div class="d-flex gap-2"><a class="btn btn-sm btn-outline-stoon" href="/pages/publish.html?type=${item.resourceType}&id=${item.id}">Modifier</a><button class="btn btn-sm btn-outline-danger" data-delete="${item.resourceType}:${item.id}" type="button">Supprimer</button></div>
    </div></article></div>`;
  }).join("") : `<div class="empty-state"><h2>Aucune publication</h2><p>Publiez votre première offre sur STOON.</p><a class="btn btn-stoon" href="/pages/publish.html">Publier maintenant</a></div>`;
};

try {
  const { data } = await apiRequest("/users/me/publications");
  render(data);
} catch (error) {
  root.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}

root.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete]");
  if (!button || !confirm("Supprimer définitivement cette publication ?")) return;
  const [type, id] = button.dataset.delete.split(":");
  button.disabled = true;
  try {
    await apiRequest(`/${endpoints[type]}/${id}`, { method: "DELETE" });
    button.closest(".col-md-6").remove();
  } catch (error) {
    alert(error.message);
    button.disabled = false;
  }
});
