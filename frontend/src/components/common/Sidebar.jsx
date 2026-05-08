import {
  Bell,
  Briefcase,
  CalendarDays,
  Car,
  Home,
  House,
  LayoutDashboard,
  MessageCircle,
  PlusCircle,
  Settings,
  Shield,
  ShoppingBag,
  User
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { BrandLogo } from "./BrandLogo.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/", label: "Accueil", icon: Home },
  { to: "/annonces/housing", label: "Colocation", icon: House },
  { to: "/annonces/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/annonces/rides", label: "Covoiturage", icon: Car },
  { to: "/annonces/events", label: "Événements", icon: CalendarDays },
  { to: "/annonces/jobs", label: "Jobs & services", icon: Briefcase },
  { to: "/creer-annonce", label: "Publier", icon: PlusCircle },
  { to: "/messagerie", label: "Messagerie", icon: MessageCircle },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profil", label: "Profil", icon: User },
  { to: "/parametres", label: "Paramètres", icon: Settings }
];

export function Sidebar() {
  const { user } = useAuth();
  const items = user?.role === "admin" ? [...navItems, { to: "/admin", label: "Admin", icon: Shield }] : navItems;

  return (
    <aside className="stoon-sidebar">
      <div className="sidebar-brand">
        <BrandLogo />
      </div>
      <nav className="sidebar-nav">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="sidebar-link">
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
