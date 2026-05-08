import { Bell, Briefcase, CalendarDays, Car, Heart, House, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalyticsPanel } from "../components/dashboard/AnalyticsPanel.jsx";
import { StatCard } from "../components/dashboard/StatCard.jsx";
import { ListingCard } from "../components/common/ListingCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

export function DashboardPage() {
  const { user } = useAuth();
  const { listings, allListings, favorites, notifications, conversations } = useData();
  const recent = allListings.slice(0, 3);

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Bonjour {user?.firstName}</h1>
          <p>Vue centralisée de votre activité ST00N.</p>
        </div>
        <Link className="btn btn-stoon-primary" to="/creer-annonce">
          Publier une annonce
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard label="Colocations" value={listings.housing.length} icon={House} tone="cyan" />
        <StatCard label="Marketplace" value={listings.marketplace.length} icon={ShoppingBag} tone="magenta" />
        <StatCard label="Trajets" value={listings.rides.length} icon={Car} tone="yellow" />
        <StatCard label="Événements" value={listings.events.length} icon={CalendarDays} tone="cyan" />
        <StatCard label="Jobs" value={listings.jobs.length} icon={Briefcase} tone="magenta" />
        <StatCard label="Favoris" value={favorites.length} icon={Heart} tone="yellow" />
        <StatCard label="Messages" value={conversations.length} icon={MessageCircle} tone="cyan" />
        <StatCard label="Alertes" value={notifications.filter((item) => !item.isRead).length} icon={Bell} tone="magenta" />
      </div>

      <div className="dashboard-grid">
        <AnalyticsPanel />
        <section className="reputation-panel">
          <div className="section-heading">
            <h2>Réputation</h2>
            <p>Score basé sur les avis étudiants.</p>
          </div>
          <div className="reputation-score">
            <Star size={30} />
            <strong>{user?.reputation || 4.5}</strong>
            <span>/ 5</span>
          </div>
          <div className="mini-feed">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id}>
                <span>{notification.title}</span>
                <small>{notification.body}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="section-band no-padding-band">
        <div className="section-heading">
          <h2>Annonces récentes</h2>
          <p>Dernières publications de la communauté.</p>
        </div>
        <div className="listing-grid listing-grid-compact">
          {recent.map((item) => (
            <ListingCard key={`${item.module}-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
