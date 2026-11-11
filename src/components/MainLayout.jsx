
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("medistock_theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem(
      "medistock_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-slate-950" : "bg-gray-100"
      }`}
    >
      {/* Fixed Sidebar */}
      <Sidebar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* Dashboard and Other Pages */}
      <main
        className={`ml-64 min-h-screen p-0 ${
          darkMode ? "bg-slate-950" : "bg-gray-100"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
