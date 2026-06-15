import { apiRequest } from "./api.js";
import { initAccountNav, requireAuth, showFeedback } from "./account.js";

initAccountNav("publish");
const user = await requireAuth();
const types = document.querySelector("#publish-types");
const form = document.querySelector("#publish-form");
const fields = document.querySelector("#form-fields");
const feedback = document.querySelector("#feedback");
let activeType = "housing";
const query = new URLSearchParams(location.search);
const editId = query.get("id");
const requestedType = query.get("type");

const input = (label, name, type = "text", extra = "", value = "") => `
  <label class="col-md-6">${label}<input class="form-control mt-1" type="${type}" name="${name}" value="${value}" ${extra}></label>`;
const textarea = (label, name, required = true) => `<label class="col-12">${label}<textarea class="form-control mt-1" name="${name}" rows="4" ${required ? "required" : ""}></textarea></label>`;
const select = (label, name, options) => `<label class="col-md-6">${label}<select class="form-select mt-1" name="${name}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select></label>`;

const common = () => input("Ville", "city", "text", "required minlength='2'", user?.city || "") + input("École", "school", "text", "required minlength='2'", user?.school || "");

const templates = {
  housing: () => input("Titre", "title", "text", "required minlength='4'") +
    textarea("Description", "description") + select("Type", "type", [["chambre","Chambre"],["studio","Studio"],["appartement","Appartement"],["colocation","Colocation"]]) +
    common() + input("Adresse", "address", "text", "required minlength='4'") + input("Prix mensuel (MAD)", "price", "number", "required min='0'") +
    input("Nombre de chambres", "rooms", "number", "required min='1'", "1") + input("Disponible à partir du", "availableFrom", "date", "required") +
    input("Équipements, séparés par des virgules", "amenities", "text"),
  ride: () => input("Ville de départ", "departureCity", "text", "required") + input("Adresse de départ", "departureAddress", "text", "required") +
    input("Destination", "destinationCity", "text", "required") + input("Adresse d’arrivée", "destinationAddress", "text", "required") +
    input("Date et heure", "departureAt", "datetime-local", "required") + input("Places disponibles", "seatsTotal", "number", "required min='1' max='8'", "1") +
    input("Prix par place (MAD)", "pricePerSeat", "number", "required min='0'", "0") + input("Modèle de voiture", "carModel") + common() +
    textarea("Informations complémentaires", "notes", false),
  job: () => input("Titre de l’opportunité", "title", "text", "required minlength='4'") + input("Entreprise", "company", "text", "required") +
    textarea("Description", "description") + select("Type", "opportunityType", [["stage","Stage"],["job_etudiant","Job étudiant"],["service_freelance","Service freelance"]]) +
    select("Mode", "workMode", [["presentiel","Présentiel"],["hybride","Hybride"],["remote","À distance"]]) +
    input("Ville", "city", "text", "required", user?.city || "") + input("École concernée", "school", "text", "", user?.school || "") +
    input("Rémunération", "salary") + input("Date limite", "deadline", "date") + input("Compétences, séparées par des virgules", "skills") +
    input("Email de contact", "contactEmail", "email", "required", user?.email || ""),
  document: () => input("Titre", "title", "text", "required minlength='4'") + textarea("Description", "description") +
    select("Catégorie", "category", [["document","Document"],["livre","Livre"],["materiel","Matériel"],["electronique","Électronique"],["autre","Autre"]]) +
    select("Transaction", "transactionType", [["vente","Vente"],["achat","Recherche/Achat"]]) +
    select("État", "condition", [["numerique","Numérique"],["neuf","Neuf"],["tres_bon","Très bon"],["bon","Bon"],["acceptable","Acceptable"]]) +
    input("Prix (MAD)", "price", "number", "required min='0'", "0") + common() + input("Filière", "fieldOfStudy", "text", "", user?.fieldOfStudy || "")
};

if (templates[requestedType]) activeType = requestedType;

const endpoints = { housing: "/housing", ride: "/rides", job: "/jobs", document: "/marketplace" };
const render = () => { fields.innerHTML = templates[activeType](); feedback.textContent = ""; feedback.className = ""; };

types.addEventListener("click", event => {
  const button = event.target.closest("[data-type]");
  if (!button || editId) return;
  activeType = button.dataset.type;
  types.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
  render();
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  try {
    const payload = Object.fromEntries(new FormData(form));
    const path = editId ? `${endpoints[activeType]}/${editId}` : endpoints[activeType];
    const result = await apiRequest(path, { method: editId ? "PUT" : "POST", body: JSON.stringify(payload) });
    showFeedback(feedback, result.message, true);
    if (!editId) form.reset();
  } catch (error) {
    showFeedback(feedback, error.message);
  } finally {
    button.disabled = false;
  }
});

render();

if (editId && templates[activeType]) {
  types.querySelectorAll("button").forEach(item => item.classList.toggle("active", item.dataset.type === activeType));
  types.querySelectorAll("button").forEach(item => { if (item.dataset.type !== activeType) item.disabled = true; });
  try {
    const { data } = await apiRequest(`${endpoints[activeType]}/${editId}`);
    Object.entries(data).forEach(([key, value]) => {
      if (!form.elements[key] || value === null || typeof value === "object") return;
      form.elements[key].value = key === "departureAt" ? String(value).slice(0, 16) : value;
    });
    document.querySelector("h1").textContent = "Modifier mon offre";
    form.querySelector("button[type='submit']").textContent = "Enregistrer les modifications";
  } catch (error) {
    showFeedback(feedback, error.message);
  }
}
