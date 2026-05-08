import { ArrowRight, Briefcase, CalendarDays, Car, House, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ListingCard } from "../components/common/ListingCard.jsx";
import { SearchBar } from "../components/common/SearchBar.jsx";
import { useData } from "../context/DataContext.jsx";
import { moduleConfig } from "../utils/constants.js";
import { useState } from "react";

const moduleIcons = {
  housing: House,
  marketplace: ShoppingBag,
  rides: Car,
  events: CalendarDays,
  jobs: Briefcase
};

export function HomePage() {
  const { allListings } = useData();
  const [query, setQuery] = useState("");

  const featured = allListings
    .filter((item) => `${item.title} ${item.city} ${item.school}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Stoon connecte la vie étudiante au Maroc.</h1>
            <p>
              Colocation, documents, covoiturage, événements, services et stages, organisés par ville, école et filière.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-stoon-primary btn-lg" to="/annonces">
                Explorer <ArrowRight size={19} />
              </Link>
              <Link className="btn btn-stoon-outline btn-lg" to="/register">
                Créer un compte
              </Link>
            </div>
          </div>
          <div className="hero-product">
            <div className="hero-product-header">
              <Sparkles size={20} />
              <span>Recherche globale ST00N</span>
            </div>
            <SearchBar value={query} onChange={setQuery} placeholder="Ville, école, annonce, filière..." />
            <div className="hero-module-grid">
              {Object.entries(moduleConfig).map(([key, config]) => {
                const Icon = moduleIcons[key];
                return (
                  <Link key={key} className={`module-tile tile-${config.accent}`} to={`/annonces/${key}`}>
                    <Icon size={24} />
                    <span>{config.plural}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container">
          <div className="section-heading">
            <h2>Annonces actives</h2>
            <p>Les opportunités les plus consultées par les étudiants cette semaine.</p>
          </div>
          <div className="listing-grid">
            {featured.map((item) => (
              <ListingCard key={`${item.module}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="dark-band">
        <div className="container dark-band-grid">
          <div>
            <h2>Une expérience pensée pour les campus marocains.</h2>
            <p>
              ST00N combine filtres dynamiques, messagerie simulée, favoris, réservations, avis et dashboard analytique
              pour accélérer les échanges fiables entre étudiants.
            </p>
          </div>
          <div className="metric-strip">
            <span>
              <strong>7</strong>
              villes
            </span>
            <span>
              <strong>5</strong>
              modules
            </span>
            <span>
              <strong>24h</strong>
              publication
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
