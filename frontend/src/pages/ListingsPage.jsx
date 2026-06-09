import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FilterBar } from "../components/common/FilterBar.jsx";
import { ListingCard } from "../components/common/ListingCard.jsx";
import { SearchBar } from "../components/common/SearchBar.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { Pagination } from "../components/common/Pagination.jsx";
import { useData } from "../context/DataContext.jsx";
import { useAcademicCatalog } from "../context/AcademicCatalogContext.jsx";
import { OTHER_SCHOOL_VALUE, isOtherSchool } from "../utils/academicCatalog.js";
import { moduleConfig } from "../utils/constants.js";

const pageSize = 6;

export function ListingsPage() {
  const { module } = useParams();
  const activeModule = module && moduleConfig[module] ? module : "all";
  const { allListings } = useData();
  const { catalog } = useAcademicCatalog();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ sort: "recent" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const source = activeModule === "all" ? allListings : allListings.filter((item) => item.module === activeModule);
    const normalizedQuery = query.trim().toLowerCase();

    const result = source.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.description, item.city, item.school, item.fieldOfStudy, item.company]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCity = !filters.city || item.city === filters.city;
      const matchesSchool =
        !filters.school ||
        item.school === filters.school ||
        (filters.school === OTHER_SCHOOL_VALUE && isOtherSchool(catalog, item.city, item.school));
      const matchesField = !filters.fieldOfStudy || item.fieldOfStudy === filters.fieldOfStudy || item.fieldOfStudy === "Toutes filières";
      const matchesCategory = !filters.category || item.category === filters.category;

      return matchesQuery && matchesCity && matchesSchool && matchesField && matchesCategory;
    });

    return result.sort((a, b) => {
      if (filters.sort === "priceAsc") return Number(a.price || 0) - Number(b.price || 0);
      if (filters.sort === "priceDesc") return Number(b.price || 0) - Number(a.price || 0);
      if (filters.sort === "popular") return Number(b.views || 0) - Number(a.views || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [activeModule, allListings, catalog, filters, query]);

  const pages = Math.ceil(filtered.length / pageSize) || 1;
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const title = activeModule === "all" ? "Toutes les annonces" : moduleConfig[activeModule].plural;

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <div>
            <h1>{title}</h1>
            <p>Recherche, tri et filtres dynamiques par ville, école et filière.</p>
          </div>
          <Link className="btn btn-stoon-primary" to="/creer-annonce">
            Publier une annonce
          </Link>
        </div>

        <div className="catalog-toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Rechercher une annonce, une école ou une ville" />
          <FilterBar
            filters={filters}
            onChange={(nextFilters) => {
              setFilters(nextFilters);
              setPage(1);
            }}
            showCategory={activeModule === "marketplace" || activeModule === "all"}
          />
        </div>

        {visible.length > 0 ? (
          <>
            <div className="listing-grid">
              {visible.map((item) => (
                <ListingCard key={`${item.module}-${item.id}`} item={item} />
              ))}
            </div>
            <Pagination page={currentPage} pages={pages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState body={activeModule === "all" ? "Aucune annonce trouvée." : moduleConfig[activeModule].empty} />
        )}
      </div>
    </section>
  );
}
