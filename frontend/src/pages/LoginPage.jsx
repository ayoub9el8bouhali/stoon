import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { BrandLogo } from "../components/common/BrandLogo.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "yassine@stoon.ma", password: "Stoon2026!" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="auth-card">
      <BrandLogo />
      <h1>Connexion</h1>
      <p>Accédez à votre espace ST00N.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="stoon-form">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <label className="form-label">Mot de passe</label>
        <input
          className="form-control"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <button className="btn btn-stoon-primary w-100" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="auth-switch">
        Nouveau sur ST00N ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  );
}
