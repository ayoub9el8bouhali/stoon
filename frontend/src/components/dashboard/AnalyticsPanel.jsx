import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", annonces: 24, reservations: 11 },
  { month: "Fév", annonces: 31, reservations: 18 },
  { month: "Mar", annonces: 45, reservations: 29 },
  { month: "Avr", annonces: 58, reservations: 41 },
  { month: "Mai", annonces: 76, reservations: 54 }
];

export function AnalyticsPanel() {
  return (
    <section className="analytics-panel">
      <div className="section-heading">
        <h2>Activité campus</h2>
        <p>Évolution simulée des publications et réservations.</p>
      </div>
      <div className="chart-shell">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="annoncesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="reservationsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D500F9" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#D500F9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E7" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Area type="monotone" dataKey="annonces" stroke="#00E5FF" fill="url(#annoncesGradient)" strokeWidth={3} />
            <Area
              type="monotone"
              dataKey="reservations"
              stroke="#D500F9"
              fill="url(#reservationsGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
