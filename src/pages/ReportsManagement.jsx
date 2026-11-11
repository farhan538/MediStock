import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Download } from "lucide-react";

const monthly = [
  { month: "Sep", revenue: 82000 },
  { month: "Oct", revenue: 94000 },
  { month: "Nov", revenue: 108000 },
  { month: "Dec", revenue: 121000 },
  { month: "Jan", revenue: 98000 },
  { month: "Feb", revenue: 131700 },
];

export default function ReportsManagement() {
  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Business reports</h2><p>Revenue and performance summary</p></div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Download size={15} /> Download</button>
        </div>
      </div>

      <div className="dash-kpis">
        <div className="card kpi">
          <div className="kpi-head"><span className="kpi-label">Revenue (this month)</span></div>
          <div className="kpi-value">₹1,31,700</div>
          <div className="kpi-delta up"><span>+12.4%</span><span className="kpi-delta-label">vs last month</span></div>
        </div>
        <div className="card kpi">
          <div className="kpi-head"><span className="kpi-label">Total sales</span></div>
          <div className="kpi-value">1,284</div>
          <div className="kpi-delta up"><span>+8.1%</span><span className="kpi-delta-label">vs last month</span></div>
        </div>
        <div className="card kpi">
          <div className="kpi-head"><span className="kpi-label">Avg. order value</span></div>
          <div className="kpi-value">₹642</div>
          <div className="kpi-delta up"><span>+3.2%</span><span className="kpi-delta-label">vs last month</span></div>
        </div>
        <div className="card kpi">
          <div className="kpi-head"><span className="kpi-label">Return rate</span></div>
          <div className="kpi-value">1.4%</div>
          <div className="kpi-delta down"><span>-0.3%</span><span className="kpi-delta-label">vs last month</span></div>
        </div>
      </div>

      <div className="card dash-card">
        <div className="dash-card-head">
          <div><h3>Monthly revenue</h3><p>Last 6 months</p></div>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} cursor={{ fill: "rgba(13,148,136,.05)" }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {monthly.map((_, i) => <Cell key={i} fill="#0D9488" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}