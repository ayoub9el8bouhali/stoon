import fullLogoUrl from "../../assets/logos/stoon-logo-full.svg";
import symbolLogoUrl from "../../assets/logos/stoon-logo.svg";

export function BrandLogo({ full = false, className = "" }) {
  return (
    <span className={`brand-logo ${full ? "brand-logo-full" : "brand-logo-symbol"} ${className}`}>
      <img src={full ? fullLogoUrl : symbolLogoUrl} alt="STOON" />
    </span>
  );
}
