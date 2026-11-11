import SimplePage from "../components/SimplePage";

const data = [
  { id: 1, batch: "B-2041", medicine: "Amoxicillin 500mg", supplier: "Cipla",    qty: 240, mfg: "2025-08-12", expiry: "2026-08-12", status: "Active" },
  { id: 2, batch: "B-1189", medicine: "Paracetamol 650mg", supplier: "Sun Pharma", qty: 500, mfg: "2025-02-20", expiry: "2027-02-28", status: "Active" },
  { id: 3, batch: "B-3321", medicine: "Metformin 500mg",   supplier: "USV",      qty: 180, mfg: "2024-11-05", expiry: "2026-05-20", status: "Active" },
  { id: 4, batch: "B-0912", medicine: "Atorvastatin 10mg", supplier: "Zydus",    qty: 90,  mfg: "2024-09-15", expiry: "2026-03-15", status: "Expiring" },
];

const columns = [
  { key: "batch",    label: "Batch ID" },
  { key: "medicine", label: "Medicine", render: (v) => <span className="cell-strong">{v}</span> },
  { key: "supplier", label: "Supplier" },
  { key: "qty",      label: "Quantity", align: "right" },
  { key: "mfg",      label: "Mfg date" },
  { key: "expiry",   label: "Expiry" },
  { key: "status",   label: "Status", render: (v) => (
    <span className={`badge ${v === "Active" ? "badge-success" : "badge-warning"}`}>
      <span className="badge-dot" />{v}
    </span>
  )},
];

export default function BatchManagement() {
  return <SimplePage title="Batch management" addLabel="New batch" columns={columns} data={data} />;
}