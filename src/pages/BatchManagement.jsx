
import { useEffect, useState } from "react";
import { Plus, Package, Search, Trash2, CalendarDays } from "lucide-react";

export default function BatchManagement() {
  const [batches, setBatches] = useState(() => {
    return JSON.parse(localStorage.getItem("medistock_batches")) || [];
  });

  const [medicines, setMedicines] = useState(() => {
    return JSON.parse(localStorage.getItem("medistock_medicines")) || [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    batchNumber: "",
    medicineId: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    supplier: "",
  });

  useEffect(() => {
    localStorage.setItem("medistock_batches", JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem("medistock_medicines", JSON.stringify(medicines));
  }, [medicines]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getLocalDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const saveBatch = (e) => {
    e.preventDefault();

    const selectedMedicine = medicines.find(
      (medicine) => String(medicine.id) === String(form.medicineId)
    );

    if (!selectedMedicine) {
      alert("Please select a medicine.");
      return;
    }

    const quantity = Number(form.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Please enter a valid positive whole-number quantity.");
      return;
    }

    if (!form.batchNumber.trim()) {
      alert("Please enter a batch number.");
      return;
    }

    const duplicateBatch = batches.some(
      (batch) =>
        batch.batchNumber.toLowerCase() ===
        form.batchNumber.trim().toLowerCase()
    );

    if (duplicateBatch) {
      alert("This batch number already exists.");
      return;
    }

    if (!form.manufacturingDate || !form.expiryDate) {
      alert("Please enter both manufacturing and expiry dates.");
      return;
    }

    if (form.expiryDate <= form.manufacturingDate) {
      alert("Expiry date must be later than manufacturing date.");
      return;
    }

    const newBatch = {
      id: Date.now(),
      batchNumber: form.batchNumber.trim(),
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      quantity,
      manufacturingDate: form.manufacturingDate,
      expiryDate: form.expiryDate,
      supplier: form.supplier.trim(),
      batchAddedDate: getLocalDate(),
    };

    setBatches((previous) => [...previous, newBatch]);

    // Add the new batch quantity to the selected medicine's stock.
    const updatedMedicines = medicines.map((medicine) =>
      String(medicine.id) === String(form.medicineId)
        ? {
            ...medicine,
            stock: Number(medicine.stock || 0) + quantity,
          }
        : medicine
    );

    setMedicines(updatedMedicines);

    setForm({
      batchNumber: "",
      medicineId: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
      supplier: "",
    });

    alert("Batch added successfully!");
  };

  const deleteBatch = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) return;

    // Deleting a batch does not change medicine stock automatically.
    setBatches((previous) =>
      previous.filter((batch) => batch.id !== id)
    );
  };

  const filteredBatches = batches.filter((batch) => {
    const search = searchTerm.toLowerCase();

    return (
      batch.batchNumber?.toLowerCase().includes(search) ||
      batch.medicineName?.toLowerCase().includes(search) ||
      batch.supplier?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page Heading */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Package size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Batch Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage medicine batches, manufacturing dates and expiry dates.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Batches
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
              {batches.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Batch Quantity
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {batches.reduce(
                (total, batch) => total + Number(batch.quantity || 0),
                0
              )}
            </h2>
          </div>
        </div>

        {/* Add Batch Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
            <Plus size={20} />
            Add New Batch
          </h2>

          <form onSubmit={saveBatch}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {/* Batch Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Batch Number
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={handleChange}
                  placeholder="Example: BATCH001"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Medicine */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Select Medicine
                </label>
                <select
                  name="medicineId"
                  value={form.medicineId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Choose a medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Batch Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Manufacturing Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={form.manufacturingDate}
                  onChange={handleChange}
                  max={form.expiryDate || undefined}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Date printed as the manufacturing date on the medicine pack.
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  min={form.manufacturingDate || undefined}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter the expiry date printed on the medicine pack.
                </p>
              </div>

              {/* Supplier */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

            </div>

            <button
              type="submit"
              className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Batch
            </button>
          </form>
        </div>

        {/* Batch Table */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Batch Records
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View all registered medicine batches.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batches..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Manufacturing Date</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Batch Added Date</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="border-b border-slate-100 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/50"
                    >
                      <td className="p-3 font-medium">
                        {batch.batchNumber}
                      </td>

                      <td className="p-3">
                        {batch.medicineName}
                      </td>

                      <td className="p-3">
                        {batch.quantity}
                      </td>

                      <td className="p-3">
                        {batch.manufacturingDate || "Not available"}
                      </td>

                      <td className="p-3 font-medium text-red-600 dark:text-red-400">
                        {batch.expiryDate || "Not available"}
                      </td>

                      <td className="p-3">
                        {batch.batchAddedDate || "Not available"}
                      </td>

                      <td className="p-3">
                        {batch.supplier || "-"}
                      </td>

                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteBatch(batch.id)}
                          title="Delete batch"
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      <CalendarDays className="mx-auto mb-2" size={28} />
                      No batch records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
