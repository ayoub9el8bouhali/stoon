import { useState } from "react";
import { Moon, ShieldCheck } from "lucide-react";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: true,
    messages: true,
    reservations: true,
    newsletter: false
  });

  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Paramètres</h1>
          <p>Préférences de notifications, sécurité et affichage.</p>
        </div>
      </div>

      <section className="settings-grid">
        <div className="settings-panel dark-settings">
          <Moon size={24} />
          <h2>Mode sombre partiel</h2>
          <p>Interface dashboard en noir/cyan avec cartes claires pour la lisibilité.</p>
          <label className="switch-line">
            <span>Activer</span>
            <input type="checkbox" checked={settings.darkMode} onChange={() => toggle("darkMode")} />
          </label>
        </div>
        <div className="settings-panel">
          <ShieldCheck size={24} />
          <h2>Sécurité</h2>
          <p>JWT côté API, mots de passe hashés et vérification email simulée.</p>
          {["messages", "reservations", "newsletter"].map((key) => (
            <label className="switch-line" key={key}>
              <span>
                {key === "messages" && "Notifications messages"}
                {key === "reservations" && "Notifications réservations"}
                {key === "newsletter" && "Résumé hebdomadaire"}
              </span>
              <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
