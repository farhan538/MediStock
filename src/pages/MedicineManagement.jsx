import { useEffect, useState } from "react";
import {
  Plus, Search, Pencil, Trash2, X, Pill
} from "lucide-react";

const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    manufacturer: "Cipla",
    price: 25,
    stock: 120,
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    manufacturer: "Sun Pharma",
    price: 65,
    stock: 45,
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    category: "Allergy",
    manufacturer: "Dr. Reddy's",
    price: 18,
    stock: 15,
  },
];

export default function MedicineManagement() {
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem("medistock_medicines");
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    manufacturer: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    localStorage.setItem("medistock_medicines", JSON.stringify(medicines));
  }, [medicines]);

  const filteredMedicines = medicines.filter((medicine) =>
    `${medicine.name} ${medicine.category} ${medicine.manufacturer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const medicineData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId !== null) {
      setMedicines((current) =>
        current.map((medicine) =>
          medicine.id === editingId
            ? { ...medicine, ...medicineData }
            : medicine
        )
      );
    } else {
      setMedicines((current) => [
        ...current,
        { id: Date.now(), ...medicineData },
      ]);
    }

    closeForm();
  };

  const openEditForm = (medicine) => {
    setEditingId(medicine.id);
    setForm({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      price: medicine.price,
      stock: medicine.stock,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      manufacturer: "",
      price: "",
      stock: "",
    });
  };

  const deleteMedicine = (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      setMedicines((current) =>
        current.filter((medicine) => medicine.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              INVENTORY MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              Medicine Management
            </h1>
            <p className="mt-2 text-slate-500">
              Add, update, search and manage your medicines.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-emerald-700"
          >
            <Plus size={19} /> Add Medicine
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Medicines</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {medicines.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Units in Stock</p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-600">
              {medicines.reduce((total, item) => total + item.stock, 0)}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="relative mb-6 max-w-md">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={19}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b bg-slate-50 text-sm text-slate-500">
                  <th className="p-4">Medicine</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Manufacturer</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                          <Pill size={20} />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {medicine.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {medicine.category}
                    </td>
                    <td className="p-4 text-slate-600">
                      {medicine.manufacturer}
                    </td>
                    <td className="p-4 text-slate-700">
                      ₹{medicine.price}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {medicine.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(medicine)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="Edit medicine"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => deleteMedicine(medicine.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete medicine"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMedicines.length === 0 && (
              <p className="py-10 text-center text-slate-500">
                No medicines found.
              </p>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId !== null ? "Edit Medicine" : "Add New Medicine"}
              </h2>
              <button onClick={closeForm}>
                <X className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Medicine name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
              />

              <input
                required
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
              />

              <input
                required
                placeholder="Manufacturer"
                value={form.manufacturer}
                onChange={(e) =>
                  setForm({ ...form, manufacturer: e.target.value })
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
                />

                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Stock quantity"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  className="w-full rounded-lg border p-3 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                {editingId !== null ? "Update Medicine" : "Save Medicine"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}