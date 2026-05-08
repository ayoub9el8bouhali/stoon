import { SlidersHorizontal } from "lucide-react";
import { cities, fields, schools } from "../../utils/constants.js";

export function FilterBar({ filters, onChange, showCategory = false }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-bar">
      <div className="filter-title">
        <SlidersHorizontal size={18} />
        Filtres
      </div>
      <select value={filters.city || ""} onChange={(event) => update("city", event.target.value)}>
        <option value="">Toutes les villes</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select value={filters.school || ""} onChange={(event) => update("school", event.target.value)}>
        <option value="">Toutes les écoles</option>
        {schools.map((school) => (
          <option key={school} value={school}>
            {school}
          </option>
        ))}
      </select>
      <select value={filters.fieldOfStudy || ""} onChange={(event) => update("fieldOfStudy", event.target.value)}>
        <option value="">Toutes les filières</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      {showCategory && (
        <select value={filters.category || ""} onChange={(event) => update("category", event.target.value)}>
          <option value="">Toutes les catégories</option>
          <option value="document">Documents</option>
          <option value="livre">Livres</option>
          <option value="materiel">Matériel</option>
          <option value="electronique">Électronique</option>
        </select>
      )}
      <select value={filters.sort || "recent"} onChange={(event) => update("sort", event.target.value)}>
        <option value="recent">Plus récents</option>
        <option value="priceAsc">Prix croissant</option>
        <option value="priceDesc">Prix décroissant</option>
        <option value="popular">Plus consultés</option>
      </select>
    </div>
  );
}
