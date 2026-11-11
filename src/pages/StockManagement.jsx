
import { useState } from "react";
import { Package, Plus, TrendingDown, TrendingUp } from "lucide-react";

const getSavedData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

export default function StockManagement() {
  const [medicines, setMedicines] = useState(() =>
    getSavedData("medistock_medicines")
  );

  const [history, setHistory] = useState(() =>
    getSavedData("medistock_stock_history")
  );

  const [form, setForm] = useState({
    medicineId: "",
    type: "IN",
    quantity: "",
  });

  const [message, setMessage] = useState("");

  const totalStock = medicines.reduce(
    (sum, medicine) => sum + Number(medicine.stock || 0),
    0
  );

  const lowStock = medicines.filter(
    (medicine) => Number(medicine.stock || 0) <= 10
  ).length;

  function handleSubmit(e) {
    e.preventDefault();

    const quantity = Number(form.quantity);

    if (
      !form.medicineId ||
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {
      setMessage("Please select a medicine and enter a valid whole quantity.");
      return;
    }

    const selected = medicines.find(
      (medicine) => String(medicine.id) === form.medicineId
    );

    if (!selected) {
      setMessage("Medicine not found.");
      return;
    }

    const currentStock = Number(selected.stock || 0);

    if (form.type === "OUT" && quantity > currentStock) {
      setMessage("Insufficient stock! Available stock: " + currentStock);
      return;
    }

    const updatedMedicines = medicines.map((medicine) => {
      if (String(medicine.id) === form.medicineId) {
        return {
          ...medicine,
          stock:
            currentStock +
            (form.type === "IN" ? quantity : -quantity),
        };
      }

      return medicine;
    });

    const transaction = {
      id: Date.now(),
      medicineName: selected.name,
      type: form.type,
      quantity,
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [transaction, ...history];

    // Save updated medicine stock.
    localStorage.setItem(
      "medistock_medicines",
      JSON.stringify(updatedMedicines)
    );

    // Save stock transaction history.
    localStorage.setItem(
      "medistock_stock_history",
      JSON.stringify(updatedHistory)
    );

    setMedicines(updatedMedicines);
    setHistory(updatedHistory);

    // Notify Dashboard and other pages to reload their data.
    window.dispatchEvent(new Event("medistock_data_updated"));

    setMessage("Stock updated successfully!");

    setForm({
      medicineId: "",
      type: "IN",
      quantity: "",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Stock Management
        </h1>

        <p className="mt-2 mb-8 text-slate-500 dark:text-slate-400">
          Track stock movements and available medicine quantities.
        </p>

        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <Package className="text-emerald-600" />
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Total Stock Units
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              {totalStock}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <TrendingDown className="text-red-500" />
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Low Stock Medicines
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              {lowStock}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <TrendingUp className="text-blue-500" />
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Total Transactions
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              {history.length}
            </h2>
          </div>

        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">

          <h2 className="mb-5 text-xl font-bold text-slate-800 dark:text-white">
            Update Stock
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">

            <select
              required
              value={form.medicineId}
              onChange={(e) =>
                setForm({ ...form, medicineId: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Medicine</option>

              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>

            <input
              required
              type="number"
              min="1"
              step="1"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />

            <button
              type="submit"
              disabled={medicines.length === 0}
              className="rounded-xl bg-emerald-600 p-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Plus className="mr-2 inline" size={18} />
              Update Stock
            </button>

          </form>

          {message && (
            <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}

          {medicines.length === 0 && (
            <p className="mt-4 text-sm text-red-600">
              Please add medicines in Medicine Management first.
            </p>
          )}

        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">

          <h2 className="mb-5 text-xl font-bold text-slate-800 dark:text-white">
            Current Stock
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-500 dark:border-slate-700">
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((medicine) => (
                  <tr
                    key={medicine.id}
                    className="border-b text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    <td className="p-3 font-medium">{medicine.name}</td>
                    <td className="p-3">{medicine.manufacturer}</td>
                    <td className="p-3">{medicine.stock}</td>
                    <td className="p-3">
                      <span
                        className={
                          Number(medicine.stock) <= 10
                            ? "rounded-full bg-red-100 px-3 py-1 text-red-700"
                            : "rounded-full bg-green-100 px-3 py-1 text-green-700"
                        }
                      >
                        {Number(medicine.stock) <= 10
                          ? "Low Stock"
                          : "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">

          <h2 className="mb-5 text-xl font-bold text-slate-800 dark:text-white">
            Stock Transaction History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-500 dark:border-slate-700">
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Transaction</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    <td className="p-3">{item.medicineName}</td>
                    <td className="p-3">
                      {item.type === "IN" ? "Stock In" : "Stock Out"}
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {history.length === 0 && (
              <p className="py-8 text-center text-slate-500">
                No stock transactions yet.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
