import { useState } from "react";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";

export default function PurchaseManagement() {
  const [medicines, setMedicines] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medistock_medicines") || "[]");
    } catch {
      return [];
    }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medistock_purchases") || "[]");
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    medicineName: "",
    supplier: "",
    invoiceNumber: "",
    quantity: "",
    unitPrice: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const totalAmount =
    Number(form.quantity) * Number(form.unitPrice);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePurchase = (e) => {
    e.preventDefault();

    if (
      !form.medicineName ||
      !form.supplier.trim() ||
      !form.quantity ||
      !form.unitPrice ||
      Number(form.quantity) <= 0 ||
      Number(form.unitPrice) < 0
    ) {
      alert("Please enter valid purchase details.");
      return;
    }

    const updatedMedicines = medicines.map((medicine) => {
      if (medicine.name === form.medicineName) {
        return {
          ...medicine,
          stock: Number(medicine.stock || 0) + Number(form.quantity),
        };
      }
      return medicine;
    });

    const newPurchase = {
      id: Date.now(),
      ...form,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      totalAmount,
    };

    const updatedPurchases = [newPurchase, ...purchases];

    setMedicines(updatedMedicines);
    setPurchases(updatedPurchases);

    localStorage.setItem(
      "medistock_medicines",
      JSON.stringify(updatedMedicines)
    );

    localStorage.setItem(
      "medistock_purchases",
      JSON.stringify(updatedPurchases)
    );

    setForm({
      medicineName: "",
      supplier: "",
      invoiceNumber: "",
      quantity: "",
      unitPrice: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });

    alert("Purchase recorded successfully!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this purchase record?")) return;

    const updatedPurchases = purchases.filter(
      (purchase) => purchase.id !== id
    );

    setPurchases(updatedPurchases);

    localStorage.setItem(
      "medistock_purchases",
      JSON.stringify(updatedPurchases)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Purchase Management
        </h1>
        <p className="mt-2 text-gray-500">
          Record and manage medicine purchases.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <ShoppingCart className="mb-2 text-blue-600" size={28} />
          <p className="text-gray-500">Total Purchases</p>
          <h2 className="text-2xl font-bold">{purchases.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Total Items Purchased</p>
          <h2 className="text-2xl font-bold">
            {purchases.reduce(
              (total, purchase) => total + Number(purchase.quantity),
              0
            )}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Total Purchase Amount</p>
          <h2 className="text-2xl font-bold">
            ₹
            {purchases
              .reduce(
                (total, purchase) =>
                  total + Number(purchase.totalAmount),
                0
              )
              .toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
          <Plus size={22} />
          Add New Purchase
        </h2>

        <form onSubmit={handlePurchase}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block font-medium">Medicine</label>
              <select
                name="medicineName"
                value={form.medicineName}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id || medicine.name} value={medicine.name}>
                    {medicine.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">Supplier Name</label>
              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Enter supplier name"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Invoice Number</label>
              <input
                name="invoiceNumber"
                value={form.invoiceNumber}
                onChange={handleChange}
                placeholder="Enter invoice number"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Unit Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Enter unit price"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-blue-50 p-4">
            <p className="text-gray-600">Total Purchase Amount</p>
            <h2 className="text-2xl font-bold text-blue-700">
              ₹{Number(totalAmount || 0).toFixed(2)}
            </h2>
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Record Purchase
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Purchase History</h2>

        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Medicine</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No purchase records available.
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b">
                  <td className="p-3">{purchase.medicineName}</td>
                  <td className="p-3">{purchase.supplier}</td>
                  <td className="p-3">{purchase.invoiceNumber || "-"}</td>
                  <td className="p-3">{purchase.quantity}</td>
                  <td className="p-3">₹{purchase.unitPrice.toFixed(2)}</td>
                  <td className="p-3 font-semibold">
                    ₹{purchase.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3">{purchase.purchaseDate}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(purchase.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete purchase record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}