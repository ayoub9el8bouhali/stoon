import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar.jsx";

export function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="stoon-footer">
        <div className="container footer-grid">
          <div>
            <strong>ST00N</strong>
            <p>La plateforme centralisée de la vie étudiante au Maroc.</p>
          </div>
          <div>
            <span>Casablanca</span>
            <span>Rabat</span>
            <span>Marrakech</span>
            <span>Fès</span>
            <span>Tanger</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
