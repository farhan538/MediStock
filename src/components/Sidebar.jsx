
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  Layers,
  Package,
  CalendarClock,
  ShoppingCart,
  ShoppingBag,
  FileBarChart,
  Activity,
  Sun,
  Moon,
  LogOut,
  UserCircle,
  Edit,
  X,
  Save,
  Mail,
  Lock,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Medicine Management", path: "/medicines", icon: Pill },
  { name: "Batch Management", path: "/batches", icon: Layers },
  { name: "Stock Management", path: "/stock", icon: Package },
  { name: "Expiry Management", path: "/expiry", icon: CalendarClock },
  { name: "Purchase Management", path: "/purchases", icon: ShoppingCart },
  { name: "Sales Management", path: "/sales", icon: ShoppingBag },
  { name: "Reports Management", path: "/reports", icon: FileBarChart },
];

export default function Sidebar({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const [adminName, setAdminName] = useState(
    localStorage.getItem("medistock_admin_name") || "MediStock Admin"
  );

  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("medistock_admin_email") || ""
  );

  const [adminPassword, setAdminPassword] = useState(
    localStorage.getItem("medistock_admin_password") || "admin123"
  );

  const [newName, setNewName] = useState(adminName);
  const [newEmail, setNewEmail] = useState(adminEmail);
  const [newPassword, setNewPassword] = useState(adminPassword);

  const handleLogout = () => {
    localStorage.removeItem("medistock_admin");
    navigate("/login");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert("Please fill in all profile details.");
      return;
    }

    localStorage.setItem("medistock_admin_name", newName.trim());
    localStorage.setItem("medistock_admin_email", newEmail.trim());
    localStorage.setItem("medistock_admin_password", newPassword);

    setAdminName(newName.trim());
    setAdminEmail(newEmail.trim());
    setAdminPassword(newPassword);

    setEditProfile(false);
    alert("Profile updated successfully!");
  };

  const openEditProfile = () => {
    setNewName(adminName);
    setNewEmail(adminEmail);
    setNewPassword(adminPassword);
    setEditProfile(true);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col shadow-xl transition-colors ${
        darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-800"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 border-b px-6 py-6 ${
          darkMode ? "border-slate-700" : "border-gray-200"
        }`}
      >
        <div className="rounded-xl bg-blue-600 p-2 text-white">
          <Activity size={25} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">MediStock</h1>
          <p className="text-xs opacity-60">Pharmacy Management</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider opacity-50">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Options */}
      <div
        className={`shrink-0 space-y-3 border-t px-4 py-4 ${
          darkMode ? "border-slate-700" : "border-gray-200"
        }`}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
            darkMode
              ? "text-yellow-300 hover:bg-slate-800"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Admin Profile */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
            darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
          }`}
        >
          <div className="rounded-full bg-blue-600 p-2 text-white">
            <UserCircle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{adminName}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </button>

        {/* Profile Popup */}
        {profileOpen && (
          <div
            className={`rounded-xl border p-4 shadow-lg ${
              darkMode
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Admin Profile</h3>
              <button onClick={() => setProfileOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {editProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProfile(false)}
                    className="rounded-lg bg-gray-500 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">{adminName}</p>
                  <p className="mt-1 flex items-center gap-2 break-all text-xs opacity-60">
                    <Mail size={14} />
                    {adminEmail || "Email not configured"}
                  </p>
                </div>

                <p className="flex items-center gap-2 text-xs text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </p>

                <button
                  onClick={openEditProfile}
                  className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
