
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MedicineManagement from "./pages/MedicineManagement";
import BatchManagement from "./pages/BatchManagement";
import StockManagement from "./pages/StockManagement";
import ExpiryManagement from "./pages/ExpiryManagement";
import PurchaseManagement from "./pages/PurchaseManagement";
import SalesManagement from "./pages/SalesManagement";
import ReportsManagement from "./pages/ReportsManagement";

import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<MedicineManagement />} />
            <Route path="/batches" element={<BatchManagement />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/expiry" element={<ExpiryManagement />} />
            <Route path="/purchases" element={<PurchaseManagement />} />
            <Route path="/sales" element={<SalesManagement />} />
            <Route path="/reports" element={<ReportsManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
