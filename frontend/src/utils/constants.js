export const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda"];

export const schools = [
  "EMSI Casablanca",
  "UIR",
  "ENSA Marrakech",
  "Université Sidi Mohamed Ben Abdellah",
  "ENCG Tanger",
  "UM6P",
  "ENSAM Rabat"
];

export const fields = [
  "Informatique",
  "Médecine",
  "Commerce",
  "Finance",
  "Génie industriel",
  "Architecture",
  "Droit"
];

export const moduleConfig = {
  housing: {
    label: "Colocation",
    plural: "Colocations",
    route: "housing",
    apiPath: "/housing",
    accent: "cyan",
    empty: "Aucune colocation ne correspond aux filtres."
  },
  marketplace: {
    label: "Marketplace",
    plural: "Marketplace",
    route: "marketplace",
    apiPath: "/marketplace",
    accent: "magenta",
    empty: "Aucun produit ou document disponible."
  },
  rides: {
    label: "Covoiturage",
    plural: "Covoiturages",
    route: "rides",
    apiPath: "/rides",
    accent: "yellow",
    empty: "Aucun trajet trouvé."
  },
  events: {
    label: "Événements",
    plural: "Événements & voyages",
    route: "events",
    apiPath: "/events",
    accent: "cyan",
    empty: "Aucun événement disponible."
  },
  jobs: {
    label: "Jobs & services",
    plural: "Jobs, stages & services",
    route: "jobs",
    apiPath: "/jobs",
    accent: "magenta",
    empty: "Aucune opportunité trouvée."
  }
};

export const statusLabels = {
  active: "Actif",
  reserved: "Réservé",
  archived: "Archivé",
  sold: "Vendu",
  full: "Complet",
  cancelled: "Annulé",
  closed: "Clôturé"
};
