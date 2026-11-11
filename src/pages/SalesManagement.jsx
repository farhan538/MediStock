
import { useState } from "react";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";

export default function SalesManagement() {
  const [medicines, setMedicines] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("medistock_medicines") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("medistock_sales") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    medicineName: "",
    customerName: "",
    quantity: "",
    unitPrice: "",
    saleDate: new Date().toISOString().split("T")[0],
  });

  const totalAmount =
    Number(form.quantity || 0) * Number(form.unitPrice || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "medicineName") {
      const selectedMedicine = medicines.find(
        (medicine) => medicine.name === value
      );

      setForm((previous) => ({
        ...previous,
        medicineName: value,
        unitPrice: selectedMedicine
          ? String(selectedMedicine.price ?? "")
          : "",
      }));
    }
  };

  const handleSale = (e) => {
    e.preventDefault();

    const selectedMedicine = medicines.find(
      (medicine) => medicine.name === form.medicineName
    );

    const quantity = Number(form.quantity);
    const unitPrice = Number(form.unitPrice);

    if (!selectedMedicine) {
      alert("Please select a valid medicine.");
      return;
    }

    if (!form.customerName.trim()) {
      alert("Please enter the customer name.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      alert("Please enter a valid selling price.");
      return;
    }

    const currentStock = Number(selectedMedicine.stock || 0);

    if (quantity > currentStock) {
      alert(`Insufficient stock! Available stock: ${currentStock}`);
      return;
    }

    const updatedMedicines = medicines.map((medicine) =>
      medicine.name === form.medicineName
        ? {
            ...medicine,
            stock: currentStock - quantity,
          }
        : medicine
    );

    const newSale = {
      id: Date.now(),
      medicineName: form.medicineName,
      customerName: form.customerName.trim(),
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      saleDate: form.saleDate,
    };

    const updatedSales = [newSale, ...sales];

    setMedicines(updatedMedicines);
    setSales(updatedSales);

    localStorage.setItem(
      "medistock_medicines",
      JSON.stringify(updatedMedicines)
    );

    localStorage.setItem(
      "medistock_sales",
      JSON.stringify(updatedSales)
    );

    setForm({
      medicineName: "",
      customerName: "",
      quantity: "",
      unitPrice: "",
      saleDate: new Date().toISOString().split("T")[0],
    });

    alert("Sale recorded successfully!");
  };

  const handleDelete = (id) => {
    const saleToDelete = sales.find((sale) => sale.id === id);

    if (!saleToDelete) return;

    if (!window.confirm("Delete this sale and restore its stock?")) {
      return;
    }

    const updatedMedicines = medicines.map((medicine) =>
      medicine.name === saleToDelete.medicineName
        ? {
            ...medicine,
            stock:
              Number(medicine.stock || 0) +
              Number(saleToDelete.quantity),
          }
        : medicine
    );

    const updatedSales = sales.filter((sale) => sale.id !== id);

    setMedicines(updatedMedicines);
    setSales(updatedSales);

    localStorage.setItem(
      "medistock_medicines",
      JSON.stringify(updatedMedicines)
    );

    localStorage.setItem(
      "medistock_sales",
      JSON.stringify(updatedSales)
    );
  };

  const totalItems = sales.reduce(
    (total, sale) => total + Number(sale.quantity),
    0
  );

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Sales Management
        </h1>
        <p className="mt-2 text-gray-500">
          Record medicine sales and manage customer transactions.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <ShoppingBag className="mb-2 text-blue-600" size={28} />
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-2xl font-bold">{sales.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Items Sold</p>
          <h2 className="text-2xl font-bold">{totalItems}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹{totalRevenue.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
          <Plus size={22} />
          Record New Sale
        </h2>

        <form onSubmit={handleSale}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block font-medium">
                Select Medicine
              </label>
              <select
                name="medicineName"
                value={form.medicineName}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option
                    key={medicine.id || medicine.name}
                    value={medicine.name}
                  >
                    {medicine.name} (Stock: {medicine.stock || 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Customer Name
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Selling Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Enter selling price"
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Sale Date
              </label>
              <input
                type="date"
                name="saleDate"
                value={form.saleDate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-blue-50 p-4">
            <p className="text-gray-600">Total Bill Amount</p>
            <h2 className="text-2xl font-bold text-blue-700">
              ₹{totalAmount.toFixed(2)}
            </h2>
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Complete Sale
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Sales History
        </h2>

        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Medicine</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500"
                >
                  No sales records available.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-3">{sale.medicineName}</td>
                  <td className="p-3">{sale.customerName}</td>
                  <td className="p-3">{sale.quantity}</td>
                  <td className="p-3">
                    ₹{Number(sale.unitPrice).toFixed(2)}
                  </td>
                  <td className="p-3 font-semibold">
                    ₹{Number(sale.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-3">{sale.saleDate}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete sale and restore stock"
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
