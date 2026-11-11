
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Package,
  Clock,
  CheckCircle,
  Search,
} from "lucide-react";

export default function ExpiryManagement() {
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Read batches saved by Batch Management
  useEffect(() => {
    const loadBatches = () => {
      const savedBatches = JSON.parse(
        localStorage.getItem("medistock_batches") || "[]"
      );
      setBatches(savedBatches);
    };

    loadBatches();

    // Refresh when returning to this page
    window.addEventListener("focus", loadBatches);

    return () => {
      window.removeEventListener("focus", loadBatches);
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;

    const expiry = new Date(`${expiryDate}T00:00:00`);
    const difference = expiry.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const getStatus = (daysLeft) => {
    if (daysLeft === null) return "Unknown";
    if (daysLeft < 0) return "Expired";
    if (daysLeft <= 30) return "Expiring Soon";
    return "Safe";
  };

  const expiredBatches = batches.filter(
    (batch) => getDaysLeft(batch.expiryDate) < 0
  );

  const expiringBatches = batches.filter((batch) => {
    const days = getDaysLeft(batch.expiryDate);
    return days !== null && days >= 0 && days <= 30;
  });

  const safeBatches = batches.filter(
    (batch) => getDaysLeft(batch.expiryDate) > 30
  );

  const filteredBatches = batches.filter((batch) => {
    const search = searchTerm.toLowerCase();

    return (
      batch.batchNumber?.toLowerCase().includes(search) ||
      batch.medicineName?.toLowerCase().includes(search)
    );
  });

  const statusStyle = (status) => {
    if (status === "Expired") {
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }

    if (status === "Expiring Soon") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
    }

    if (status === "Safe") {
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    }

    return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/40 dark:text-red-300">
            <AlertTriangle size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Expiry Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monitor medicine batch expiry dates and alerts.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl border-l-4 border-red-500 bg-white p-5 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Expired Batches
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {expiredBatches.length}
                </h2>
              </div>
              <AlertTriangle className="text-red-500" size={30} />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-5 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Expiring Within 30 Days
                </p>
                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {expiringBatches.length}
                </h2>
              </div>
              <Clock className="text-yellow-500" size={30} />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-green-500 bg-white p-5 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Safe Batches
                </p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {safeBatches.length}
                </h2>
              </div>
              <CheckCircle className="text-green-500" size={30} />
            </div>
          </div>

        </div>

        {/* Expiry Alert Message */}
        {expiredBatches.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            <AlertTriangle size={22} />
            <p className="font-medium">
              Warning! {expiredBatches.length} batch(es) have expired.
              Do not dispense these medicines.
            </p>
          </div>
        )}

        {expiringBatches.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300">
            <Clock size={22} />
            <p className="font-medium">
              Alert! {expiringBatches.length} batch(es) will expire within 30 days.
            </p>
          </div>
        )}

        {/* Batch Records */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Batch Expiry Records
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Expiry information automatically loaded from Batch Management.
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
                placeholder="Search medicine or batch..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-72"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Days Left</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => {
                    const daysLeft = getDaysLeft(batch.expiryDate);
                    const status = getStatus(daysLeft);

                    return (
                      <tr
                        key={batch.id}
                        className="border-b border-slate-100 text-slate-700 dark:border-slate-700 dark:text-slate-200"
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
                          {batch.expiryDate || "Not available"}
                        </td>

                        <td className="p-3">
                          {daysLeft === null
                            ? "Not available"
                            : daysLeft < 0
                              ? `${Math.abs(daysLeft)} days overdue`
                              : `${daysLeft} days`}
                        </td>

                        <td className="p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      <Package className="mx-auto mb-2" size={30} />
                      No batch records found. Add batches in Batch Management.
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
