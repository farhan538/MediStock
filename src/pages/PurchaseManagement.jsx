import SimplePage from "../components/SimplePage";

const data = [
  { id: 1, po: "PO-1024", supplier: "Cipla",      date: "2026-02-20", items: 12, total: "₹42,500", status: "Received" },
  { id: 2, po: "PO-1025", supplier: "Sun Pharma", date: "2026-02-22", items: 8,  total: "₹28,400", status: "Received" },
  { id: 3, po: "PO-1026", supplier: "USV",        date: "2026-02-25", items: 5,  total: "₹18,200", status: "Pending" },
  { id: 4, po: "PO-1027", supplier: "Zydus",      date: "2026-02-26", items: 14, total: "₹56,800", status: "Pending" },
];

const columns = [
  { key: "po",       label: "PO number", render: (v) => <span className="cell-strong">{v}</span> },
  { key: "supplier", label: "Supplier" },
  { key: "date",     label: "Order date" },
  { key: "items",    label: "Items", align: "right" },
  { key: "total",    label: "Total", align: "right" },
  { key: "status",   label: "Status", render: (v) => (
    <span className={`badge ${v === "Received" ? "badge-success" : "badge-warning"}`}>
      <span className="badge-dot" />{v}
    </span>
  )},
];

export default function PurchaseManagement() {
  return <SimplePage title="Purchase orders" addLabel="New PO" columns={columns} data={data} />;
}