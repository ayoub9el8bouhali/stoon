import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Rechercher sur ST00N" }) {
  return (
    <div className="search-shell">
      <Search size={20} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
