import { SearchX } from "lucide-react";

export function EmptyState({ title = "Aucun résultat", body = "Essayez de modifier la recherche ou les filtres." }) {
  return (
    <div className="empty-state">
      <SearchX size={42} />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
