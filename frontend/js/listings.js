import { apiRequest } from "./api.js";
import { presentListing } from "./listingPresentation.js";

const root = document.querySelector("#listings");
const endpoint = document.body.dataset.endpoint;
const emptyMessage = document.body.dataset.empty || "Aucune annonce disponible.";
const pageSize = 24;
let visibleCount = pageSize;
let allItems = [];
let filteredItems = [];
const currentUser = JSON.parse(localStorage.getItem("stoon_user") || "null");

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

const render = items => {
  const visibleItems = items.slice(0, visibleCount);
  root.innerHTML = visibleItems.length ? visibleItems.map(item => {
    const listing = presentListing(item);
    const owner = item.owner;
    const ownerActions = owner ? `
      <div class="listing-owner"><span>Publié par <strong>${escapeHtml(owner.firstName)} ${escapeHtml(owner.lastName)}</strong> · ★ ${escapeHtml(owner.reputation)}</span>
      <div class="listing-actions">
        <a class="btn btn-sm btn-outline-stoon" href="/pages/user.html?id=${owner.id}">Voir le profil</a>
        ${currentUser?.id === owner.id
          ? `<a class="btn btn-sm btn-stoon" href="/pages/my-publications.html">Gérer mon offre</a>`
          : `<a class="btn btn-sm btn-stoon" href="/pages/messages.html?participantId=${owner.id}">Contacter</a>`}
        <button class="btn btn-sm btn-outline-stoon" type="button" data-favorite="${endpoint}:${item.id}">♡ Favori</button>
      </div></div>` : "";
    return `
      <div class="col-md-6 col-lg-4">
        <article class="listing-card">
          <div class="card-body">
            <span class="badge text-bg-light mb-2">${escapeHtml(listing.city)}</span>
            <h3>${escapeHtml(listing.title)}</h3>
            <p class="text-secondary">${escapeHtml(listing.description)}</p>
            <div class="price">${escapeHtml(listing.price)}</div>
            ${ownerActions}
          </div>
        </article>
      </div>`;
  }).join("") : `<p class="text-center text-secondary">${escapeHtml(emptyMessage)}</p>`;

  const remaining = items.length - visibleItems.length;
  if (remaining > 0) {
    root.insertAdjacentHTML("beforeend", `
      <div class="col-12 text-center">
        <button class="btn btn-outline-stoon" id="load-more" type="button">Afficher plus (${remaining})</button>
      </div>`);
    document.querySelector("#load-more").addEventListener("click", () => {
      visibleCount += pageSize;
      render(filteredItems);
    });
  }
};

root.addEventListener("click", async event => {
  const button = event.target.closest("[data-favorite]");
  if (!button) return;
  const [resource, id] = button.dataset.favorite.split(":");
  try {
    const result = await apiRequest(`${resource}/${id}/favorite`, { method: "POST" });
    button.textContent = result.favorited ? "♥ Favori" : "♡ Favori";
  } catch (error) {
    if (error.message.includes("Authentification")) location.href = "/pages/login.html";
    else button.textContent = error.message;
  }
});

try {
  const result = await apiRequest(endpoint);
  allItems = result.data || result.items || result.rides || result.jobs || result.housing || [];
  filteredItems = allItems;

  if (localStorage.getItem("stoon_token") && endpoint !== "/schools") {
    const publishBanner = document.createElement("div");
    publishBanner.className = "publish-banner";
    publishBanner.innerHTML = `<span>Vous avez une offre à partager avec les étudiants ?</span><a class="btn btn-stoon" href="/pages/publish.html">+ Publier une offre</a>`;
    root.before(publishBanner);
  }

  if (allItems.length > 6) {
    const toolbar = document.createElement("div");
    toolbar.className = "listing-toolbar";
    toolbar.innerHTML = `
      <label for="listing-search">Rechercher dans les résultats</label>
      <div class="listing-search-row">
        <input class="form-control" id="listing-search" type="search" placeholder="Ville, école, trajet, entreprise...">
        <span id="listing-count">${allItems.length} résultats</span>
      </div>`;
    root.before(toolbar);
    toolbar.querySelector("#listing-search").addEventListener("input", event => {
      const query = event.target.value.trim().toLocaleLowerCase("fr");
      filteredItems = query
        ? allItems.filter(item => JSON.stringify(item).toLocaleLowerCase("fr").includes(query))
        : allItems;
      visibleCount = pageSize;
      toolbar.querySelector("#listing-count").textContent = `${filteredItems.length} résultat${filteredItems.length > 1 ? "s" : ""}`;
      render(filteredItems);
    });
  }

  render(filteredItems);
} catch (error) {
  root.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}
