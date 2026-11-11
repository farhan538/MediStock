import { Pill, AlertTriangle, CalendarClock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const salesTrend = [
  { day: "Mon", sales: 12400 }, { day: "Tue", sales: 18200 },
  { day: "Wed", sales: 15600 }, { day: "Thu", sales: 22100 },
  { day: "Fri", sales: 19800 }, { day: "Sat", sales: 26400 },
  { day: "Sun", sales: 17200 },
];

const categoryMix = [
  { name: "Antibiotics", value: 32, color: "#0D9488" },
  { name: "Analgesics",  value: 24, color: "#0EA5E9" },
  { name: "Vitamins",    value: 18, color: "#8B5CF6" },
  { name: "Cardiac",     value: 14, color: "#F59E0B" },
  { name: "Others",      value: 12, color: "#94A3B8" },
];

const lowStock = [
  { name: "Amoxicillin 500mg", qty: 6,  threshold: 20, unit: "strips" },
  { name: "Paracetamol 650mg", qty: 12, threshold: 40, unit: "strips" },
  { name: "Metformin 500mg",   qty: 8,  threshold: 25, unit: "strips" },
  { name: "Atorvastatin 10mg", qty: 3,  threshold: 15, unit: "strips" },
];

const expiring = [
  { name: "Ceftriaxone 1g",     batch: "B-2041", days: 8,  qty: 24 },
  { name: "Insulin Glargine",   batch: "B-1189", days: 14, qty: 12 },
  { name: "Azithromycin 500",   batch: "B-3321", days: 21, qty: 40 },
  { name: "Salbutamol Inhaler", batch: "B-0912", days: 26, qty: 18 },
];

export default function Dashboard() {
  return (
    <div className="dash">
      <div className="dash-kpis">
        <KpiCard label="Total medicines" value="1,284" delta="+3.2%" trend="up" icon={Pill} />
        <KpiCard label="Low stock items" value="18" delta="+4" trend="down" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Expiring this month" value="7" delta="-2" trend="up" icon={CalendarClock} tone="danger" />
        <KpiCard label="Sales today" value="₹26,400" delta="+12.4%" trend="up" icon={TrendingUp} tone="success" />
      </div>

      <div className="dash-row">
        <div className="card dash-card">
          <div className="dash-card-head">
            <div><h3>Sales this week</h3><p>Daily revenue from point of sale</p></div>
            <div className="dash-total"><span>Total</span><strong>₹1,31,700</strong></div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString()}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="#0D9488" strokeWidth={2.5} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card dash-card">
          <div className="dash-card-head">
            <div><h3>Category mix</h3><p>By sales share</p></div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} paddingAngle={3} stroke="none">
                  {categoryMix.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-legend">
            {categoryMix.map((c) => (
              <div key={c.name} className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: c.color }} />
                <span>{c.name}</span>
                <strong>{c.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-row">
        <div className="card dash-card">
          <div className="dash-card-head">
            <div><h3>Low stock alerts</h3><p>Reorder soon</p></div>
            <a href="/stock" className="btn btn-ghost btn-sm">View all <ArrowUpRight size={14} /></a>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Medicine</th><th className="right">In stock</th><th className="right">Reorder at</th><th>Status</th></tr></thead>
              <tbody>
                {lowStock.map((m) => (
                  <tr key={m.name}>
                    <td className="cell-strong">{m.name}</td>
                    <td className="right">{m.qty} <span className="cell-muted">{m.unit}</span></td>
                    <td className="right cell-muted">{m.threshold}</td>
                    <td><span className={`badge ${m.qty < 5 ? "badge-danger" : "badge-warning"}`}><span className="badge-dot" />{m.qty < 5 ? "Critical" : "Low"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card dash-card">
          <div className="dash-card-head">
            <div><h3>Expiring soon</h3><p>Within 30 days</p></div>
            <a href="/expiry" className="btn btn-ghost btn-sm">View all <ArrowUpRight size={14} /></a>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Medicine</th><th>Batch</th><th className="right">Qty</th><th className="right">Expires in</th></tr></thead>
              <tbody>
                {expiring.map((e) => (
                  <tr key={e.batch}>
                    <td className="cell-strong">{e.name}</td>
                    <td className="cell-muted">{e.batch}</td>
                    <td className="right">{e.qty}</td>
                    <td className="right"><span className={`badge ${e.days <= 10 ? "badge-danger" : e.days <= 20 ? "badge-warning" : "badge-neutral"}`}>{e.days} days</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, delta, trend, icon: Icon, tone = "neutral" }) {
  const tones = {
    neutral: { icon: "var(--brand-50)", fg: "var(--brand-600)" },
    warning: { icon: "var(--warning-bg)", fg: "var(--warning)" },
    danger:  { icon: "var(--danger-bg)",  fg: "var(--danger)" },
    success: { icon: "var(--success-bg)", fg: "var(--success)" },
  }[tone];

  return (
    <div className="card kpi">
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon" style={{ background: tones.icon, color: tones.fg }}><Icon size={16} /></div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-delta ${trend}`}>
        {trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        <span>{delta}</span>
        <span className="kpi-delta-label">vs last week</span>
      </div>
    </div>
  );
}