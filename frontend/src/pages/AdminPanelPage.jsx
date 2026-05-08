import { Flag, Shield, Users } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { StatCard } from "../components/dashboard/StatCard.jsx";
import { mockUsers } from "../utils/mockData.js";

export function AdminPanelPage() {
  const { allListings, notifications } = useData();
  const activeListings = allListings.filter((item) => item.status === "active").length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Admin Panel</h1>
          <p>Statistiques, signalements et supervision de la plateforme.</p>
        </div>
      </div>

      <div className="stats-grid admin-stats">
        <StatCard label="Utilisateurs" value={mockUsers.length} icon={Users} tone="cyan" />
        <StatCard label="Annonces actives" value={activeListings} icon={Shield} tone="magenta" />
        <StatCard label="Alertes" value={notifications.length} icon={Flag} tone="yellow" />
      </div>

      <section className="admin-table-panel">
        <h2>Dernières annonces</h2>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Module</th>
                <th>Ville</th>
                <th>École</th>
                <th>Statut</th>
                <th>Vues</th>
              </tr>
            </thead>
            <tbody>
              {allListings.slice(0, 10).map((item) => (
                <tr key={`${item.module}-${item.id}`}>
                  <td>{item.title}</td>
                  <td>{item.module}</td>
                  <td>{item.city}</td>
                  <td>{item.school}</td>
                  <td>
                    <span className="status-chip">{item.status}</span>
                  </td>
                  <td>{item.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
