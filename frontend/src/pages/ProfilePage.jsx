import { useState } from "react";
import { Camera, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { fields, cities, schools } from "../utils/constants.js";
import { fullName } from "../utils/formatters.js";

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { reviews, allListings } = useData();
  const [form, setForm] = useState(user);
  const userReviews = reviews.filter((review) => review.targetUserId === user?.id);
  const publications = allListings.filter((item) => item.ownerId === user?.id);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    updateUser(form);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Profil utilisateur</h1>
          <p>Votre identité étudiante, réputation et annonces publiées.</p>
        </div>
      </div>

      <div className="profile-grid">
        <aside className="profile-card">
          <div className="avatar-xl">{user?.firstName?.charAt(0)}</div>
          <h2>{fullName(user)}</h2>
          <p>{user?.school}</p>
          <span className="score-chip">
            <Star size={16} /> {user?.reputation || 4.5}
          </span>
          <div className="profile-stats">
            <span>
              <strong>{publications.length}</strong>
              annonces
            </span>
            <span>
              <strong>{userReviews.length}</strong>
              avis
            </span>
          </div>
        </aside>

        <section className="profile-form-panel">
          <form className="stoon-form" onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input className="form-control" value={form?.firstName || ""} onChange={(event) => update("firstName", event.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input className="form-control" value={form?.lastName || ""} onChange={(event) => update("lastName", event.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ville</label>
                <select className="form-select" value={form?.city || ""} onChange={(event) => update("city", event.target.value)}>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">École</label>
                <select className="form-select" value={form?.school || ""} onChange={(event) => update("school", event.target.value)}>
                  {schools.map((school) => (
                    <option key={school}>{school}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Filière</label>
                <select
                  className="form-select"
                  value={form?.fieldOfStudy || ""}
                  onChange={(event) => update("fieldOfStudy", event.target.value)}
                >
                  {fields.map((field) => (
                    <option key={field}>{field}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Photo</label>
                <label className="upload-zone">
                  <Camera size={22} />
                  <span>Importer une photo de profil</span>
                  <input type="file" accept="image/*" />
                </label>
              </div>
              <div className="col-12">
                <label className="form-label">Bio</label>
                <textarea className="form-control" rows="4" value={form?.bio || ""} onChange={(event) => update("bio", event.target.value)} />
              </div>
            </div>
            <button className="btn btn-stoon-primary mt-3" type="submit">
              Enregistrer
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
