import { Bell, LayoutDashboard, LogOut, Menu, PlusCircle, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { BrandLogo } from "./BrandLogo.jsx";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const unread = notifications.filter((item) => !item.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg stoon-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <BrandLogo />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#stoonNavbar"
          aria-controls="stoonNavbar"
          aria-expanded="false"
          aria-label="Afficher le menu"
        >
          <Menu size={22} />
        </button>
        <div className="collapse navbar-collapse" id="stoonNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/annonces/housing">
                Colocation
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/annonces/marketplace">
                Marketplace
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/annonces/rides">
                Covoiturage
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/annonces/events">
                Événements
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/annonces/jobs">
                Jobs
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link className="btn btn-stoon-outline position-relative" to="/notifications" title="Notifications">
                  <Bell size={18} />
                  {unread > 0 && <span className="notification-dot">{unread}</span>}
                </Link>
                <Link className="btn btn-stoon-primary" to="/creer-annonce">
                  <PlusCircle size={18} />
                  Publier
                </Link>
                <div className="dropdown">
                  <button
                    className="btn btn-dark-soft dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <User size={18} />
                    {user?.firstName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profil">
                        <User size={16} /> Profil
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link className="btn btn-stoon-outline" to="/login">
                  Connexion
                </Link>
                <Link className="btn btn-stoon-primary" to="/register">
                  Rejoindre
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
