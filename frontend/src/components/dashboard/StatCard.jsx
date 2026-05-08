export function StatCard({ label, value, icon: Icon, tone = "cyan" }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={22} />}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
