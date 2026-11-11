import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Pill, Layers, Boxes, CalendarClock,
  ShoppingCart, Receipt, BarChart3, Bell, Search, Menu,
  LogOut, ChevronDown, HelpCircle,
} from "lucide-react";

const NAV_GROUPS = [
  { label: "Overview",  items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Inventory", items: [
    { to: "/medicines", label: "Medicines", icon: Pill },
    { to: "/batches",   label: "Batches",   icon: Layers },
    { to: "/stock",     label: "Stock",     icon: Boxes },
    { to: "/expiry",    label: "Expiry",    icon: CalendarClock },
  ]},
  { label: "Operations", items: [
    { to: "/purchases", label: "Purchases", icon: ShoppingCart },
    { to: "/sales",     label: "Sales",     icon: Receipt },
  ]},
  { label: "Insights", items: [{ to: "/reports", label: "Reports", icon: BarChart3 }] },
];

const PAGE_META = {
  "/dashboard": { title: "Dashboard",  subtitle: "Overview of your pharmacy operations" },
  "/medicines": { title: "Medicines",  subtitle: "Manage your medicine catalog" },
  "/batches":   { title: "Batches",    subtitle: "Track medicine batches" },
  "/stock":     { title: "Stock",      subtitle: "Inventory levels and adjustments" },
  "/expiry":    { title: "Expiry",     subtitle: "Monitor expiring stock" },
  "/purchases": { title: "Purchases",  subtitle: "Supplier orders and receipts" },
  "/sales":     { title: "Sales",      subtitle: "Sales transactions" },
  "/reports":   { title: "Reports",    subtitle: "Business analytics" },
};

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const meta = PAGE_META[location.pathname] || { title: "MediStock", subtitle: "" };

  useEffect(() => { document.title = `${meta.title} · MediStock`; }, [meta.title]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="ms-shell">
      <aside className={`ms-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="ms-brand">
          <div className="ms-brand-mark">M</div>
          <div>
            <div className="ms-brand-name">MediStock</div>
            <div className="ms-brand-tag">PHARMACY OS</div>
          </div>
        </div>

        <nav className="ms-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="ms-nav-group">
              <div className="ms-nav-label">{group.label}</div>
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `ms-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={17} strokeWidth={2} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="ms-user-card">
          <div className="ms-avatar">F</div>
          <div className="ms-user-info">
            <div className="ms-user-name">Farhan</div>
            <select className="ms-role-select" defaultValue="Manager">
              <option value="Manager">Manager</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button onClick={logout} className="ms-user-logout" title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="ms-backdrop" onClick={() => setMobileOpen(false)} />}

      <div className="ms-main">
        <header className="ms-topbar">
          <div className="ms-topbar-left">
            <button className="btn btn-ghost btn-icon ms-mobile-toggle" onClick={() => setMobileOpen((v) => !v)}>
              <Menu size={18} />
            </button>
            <div>
              <h1 className="ms-page-title">{meta.title}</h1>
              <p className="ms-page-sub">{meta.subtitle}</p>
            </div>
          </div>

          <div className="ms-topbar-right">
            <div className="ms-search">
              <Search size={15} />
              <input placeholder="Search medicines, batches…" />
              <kbd>⌘K</kbd>
            </div>
            <button className="btn btn-ghost btn-icon" title="Help"><HelpCircle size={18} /></button>
            <button className="btn btn-ghost btn-icon ms-notif" title="Notifications">
              <Bell size={18} />
              <span className="ms-notif-dot" />
            </button>

            <div className="ms-user-menu">
              <button className="ms-avatar-btn" onClick={() => setUserMenu((v) => !v)}>
                F <ChevronDown size={13} />
              </button>
              {userMenu && (
                <div className="ms-dropdown">
                  <div className="ms-dropdown-head">
                    <strong>Farhan</strong>
                    <span>farhan@medistock.io</span>
                  </div>
                  <button className="ms-dropdown-item">Profile</button>
                  <button className="ms-dropdown-item">Settings</button>
                  <button className="ms-dropdown-item danger" onClick={logout}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="ms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}