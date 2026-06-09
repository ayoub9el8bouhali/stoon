import { SlidersHorizontal } from "lucide-react";
import { AcademicSelects } from "./AcademicSelects.jsx";

export function FilterBar({ filters, onChange, showCategory = false }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-bar">
      <div className="filter-title">
        <SlidersHorizontal size={18} />
        Filtres
      </div>
      <AcademicSelects
        value={filters}
        onChange={(academic) => onChange({ ...filters, ...academic })}
        layout="filter"
        allowAll
      />
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
