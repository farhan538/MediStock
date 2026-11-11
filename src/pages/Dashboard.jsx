
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Pill,
  Package,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  Bell,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stockData = [
  { month: "Jan", stock: 120 },
  { month: "Feb", stock: 180 },
  { month: "Mar", stock: 150 },
  { month: "Apr", stock: 220 },
  { month: "May", stock: 190 },
  { month: "Jun", stock: 280 },
];

const colors = [
  "#059669",
  "#34d399",
  "#a7f3d0",
  "#d1fae5",
  "#0f766e",
  "#6ee7b7",
];

function getDaysLeft(expiryDate) {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${expiryDate}T00:00:00`);

  if (Number.isNaN(expiry.getTime())) return null;

  return Math.ceil(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-800">
            {value}
          </h2>
          <p className="mt-2 text-xs text-gray-400">{subtitle}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const savedMedicines = JSON.parse(
          localStorage.getItem("medistock_medicines") || "[]"
        );

        const savedBatches = JSON.parse(
          localStorage.getItem("medistock_batches") || "[]"
        );

        setMedicines(
          Array.isArray(savedMedicines) ? savedMedicines : []
        );

        setBatches(
          Array.isArray(savedBatches) ? savedBatches : []
        );
      } catch (error) {
        console.error("Unable to load Dashboard data:", error);
        setMedicines([]);
        setBatches([]);
      }
    };

    loadDashboardData();

    window.addEventListener("focus", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);
    window.addEventListener(
      "medistock_data_updated",
      loadDashboardData
    );

    return () => {
      window.removeEventListener("focus", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
      window.removeEventListener(
        "medistock_data_updated",
        loadDashboardData
      );
    };
  }, []);

  // Medicine calculations
  const totalMedicines = medicines.length;

  const usableStock = medicines.reduce(
    (total, medicine) =>
      total + (Number(medicine.stock) || 0),
    0
  );

  const lowStockMedicines = medicines.filter(
    (medicine) => Number(medicine.stock) <= 10
  );

  // Expiry calculations
  const validBatches = batches.filter(
    (batch) => getDaysLeft(batch.expiryDate) !== null
  );

  const expiredBatches = validBatches.filter(
    (batch) => getDaysLeft(batch.expiryDate) < 0
  );

  const expiringSoonBatches = validBatches.filter((batch) => {
    const daysLeft = getDaysLeft(batch.expiryDate);
    return daysLeft >= 0 && daysLeft <= 30;
  });

  const safeBatches = validBatches.filter(
    (batch) => getDaysLeft(batch.expiryDate) > 30
  );

  // Category chart
  const categoryCounts = medicines.reduce((result, medicine) => {
    const category = medicine.category || "Others";
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(
    ([name, value]) => ({ name, value })
  );

  // Search medicines
  const filteredMedicines = medicines.filter((medicine) =>
    `${medicine.name || ""} ${medicine.category || ""} ${
      medicine.manufacturer || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f8f6] text-gray-800">

      {/* Top Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5 md:px-10">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">
            MediStock
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Medicine Stock Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/medicines"
            className="hidden rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 sm:block"
          >
            Manage Medicines
          </Link>

          <button className="relative rounded-xl bg-gray-50 p-3">
            <Bell size={20} />
            {expiredBatches.length + expiringSoonBatches.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
            M
          </div>
        </div>
      </header>

      <main className="p-5 md:p-10">

        {/* Page Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Here is your pharmacy overview.
            </p>
          </div>

          <Link
            to="/medicines"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Pill size={18} />
            Add Medicine
          </Link>
        </div>

        {/* Summary Cards */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Medicines"
            value={totalMedicines}
            subtitle="Registered medicines"
            icon={Pill}
            color="bg-emerald-100 text-emerald-700"
          />

          <StatCard
            title="Usable Stock"
            value={usableStock.toLocaleString("en-IN")}
            subtitle="Available units"
            icon={Package}
            color="bg-blue-100 text-blue-700"
          />

          <StatCard
            title="Low Stock"
            value={lowStockMedicines.length}
            subtitle="Medicines with 10 units or less"
            icon={AlertTriangle}
            color="bg-amber-100 text-amber-700"
          />

          <StatCard
            title="Expired Batches"
            value={expiredBatches.length}
            subtitle="Batches past expiry date"
            icon={CalendarClock}
            color="bg-red-100 text-red-700"
          />
        </section>

        {/* Expiry Summary */}
        <section className="mt-7 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              Expired Batches
            </p>
            <h3 className="mt-2 text-3xl font-bold text-red-800">
              {expiredBatches.length}
            </h3>
            <p className="mt-1 text-xs text-red-600">
              Expiry date has passed
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-700">
              Expiring Soon
            </p>
            <h3 className="mt-2 text-3xl font-bold text-amber-800">
              {expiringSoonBatches.length}
            </h3>
            <p className="mt-1 text-xs text-amber-600">
              Expiring within 30 days
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">
              Safe Batches
            </p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-800">
              {safeBatches.length}
            </h3>
            <p className="mt-1 text-xs text-emerald-600">
              More than 30 days remaining
            </p>
          </div>
        </section>

        {/* Expiry Alert */}
        <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <AlertTriangle size={24} />
              </div>

              <div>
                <h3 className="font-semibold text-amber-900">
                  Expiry Alert
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  {expiredBatches.length > 0
                    ? `${expiredBatches.length} batch(es) have expired.`
                    : expiringSoonBatches.length > 0
                    ? `${expiringSoonBatches.length} batch(es) are expiring soon.`
                    : validBatches.length > 0
                    ? "No expired or soon-to-expire batches."
                    : "No batch expiry information available yet."}
                </p>
              </div>
            </div>

            <Link
              to="/expiry"
              className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700"
            >
              View Expiry Details
            </Link>
          </div>

          {(expiredBatches.length > 0 ||
            expiringSoonBatches.length > 0) && (
            <div className="mt-5 space-y-3">
              {[...expiredBatches, ...expiringSoonBatches]
                .slice(0, 5)
                .map((batch) => {
                  const daysLeft = getDaysLeft(batch.expiryDate);
                  const expired = daysLeft < 0;

                  return (
                    <div
                      key={batch.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {batch.medicineName || "Unknown Medicine"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Batch: {batch.batchNumber || "N/A"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          Expiry: {batch.expiryDate}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            expired ? "text-red-600" : "text-amber-600"
                          }`}
                        >
                          {expired
                            ? `Expired ${Math.abs(daysLeft)} day(s) ago`
                            : daysLeft === 0
                            ? "Expires today"
                            : `${daysLeft} day(s) remaining`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* Charts */}
        <section className="mt-8 grid gap-6 xl:grid-cols-2">

          {/* Monthly Stock Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">
                  Monthly Stock Additions
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Sample monthly stock data
                </p>
              </div>
              <TrendingUp className="text-emerald-600" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="stock"
                    fill="#059669"
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-gray-800">
                Medicine Categories
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Distribution of saved medicines
              </p>
            </div>

            {categoryData.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="h-56 w-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {categoryData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        {item.name}
                      </span>
                      <span className="text-sm font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">
                Add medicines to view category statistics.
              </p>
            )}
          </div>
        </section>

        {/* Medicine Table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 p-6">
            <div>
              <h3 className="font-bold text-gray-800">
                Medicine Stock Overview
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Recently saved medicine records
              </p>
            </div>

            <Link
              to="/medicines"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              View All
            </Link>
          </div>

          <div className="px-6 pb-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4">Medicine Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Manufacturer</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => {
                  const quantity = Number(medicine.stock) || 0;
                  const isLowStock = quantity <= 10;

                  return (
                    <tr
                      key={medicine.id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {medicine.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {medicine.category || "Others"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {medicine.manufacturer || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {quantity}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isLowStock
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredMedicines.length === 0 && (
              <p className="py-10 text-center text-gray-400">
                {medicines.length === 0
                  ? "No medicines added yet. Click Add Medicine to get started."
                  : "No matching medicines found."}
              </p>
            )}
          </div>
        </section>

        {/* Bottom Information */}
        <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
          <Activity size={18} className="text-emerald-600" />
          MediStock Inventory Dashboard
        </div>
      </main>
    </div>
  );
}
