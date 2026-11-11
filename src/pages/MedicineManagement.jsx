import { useState, useMemo } from "react";
import { Search, Plus, X, Edit2, Trash2, Filter, Download } from "lucide-react";

const CATEGORIES = ["Antibiotics", "Analgesics", "Vitamins", "Cardiac", "Diabetes", "Others"];
const SEED = [
  { id: 1, name: "Amoxicillin 500mg",  category: "Antibiotics", batch: "B-2041", qty: 6,  price: 45,  expiry: "2026-08-12" },
  { id: 2, name: "Paracetamol 650mg",  category: "Analgesics",  batch: "B-1189", qty: 12, price: 18,  expiry: "2027-02-28" },
  { id: 3, name: "Metformin 500mg",    category: "Diabetes",    batch: "B-3321", qty: 8,  price: 32,  expiry: "2026-05-20" },
  { id: 4, name: "Atorvastatin 10mg",  category: "Cardiac",     batch: "B-0912", qty: 3,  price: 88,  expiry: "2026-03-15" },
  { id: 5, name: "Vitamin D3 60K",     category: "Vitamins",    batch: "B-4401", qty: 120, price: 210, expiry: "2028-01-10" },
  { id: 6, name: "Azithromycin 500mg", category: "Antibiotics", batch: "B-2210", qty: 40, price: 120, expiry: "2026-11-05" },
];
const EMPTY = { name: "", category: "Antibiotics", batch: "", qty: "", price: "", expiry: "" };

export default function MedicineManagement() {
  const [items, setItems] = useState(SEED);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((m) =>
      (cat === "ALL" || m.category === cat) &&
      (m.name.toLowerCase().includes(q) || m.batch.toLowerCase().includes(q))
    );
  }, [items, search, cat]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (m) => { setEditing(m); setForm(m); setShowModal(true); };

  const submit = (e) => {
    e.preventDefault();
    if (editing) setItems((p) => p.map((i) => (i.id === editing.id ? { ...form, id: editing.id } : i)));
    else setItems((p) => [...p, { ...form, id: Date.now() }]);
    setShowModal(false);
  };

  const del = (id) => { if (confirm("Delete this medicine?")) setItems((p) => p.filter((i) => i.id !== id)); };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Medicine catalog</h2>
          <p>{filtered.length} of {items.length} medicines</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Download size={15} /> Export</button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add medicine</button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="ms-search" style={{ width: 300 }}>
            <Search size={15} />
            <input placeholder="Search by name or batch…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="field-inline">
            <Filter size={15} style={{ color: "var(--ink-400)" }} />
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="ALL">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Search size={24} /></div>
            <h4>No medicines found</h4>
            <p>Adjust your search or add a new medicine.</p>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add medicine</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th><th>Category</th><th>Batch</th>
                  <th className="right">Stock</th><th className="right">Price</th>
                  <th>Expiry</th><th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td className="cell-strong">{m.name}</td>
                    <td>{m.category}</td>
                    <td className="cell-muted">{m.batch}</td>
                    <td className="right">
                      <span className={`badge ${m.qty < 10 ? "badge-danger" : m.qty < 30 ? "badge-warning" : "badge-success"}`}>{m.qty}</span>
                    </td>
                    <td className="right">₹{m.price}</td>
                    <td>{m.expiry}</td>
                    <td className="right">
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(m)}><Edit2 size={14} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm danger" onClick={() => del(m.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editing ? "Edit medicine" : "Add medicine"}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Medicine name <em>*</em></label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Batch number <em>*</em></label>
                  <input required value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="B-0001" />
                </div>
                <div className="field">
                  <label>Quantity <em>*</em></label>
                  <input required type="number" min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
                </div>
                <div className="field">
                  <label>Unit price (₹)</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Expiry date <em>*</em></label>
                  <input required type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? "Save changes" : "Add medicine"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}