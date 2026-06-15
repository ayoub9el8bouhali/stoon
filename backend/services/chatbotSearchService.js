import { Op } from "sequelize";
import { Housing, Job, Ride } from "../models/index.js";
import { pool } from "../config/db.js";

const limit = 4;
const money = (value) => `${Number(value).toLocaleString("fr-FR")} MAD`;

const housingSearch = async ({ city, budget, housingType }) => {
  const where = { status: "active" };
  if (city) where.city = { [Op.like]: `%${city}%` };
  if (budget) where.price = { [Op.lte]: Number(budget) };
  if (housingType && ["chambre", "studio", "appartement", "colocation"].includes(housingType)) {
    where.type = housingType;
  }
  const rows = await Housing.findAll({ where, order: [["price", "ASC"]], limit });
  const items = rows.map((row) => ({
    type: "housing",
    title: row.title,
    meta: `${row.city} · ${row.type}`,
    detail: `${money(row.price)} · ${row.address}`,
    url: "/pages/colocation.html"
  }));
  return {
    items,
    reply: items.length
      ? `${items.length} logement(s) actif(s) correspondent à votre recherche : ${items.map((item) => `${item.title} (${item.detail})`).join(" ; ")}.`
      : "Aucun logement actif ne correspond exactement à ces critères. Essayez une autre ville, un budget plus large ou un autre type."
  };
};

const rideSearch = async ({ departureCity, destinationCity }) => {
  const where = { status: "active" };
  if (departureCity) where.departureCity = { [Op.like]: `%${departureCity}%` };
  if (destinationCity) where.destinationCity = { [Op.like]: `%${destinationCity}%` };
  const rows = await Ride.findAll({ where, order: [["departureAt", "ASC"]], limit });
  const items = rows.map((row) => ({
    type: "ride",
    title: `${row.departureCity} → ${row.destinationCity}`,
    meta: `${row.seatsAvailable} place(s) · ${money(row.pricePerSeat)}`,
    detail: new Date(row.departureAt).toLocaleString("fr-FR"),
    url: "/pages/covoiturage.html"
  }));
  return {
    items,
    reply: items.length
      ? `${items.length} trajet(s) actif(s) trouvé(s) entre ${departureCity || "votre départ"} et ${destinationCity || "votre destination"}.`
      : "Aucun trajet actif ne correspond actuellement à ce parcours."
  };
};

const jobSearch = async ({ city, opportunityType }) => {
  const where = { status: "active" };
  if (city) where.city = { [Op.like]: `%${city}%` };
  if (opportunityType) where.opportunityType = opportunityType;
  const rows = await Job.findAll({ where, order: [["deadline", "ASC"]], limit });
  const items = rows.map((row) => ({
    type: "job",
    title: row.title,
    meta: `${row.company} · ${row.city}`,
    detail: `${row.opportunityType.replace("_", " ")}${row.salary ? ` · ${row.salary}` : ""}`,
    url: "/pages/jobs.html"
  }));
  return {
    items,
    reply: items.length
      ? `${items.length} opportunité(s) active(s) trouvée(s) : ${items.map((item) => item.title).join(" ; ")}.`
      : "Aucune opportunité active ne correspond exactement à ces critères."
  };
};

const schoolSearch = async ({ city, query }) => {
  const terms = [];
  const params = {};
  if (city) {
    terms.push("c.nom LIKE :city");
    params.city = `%${city}%`;
  }
  if (query) {
    terms.push("(s.nom LIKE :query OR s.description LIKE :query)");
    params.query = `%${query}%`;
  }
  const where = terms.length ? `WHERE ${terms.join(" AND ")}` : "";
  const [rows] = await pool.execute(
    `SELECT s.nom, s.statut, c.nom AS ville
     FROM schools s INNER JOIN cities c ON c.id = s.ville_id
     ${where} ORDER BY s.nom ASC LIMIT ${limit}`,
    params
  );
  const items = rows.map((row) => ({
    type: "school",
    title: row.nom,
    meta: `${row.ville} · ${row.statut}`,
    detail: "Établissement référencé dans STOON",
    url: "/pages/ecoles.html"
  }));
  return {
    items,
    reply: items.length
      ? `${items.length} établissement(s) trouvé(s)${city ? ` à ${city}` : ""}.`
      : "Aucun établissement ne correspond exactement à cette recherche."
  };
};

export const searchStoonData = async (search) => {
  if (search?.type === "housing") return housingSearch(search);
  if (search?.type === "ride") return rideSearch(search);
  if (search?.type === "job") return jobSearch(search);
  if (search?.type === "school") return schoolSearch(search);
  return { items: [], reply: "" };
};
