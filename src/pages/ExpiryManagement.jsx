import SimplePage from "../components/SimplePage";

const data = [
  { id: 1, medicine: "Ceftriaxone 1g",     batch: "B-2041", qty: 24, expiry: "2026-03-08", days: 8 },
  { id: 2, medicine: "Insulin Glargine",   batch: "B-1189", qty: 12, expiry: "2026-03-14", days: 14 },
  { id: 3, medicine: "Azithromycin 500",   batch: "B-3321", qty: 40, expiry: "2026-03-21", days: 21 },
  { id: 4, medicine: "Salbutamol Inhaler", batch: "B-0912", qty: 18, expiry: "2026-03-26", days: 26 },
  { id: 5, medicine: "Amoxicillin 500mg",  batch: "B-4401", qty: 60, expiry: "2026-06-15", days: 107 },
];

const columns = [
  { key: "medicine", label: "Medicine", render: (v) => <span className="cell-strong">{v}</span> },
  { key: "batch",    label: "Batch", render: (v) => <span className="cell-muted">{v}</span> },
  { key: "qty",      label: "Quantity", align: "right" },
  { key: "expiry",   label: "Expiry date" },
  { key: "days",     label: "Days left", align: "right", render: (v) => (
    <span className={`badge ${v <= 10 ? "badge-danger" : v <= 30 ? "badge-warning" : "badge-neutral"}`}>{v} days</span>
  )},
];

export default function ExpiryManagement() {
  return <SimplePage title="Expiry tracking" addLabel="Add alert" columns={columns} data={data} />;
}