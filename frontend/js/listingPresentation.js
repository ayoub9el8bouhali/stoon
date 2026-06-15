const hasValue = value => value !== null && value !== undefined && value !== "";

const formatMoney = (value, suffix = "MAD") => {
  if (!hasValue(value)) return "Nous contacter";
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toLocaleString("fr-FR")} ${suffix}` : String(value);
};

const formatDate = value => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
};

const capitalize = value => value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

export function presentListing(item) {
  if (item.departureCity || item.destinationCity) {
    const seats = hasValue(item.seatsAvailable) ? `${item.seatsAvailable} places disponibles` : "";
    const date = formatDate(item.departureAt);
    return {
      city: item.departureCity || "Covoiturage",
      title: `${item.departureCity || "Départ"} → ${item.destinationCity || "Destination"}`,
      description: [item.school, date, seats, item.carModel].filter(Boolean).join(" · "),
      price: formatMoney(item.pricePerSeat, "MAD / place")
    };
  }

  if (item.company || item.opportunityType) {
    return {
      city: item.city || item.workMode || "Opportunité",
      title: item.title || "Opportunité étudiante",
      description: [item.company, capitalize(item.opportunityType), capitalize(item.workMode)].filter(Boolean).join(" · "),
      price: hasValue(item.salary) ? formatMoney(item.salary, "MAD/mois") : "Rémunération à préciser"
    };
  }

  if (item.nom) {
    return {
      city: item.ville_nom || "Maroc",
      title: item.nom,
      description: item.description || item.site_web || "Établissement d'enseignement supérieur",
      price: item.statut ? `Établissement ${String(item.statut).toLowerCase()}` : "Voir les formations"
    };
  }

  return {
    city: item.city || item.school || "Colocation",
    title: item.title || "Logement étudiant",
    description: [item.type, item.rooms ? `${item.rooms} chambres` : "", item.school, item.address]
      .filter(Boolean)
      .join(" · ") || item.description || "Annonce étudiante STOON",
    price: formatMoney(hasValue(item.price) ? item.price : item.monthlyRent, "MAD/mois")
  };
}
