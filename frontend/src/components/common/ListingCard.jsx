import { CalendarDays, Eye, Heart, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { moduleConfig, statusLabels } from "../../utils/constants.js";
import { formatDate, formatPrice } from "../../utils/formatters.js";
import { mockUsers } from "../../utils/mockData.js";

const gradientClass = {
  cyan: "card-accent-cyan",
  magenta: "card-accent-magenta",
  yellow: "card-accent-yellow"
};

export function ListingCard({ item }) {
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite } = useData();
  const config = moduleConfig[item.module];
  const owner = item.owner || mockUsers.find((user) => user.id === item.ownerId);
  const favorited = favorites.some((favorite) => favorite.module === item.module && favorite.id === item.id);
  const route = `/annonces/${item.module}/${item.id}`;

  const metaLine =
    item.module === "rides"
      ? `${item.departureCity} → ${item.destinationCity}`
      : item.module === "events"
        ? item.venue
        : item.address || item.company || item.category;

  return (
    <article className={`listing-card card ${gradientClass[config?.accent] || ""}`}>
      <div className="listing-media">
        <span>{config?.label}</span>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between gap-2">
          <span className="status-chip">{statusLabels[item.status] || "Actif"}</span>
          {isAuthenticated && (
            <button
              className={`icon-button ${favorited ? "active" : ""}`}
              onClick={() => toggleFavorite(item.module, item.id)}
              aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={18} />
            </button>
          )}
        </div>
        <h3 className="listing-title">{item.title}</h3>
        <p className="listing-description">{item.description}</p>
        <div className="listing-meta">
          <span>
            <MapPin size={16} /> {item.city}
          </span>
          <span>
            <Users size={16} /> {item.school}
          </span>
          <span>
            <Eye size={16} /> {item.views}
          </span>
        </div>
        <div className="listing-meta">
          <span>
            <CalendarDays size={16} />{" "}
            {item.startsAt || item.departureAt ? formatDate(item.startsAt || item.departureAt) : metaLine}
          </span>
        </div>
        <div className="listing-footer">
          <div>
            <strong>{formatPrice(item.price)}</strong>
            {item.module === "rides" && <small>/place</small>}
          </div>
          <div className="owner-mini">
            <Star size={15} />
            {owner?.reputation || 4.5}
          </div>
          <Link className="btn btn-stoon-dark" to={route}>
            Détails
          </Link>
        </div>
      </div>
    </article>
  );
}
