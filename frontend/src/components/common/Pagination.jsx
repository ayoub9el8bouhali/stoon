import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="pagination-shell">
      <button className="icon-button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={18} />
      </button>
      <span>
        Page {page} / {pages}
      </span>
      <button className="icon-button" disabled={page === pages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
