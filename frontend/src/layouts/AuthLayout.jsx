import { Outlet } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo.jsx";

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-visual">
        <BrandLogo />
        <h1>ST00N rassemble les étudiants marocains autour des vrais besoins campus.</h1>
        <p>Colocation, documents, trajets, événements, services, stages et jobs dans un seul espace.</p>
      </section>
      <section className="auth-panel">
        <Outlet />
      </section>
    </main>
  );
}
