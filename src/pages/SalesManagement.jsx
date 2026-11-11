import SimplePage from "../components/SimplePage";

const data = [
  { id: 1, invoice: "INV-5001", customer: "Ravi Kumar",  date: "2026-02-28", items: 3, total: "₹840",   payment: "Paid" },
  { id: 2, invoice: "INV-5002", customer: "Priya Singh", date: "2026-02-28", items: 2, total: "₹420",   payment: "Paid" },
  { id: 3, invoice: "INV-5003", customer: "Walk-in",     date: "2026-02-28", items: 5, total: "₹1,240", payment: "Paid" },
  { id: 4, invoice: "INV-5004", customer: "Anil Sharma", date: "2026-02-27", items: 1, total: "₹210",   payment: "Pending" },
];

const columns = [
  { key: "invoice",  label: "Invoice", render: (v) => <span className="cell-strong">{v}</span> },
  { key: "customer", label: "Customer" },
  { key: "date",     label: "Date" },
  { key: "items",    label: "Items", align: "right" },
  { key: "total",    label: "Total", align: "right" },
  { key: "payment",  label: "Payment", render: (v) => (
    <span className={`badge ${v === "Paid" ? "badge-success" : "badge-warning"}`}>
      <span className="badge-dot" />{v}
    </span>
  )},
];

export default function SalesManagement() {
  return <SimplePage title="Sales transactions" addLabel="New sale" columns={columns} data={data} />;
}