import SimplePage from "../components/SimplePage";

const data = [
  { id: 1, medicine: "Amoxicillin 500mg", current: 6,  min: 20, max: 100, location: "Shelf A-3", updated: "2 hrs ago" },
  { id: 2, medicine: "Paracetamol 650mg", current: 12, min: 40, max: 200, location: "Shelf B-1", updated: "5 hrs ago" },
  { id: 3, medicine: "Metformin 500mg",   current: 8,  min: 25, max: 120, location: "Shelf C-2", updated: "1 day ago" },
  { id: 4, medicine: "Atorvastatin 10mg", current: 3,  min: 15, max: 80,  location: "Shelf D-4", updated: "3 hrs ago" },
  { id: 5, medicine: "Vitamin D3 60K",    current: 120, min: 30, max: 150, location: "Shelf A-1", updated: "just now" },
];

const columns = [
  { key: "medicine", label: "Medicine", render: (v) => <span className="cell-strong">{v}</span> },
  { key: "current",  label: "Current", align: "right", render: (v, row) => (
    <span className={`badge ${v < row.min ? "badge-danger" : v < row.min * 1.5 ? "badge-warning" : "badge-success"}`}>{v}</span>
  )},
  { key: "min",      label: "Min", align: "right" },
  { key: "max",      label: "Max", align: "right" },
  { key: "location", label: "Location" },
  { key: "updated",  label: "Last updated", render: (v) => <span className="cell-muted">{v}</span> },
];

export default function StockManagement() {
  return <SimplePage title="Stock levels" addLabel="Adjust stock" columns={columns} data={data} />;
}