
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("medistock_admin", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-800 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <ShieldCheck size={35} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            MediStock
          </h1>

          <p className="mt-2 text-gray-500">
            Admin Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Username
            </label>

            <div className="flex items-center rounded-lg border px-3">
              <User className="text-gray-400" size={20} />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <div className="flex items-center rounded-lg border px-3">
              <Lock className="text-gray-400" size={20} />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login as Admin
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          MediStock Pharmacy Management System
        </p>

      </div>
    </div>
  );
}
