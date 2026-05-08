import { Link } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo.jsx";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <BrandLogo />
      <h1>Page introuvable</h1>
      <p>Cette route ST00N n'existe pas ou a été déplacée.</p>
      <Link className="btn btn-stoon-primary" to="/">
        Retour à l'accueil
      </Link>
    </main>
  );
}
