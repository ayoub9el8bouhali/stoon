import { CalendarDays, Flag, Heart, MapPin, MessageCircle, Star, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BootstrapModal } from "../components/common/BootstrapModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { moduleConfig, statusLabels } from "../utils/constants.js";
import { formatDate, formatPrice, fullName } from "../utils/formatters.js";
import { mockUsers } from "../utils/mockData.js";

export function ListingDetailPage() {
  const { module, id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { allListings, favorites, reserve, toggleFavorite } = useData();
  const item = allListings.find((listing) => listing.module === module && listing.id === Number(id));

  if (!item) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="empty-state">
            <h1>Annonce introuvable</h1>
            <Link className="btn btn-stoon-primary" to="/annonces">
              Retour aux annonces
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const owner = item.owner || mockUsers.find((candidate) => candidate.id === item.ownerId);
  const config = moduleConfig[item.module];
  const favorited = favorites.some((favorite) => favorite.module === item.module && favorite.id === item.id);
  const canReserve = item.module === "rides" || item.module === "events";

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    reserve(item.module, item.id, 1);
  };

  return (
    <section className="page-section">
      <div className="container detail-grid">
        <article className="detail-main">
          <div className={`detail-hero detail-${config.accent}`}>
            <span>{config.label}</span>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>

          <div className="detail-panel">
            <h2>Détails</h2>
            <div className="detail-facts">
              <span>
                <MapPin size={18} /> {item.city}
              </span>
              <span>
                <Users size={18} /> {item.school}
              </span>
              <span>
                <CalendarDays size={18} /> {formatDate(item.startsAt || item.departureAt || item.availableFrom || item.deadline)}
              </span>
              <span>
                <Star size={18} /> {statusLabels[item.status] || "Actif"}
              </span>
            </div>

            {item.module === "housing" && (
              <div className="tag-row">
                {(item.amenities || []).map((amenity) => (
                  <span key={amenity}>{amenity}</span>
                ))}
              </div>
            )}

            {item.module === "rides" && (
              <div className="route-strip">
                <strong>{item.departureCity}</strong>
                <span />
                <strong>{item.destinationCity}</strong>
                <small>{item.seatsAvailable} place(s) disponible(s)</small>
              </div>
            )}

            {item.module === "events" && (
              <div className="progress stoon-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${Math.round(((item.reservedSeats || 0) / item.capacity) * 100)}%` }}
                />
              </div>
            )}

            {item.module === "jobs" && (
              <div className="tag-row">
                {(item.skills || []).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="detail-sidebar">
          <div className="price-panel">
            <span>Prix</span>
            <strong>{formatPrice(item.price)}</strong>
            {item.salary && <small>{item.salary}</small>}
            {canReserve ? (
              <button className="btn btn-stoon-primary w-100" data-bs-toggle="modal" data-bs-target="#reserveModal">
                Réserver
              </button>
            ) : (
              <button className="btn btn-stoon-primary w-100" data-bs-toggle="modal" data-bs-target="#contactModal">
                Contacter
              </button>
            )}
            <button className="btn btn-stoon-outline w-100" onClick={() => toggleFavorite(item.module, item.id)}>
              <Heart size={18} /> {favorited ? "Retiré des favoris" : "Ajouter aux favoris"}
            </button>
            <button className="btn btn-dark-soft w-100" data-bs-toggle="modal" data-bs-target="#reportModal">
              <Flag size={18} /> Signaler
            </button>
          </div>

          <div className="owner-panel">
            <div className="avatar-lg">{owner?.firstName?.charAt(0)}</div>
            <h3>{fullName(owner)}</h3>
            <p>{owner?.school}</p>
            <span>
              <Star size={16} /> Réputation {owner?.reputation}
            </span>
          </div>
        </aside>
      </div>

      <BootstrapModal
        id="reserveModal"
        title="Confirmer la réservation"
        footer={
          <button type="button" className="btn btn-stoon-primary" data-bs-dismiss="modal" onClick={handleReserve}>
            Confirmer
          </button>
        }
      >
        <p>La réservation sera enregistrée et le propriétaire recevra une notification.</p>
      </BootstrapModal>

      <BootstrapModal
        id="contactModal"
        title="Contacter l'étudiant"
        footer={
          <Link className="btn btn-stoon-primary" to="/messagerie" data-bs-dismiss="modal">
            Ouvrir la messagerie
          </Link>
        }
      >
        <p>
          Envoyez un message privé à {owner?.firstName}. Les conversations ST00N simulent le temps réel avec état local.
        </p>
      </BootstrapModal>

      <BootstrapModal
        id="reportModal"
        title="Signaler l'annonce"
        footer={
          <button type="button" className="btn btn-stoon-primary" data-bs-dismiss="modal">
            Envoyer le signalement
          </button>
        }
      >
        <label className="form-label">Raison</label>
        <textarea className="form-control" rows="4" placeholder="Expliquez brièvement le problème." />
      </BootstrapModal>
    </section>
  );
}
