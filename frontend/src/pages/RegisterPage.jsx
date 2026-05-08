import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { cities, fields, schools } from "../utils/constants.js";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: cities[0],
    school: schools[0],
    fieldOfStudy: fields[0],
    bio: ""
  });
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const result = await register(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="auth-card auth-card-wide">
      <BrandLogo />
      <h1>Créer un compte</h1>
      <p>La vérification email est simulée automatiquement.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="stoon-form">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Prénom</label>
            <input className="form-control" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nom</label>
            <input className="form-control" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-control"
              type="password"
              minLength="8"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Ville</label>
            <select className="form-select" value={form.city} onChange={(event) => update("city", event.target.value)}>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">École</label>
            <select className="form-select" value={form.school} onChange={(event) => update("school", event.target.value)}>
              {schools.map((school) => (
                <option key={school}>{school}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Filière</label>
            <select className="form-select" value={form.fieldOfStudy} onChange={(event) => update("fieldOfStudy", event.target.value)}>
              {fields.map((field) => (
                <option key={field}>{field}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows="3" value={form.bio} onChange={(event) => update("bio", event.target.value)} />
          </div>
        </div>
        <button className="btn btn-stoon-primary w-100 mt-3" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      <p className="auth-switch">
        Déjà membre ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
