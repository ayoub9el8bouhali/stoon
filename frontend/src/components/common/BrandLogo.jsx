import logoUrl from "../../assets/logos/stoon-logo.svg";

export function BrandLogo({ compact = false, className = "" }) {
  return (
    <span className={`brand-logo ${compact ? "brand-logo-compact" : ""} ${className}`}>
      <img src={logoUrl} alt="ST00N" />
      {!compact && <span className="brand-logo-text">Stoon</span>}
    </span>
  );
}
