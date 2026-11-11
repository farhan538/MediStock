import { useState, useMemo } from "react";
import { Search, Plus, Download } from "lucide-react";

export default function SimplePage({ title, subtitle, columns, data, addLabel, emptyText }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle || `${filtered.length} of ${data.length} records`}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Download size={15} /> Export</button>
          <button className="btn btn-primary"><Plus size={15} /> {addLabel}</button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="ms-search" style={{ width: 300 }}>
            <Search size={15} />
            <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Search size={24} /></div>
            <h4>{emptyText || "No records found"}</h4>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className={c.align}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} className={c.align || ""}>
                        {c.render ? c.render(row[c.key], row) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}