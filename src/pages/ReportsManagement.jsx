
import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FileBarChart,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getDaysLeft(expiryDate) {
  if (!expiryDate) return null;

  const parts = String(expiryDate).split("-");

  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);

  const expiry = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  if (
    Number.isNaN(expiry.getTime()) ||
    expiry.getFullYear() !== year ||
    expiry.getMonth() !== month - 1 ||
    expiry.getDate() !== day
  ) {
    return null;
  }

  return Math.round(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ReportCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <Icon className={`mb-3 ${color}`} size={28} />

      <p className="text-gray-500">{title}</p>

      <h2 className="mt-2 text-2xl font-bold text-gray-800">
        {value}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}

export default function ReportsManagement() {
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);

  const [reportType, setReportType] = useState("all");

  // Load report data
  useEffect(() => {
    const loadReportData = () => {
      setMedicines(readStorage("medistock_medicines"));
      setBatches(readStorage("medistock_batches"));
      setPurchases(readStorage("medistock_purchases"));
      setSales(readStorage("medistock_sales"));
    };

    loadReportData();

    window.addEventListener("focus", loadReportData);
    window.addEventListener("storage", loadReportData);
    window.addEventListener("medistock_data_updated", loadReportData);

    return () => {
      window.removeEventListener("focus", loadReportData);
      window.removeEventListener("storage", loadReportData);
      window.removeEventListener(
        "medistock_data_updated",
        loadReportData
      );
    };
  }, []);

  // Expiry report
  const expiryReport = useMemo(() => {
    return batches.map((batch) => {
      const daysLeft = getDaysLeft(batch.expiryDate);

      let status = "Unknown";

      if (daysLeft !== null) {
        if (daysLeft < 0) {
          status = "Expired";
        } else if (daysLeft <= 30) {
          status = "Expiring Soon";
        } else {
          status = "Safe";
        }
      }

      return {
        ...batch,
        daysLeft,
        status,
      };
    });
  }, [batches]);

  // Total stock
  const totalStock = medicines.reduce(
    (sum, medicine) =>
      sum + (Number(medicine.stock) || 0),
    0
  );

  // Purchase amount
  const totalPurchaseAmount = purchases.reduce(
    (sum, purchase) =>
      sum + (Number(purchase.totalAmount) || 0),
    0
  );

  // Sales revenue
  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + (Number(sale.totalAmount) || 0),
    0
  );

  // Expiry calculations
  const expiredCount = expiryReport.filter(
    (batch) => batch.status === "Expired"
  ).length;

  const expiringSoonCount = expiryReport.filter(
    (batch) => batch.status === "Expiring Soon"
  ).length;

  const safeCount = expiryReport.filter(
    (batch) => batch.status === "Safe"
  ).length;

  // Stock category calculations
  const availableCount = medicines.filter(
    (medicine) => Number(medicine.stock || 0) > 10
  ).length;

  const lowStockCount = medicines.filter(
    (medicine) =>
      Number(medicine.stock || 0) > 0 &&
      Number(medicine.stock || 0) <= 10
  ).length;

  const outOfStockCount = medicines.filter(
    (medicine) => Number(medicine.stock || 0) === 0
  ).length;

  const lowAndOutStockCount =
    lowStockCount + outOfStockCount;

  // Stock chart
  const stockData = [
    { name: "Available", value: availableCount },
    { name: "Low Stock", value: lowStockCount },
    { name: "Out of Stock", value: outOfStockCount },
  ];

  // Purchase vs Sales chart
  const transactionData = [
    { name: "Purchases", amount: totalPurchaseAmount },
    { name: "Sales", amount: totalRevenue },
  ];

  // Medicine filtering
  const filteredMedicines =
    reportType === "low"
      ? medicines.filter(
          (medicine) => Number(medicine.stock || 0) <= 10
        )
      : medicines;

  // Download PDF Report
  const downloadPDF = () => {
    const doc = new jsPDF();

    const generatedDate = new Date().toLocaleString("en-IN");

    // PDF title
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("MediStock Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${generatedDate}`, 14, 28);

    doc.setDrawColor(37, 99, 235);
    doc.line(14, 33, 196, 33);

    // Inventory summary
    doc.setFontSize(15);
    doc.setTextColor(30, 30, 30);
    doc.text("1. Inventory Summary", 14, 43);

    autoTable(doc, {
      startY: 48,
      head: [["Report", "Value"]],
      body: [
        ["Total Medicines", medicines.length],
        ["Total Stock Units", totalStock],
        ["Available Medicines", availableCount],
        ["Low Stock Medicines", lowStockCount],
        ["Out of Stock Medicines", outOfStockCount],
        ["Total Batches", batches.length],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // Purchase and sales summary
    doc.setFontSize(15);
    doc.text(
      "2. Purchase and Sales Summary",
      14,
      doc.lastAutoTable.finalY + 12
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 17,
      head: [["Transaction", "Records", "Total Amount"]],
      body: [
        [
          "Purchases",
          purchases.length,
          formatCurrency(totalPurchaseAmount),
        ],
        [
          "Sales",
          sales.length,
          formatCurrency(totalRevenue),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [22, 163, 74],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // Expiry summary
    doc.setFontSize(15);
    doc.text(
      "3. Batch Expiry Summary",
      14,
      doc.lastAutoTable.finalY + 12
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 17,
      head: [["Expiry Status", "Number of Batches"]],
      body: [
        ["Expired", expiredCount],
        ["Expiring Soon (within 30 days)", expiringSoonCount],
        ["Safe", safeCount],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // Medicine inventory table
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("4. Medicine Inventory Details", 14, 20);

    const medicineRows = medicines.map((medicine) => {
      const stock = Number(medicine.stock || 0);

      const status =
        stock === 0
          ? "Out of Stock"
          : stock <= 10
            ? "Low Stock"
            : "Available";

      return [
        medicine.name || "-",
        medicine.category || "-",
        medicine.manufacturer || "-",
        stock,
        status,
      ];
    });

    autoTable(doc, {
      startY: 27,
      head: [[
        "Medicine",
        "Category",
        "Manufacturer",
        "Stock",
        "Status",
      ]],
      body:
        medicineRows.length > 0
          ? medicineRows
          : [["No medicine records", "-", "-", "-", "-"]],
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
    });

    // Batch expiry details
    let expiryStartY = doc.lastAutoTable.finalY + 14;

    if (expiryStartY > 240) {
      doc.addPage();
      expiryStartY = 20;
    }

    doc.setFontSize(16);
    doc.text("5. Batch Expiry Details", 14, expiryStartY);

    const expiryRows = expiryReport.map((batch) => [
      batch.batchNumber || "-",
      batch.medicineName || "-",
      batch.expiryDate || "-",
      batch.daysLeft === null
        ? "Unavailable"
        : batch.daysLeft < 0
          ? `${Math.abs(batch.daysLeft)} days overdue`
          : `${batch.daysLeft} days`,
      batch.status,
    ]);

    autoTable(doc, {
      startY: expiryStartY + 7,
      head: [[
        "Batch Number",
        "Medicine",
        "Expiry Date",
        "Days Left",
        "Status",
      ]],
      body:
        expiryRows.length > 0
          ? expiryRows
          : [["No batch records", "-", "-", "-", "-"]],
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38],
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
    });

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);

      doc.text(
        "MediStock - Inventory and Business Report",
        14,
        287
      );

      doc.text(
        `Page ${page} of ${pageCount}`,
        196,
        287,
        { align: "right" }
      );
    }

    // Download
    doc.save(
      `MediStock_Report_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Page Heading */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <FileBarChart className="text-blue-600" />
            Reports Management
          </h1>

          <p className="mt-2 text-gray-500">
            View and analyze your MediStock inventory and transaction reports.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Download size={17} />
            Download PDF Report
          </button>

          <button
            onClick={() => {
              setMedicines(readStorage("medistock_medicines"));
              setBatches(readStorage("medistock_batches"));
              setPurchases(readStorage("medistock_purchases"));
              setSales(readStorage("medistock_sales"));
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Refresh Reports
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard
          icon={Package}
          title="Total Medicines"
          value={medicines.length}
          subtitle={`${totalStock.toLocaleString("en-IN")} total stock units`}
          color="text-blue-600"
        />

        <ReportCard
          icon={ShoppingCart}
          title="Purchase Amount"
          value={formatCurrency(totalPurchaseAmount)}
          subtitle={`${purchases.length} purchase records`}
          color="text-green-600"
        />

        <ReportCard
          icon={TrendingUp}
          title="Sales Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle={`${sales.length} sales records`}
          color="text-purple-600"
        />

        <ReportCard
          icon={AlertTriangle}
          title="Expiry Alerts"
          value={expiredCount + expiringSoonCount}
          subtitle={`${expiredCount} expired, ${expiringSoonCount} expiring soon`}
          color="text-red-600"
        />
      </div>

      {/* Additional Stock and Expiry Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">Available Medicines</p>
          <h2 className="mt-2 text-2xl font-bold text-green-800">
            {availableCount}
          </h2>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <p className="text-sm text-yellow-700">Low Stock Medicines</p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-800">
            {lowStockCount}
          </h2>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">Out of Stock Medicines</p>
          <h2 className="mt-2 text-2xl font-bold text-red-800">
            {outOfStockCount}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Safe Batches</p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-800">
            {safeCount}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Medicine Stock Overview
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Number of medicines by stock status
          </p>

          {medicines.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              No medicine data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {stockData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold">
            Purchase vs Sales
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Compare total purchase amount and sales revenue
          </p>

          {purchases.length === 0 && sales.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              No transaction data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />

                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Medicine Inventory Report */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              Medicine Inventory Report
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View medicine stock and availability
            </p>
          </div>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
          >
            <option value="all">All Medicines</option>
            <option value="low">Low / Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Medicine</th>
                <th className="p-3">Category</th>
                <th className="p-3">Manufacturer</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    {medicines.length === 0
                      ? "No medicine records available."
                      : "No medicines match this filter."}
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => {
                  const stock = Number(medicine.stock || 0);

                  return (
                    <tr
                      key={medicine.id || medicine.name}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        {medicine.name}
                      </td>

                      <td className="p-3">
                        {medicine.category || "-"}
                      </td>

                      <td className="p-3">
                        {medicine.manufacturer || "-"}
                      </td>

                      <td className="p-3">{stock}</td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            stock === 0
                              ? "bg-red-100 text-red-700"
                              : stock <= 10
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {stock === 0
                            ? "Out of Stock"
                            : stock <= 10
                              ? "Low Stock"
                              : "Available"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Total low or out-of-stock medicines: {lowAndOutStockCount}
        </p>
      </div>

      {/* Batch Expiry Report */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Batch Expiry Report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Check batch expiry dates and remaining days
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <span className="rounded-full bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
            Expired: {expiredCount}
          </span>

          <span className="rounded-full bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700">
            Expiring Soon: {expiringSoonCount}
          </span>

          <span className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
            Safe: {safeCount}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Batch Number</th>
                <th className="p-3">Medicine</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Days Left</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {expiryReport.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No batch records available.
                  </td>
                </tr>
              ) : (
                expiryReport.map((batch, index) => (
                  <tr
                    key={batch.id || batch.batchNumber || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {batch.batchNumber || "-"}
                    </td>

                    <td className="p-3">
                      {batch.medicineName || "-"}
                    </td>

                    <td className="p-3">
                      {batch.expiryDate || "-"}
                    </td>

                    <td className="p-3">
                      {batch.daysLeft === null
                        ? "Date unavailable"
                        : batch.daysLeft < 0
                          ? `${Math.abs(batch.daysLeft)} days overdue`
                          : `${batch.daysLeft} days`}
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          batch.status === "Expired"
                            ? "bg-red-100 text-red-700"
                            : batch.status === "Expiring Soon"
                              ? "bg-yellow-100 text-yellow-700"
                              : batch.status === "Safe"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-5 text-center text-sm text-gray-400">
        MediStock - Inventory and Business Reports
      </div>
    </div>
  );
}
