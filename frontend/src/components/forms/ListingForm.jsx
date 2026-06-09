import { useState } from "react";
import { Upload } from "lucide-react";
import { AcademicSelects } from "../common/AcademicSelects.jsx";
import { moduleConfig } from "../../utils/constants.js";

const baseState = {
  module: "housing",
  title: "",
  description: "",
  city: "",
  school: "",
  fieldOfStudy: "",
  price: "",
  category: "document",
  type: "colocation",
  seatsAvailable: 1,
  capacity: 40,
  startsAt: "",
  departureCity: "Casablanca",
  destinationCity: "Rabat",
  company: "",
  opportunityType: "stage",
  workMode: "hybride"
};

export function ListingForm({ onSubmit }) {
  const [form, setForm] = useState(baseState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(form.module, {
        ...form,
        price: Number(form.price || 0),
        seatsAvailable: Number(form.seatsAvailable || 1),
        capacity: Number(form.capacity || 40)
      });
      setSubmitted(true);
      setForm(baseState);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Impossible de publier l'annonce.");
    }
  };

  return (
    <form className="stoon-form" onSubmit={handleSubmit}>
      {submitted && <div className="alert alert-success">Annonce publiée avec succès.</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Module</label>
          <select className="form-select" value={form.module} onChange={(event) => update("module", event.target.value)}>
            {Object.entries(moduleConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.plural}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Prix</label>
          <input
            className="form-control"
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder="Ex: 1800"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Titre</label>
          <input
            className="form-control"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            required
            minLength={4}
            placeholder="Ex: Chambre proche campus"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="5"
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            required
            minLength={15}
            placeholder="Décrivez l'annonce, les conditions et les détails utiles."
          />
        </div>
        <AcademicSelects
          value={form}
          onChange={(academic) => setForm((current) => ({ ...current, ...academic }))}
          required
        />

        {form.module === "marketplace" && (
          <div className="col-md-6">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={form.category} onChange={(event) => update("category", event.target.value)}>
              <option value="document">Document</option>
              <option value="livre">Livre</option>
              <option value="materiel">Matériel</option>
              <option value="electronique">Électronique</option>
            </select>
          </div>
        )}

        {form.module === "housing" && (
          <div className="col-md-6">
            <label className="form-label">Type de logement</label>
            <select className="form-select" value={form.type} onChange={(event) => update("type", event.target.value)}>
              <option value="colocation">Colocation</option>
              <option value="chambre">Chambre</option>
              <option value="studio">Studio</option>
              <option value="appartement">Appartement</option>
            </select>
          </div>
        )}

        {form.module === "rides" && (
          <>
            <div className="col-md-4">
              <label className="form-label">Départ</label>
              <input className="form-control" value={form.departureCity} onChange={(event) => update("departureCity", event.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Destination</label>
              <input
                className="form-control"
                value={form.destinationCity}
                onChange={(event) => update("destinationCity", event.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Places</label>
              <input
                className="form-control"
                type="number"
                min="1"
                value={form.seatsAvailable}
                onChange={(event) => update("seatsAvailable", event.target.value)}
              />
            </div>
          </>
        )}

        {form.module === "events" && (
          <>
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input
                className="form-control"
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) => update("startsAt", event.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Capacité</label>
              <input
                className="form-control"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => update("capacity", event.target.value)}
              />
            </div>
          </>
        )}

        {form.module === "jobs" && (
          <>
            <div className="col-md-6">
              <label className="form-label">Entreprise ou service</label>
              <input className="form-control" value={form.company} onChange={(event) => update("company", event.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={form.opportunityType}
                onChange={(event) => update("opportunityType", event.target.value)}
              >
                <option value="stage">Stage</option>
                <option value="job_etudiant">Job étudiant</option>
                <option value="service_freelance">Service freelance</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Mode</label>
              <select className="form-select" value={form.workMode} onChange={(event) => update("workMode", event.target.value)}>
                <option value="hybride">Hybride</option>
                <option value="presentiel">Présentiel</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </>
        )}

        <div className="col-12">
          <label className="upload-zone">
            <Upload size={22} />
            <span>Ajouter images ou PDF</span>
            <input type="file" multiple accept="image/*,.pdf" />
          </label>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-stoon-primary" type="submit">
          Publier l'annonce
        </button>
      </div>
    </form>
  );
}
