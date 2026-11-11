import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, TrendingUp, Boxes, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard");
  };

  return (
    <div className="auth">
      <div className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-logo">M</div>
          <span>MediStock</span>
        </div>

        <div className="auth-brand-copy">
          <h1>The pharmacy operating system for modern teams.</h1>
          <p>Track medicines, batches, and expiry in one place — without spreadsheets.</p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><Boxes size={16} /></div>
              <div>
                <strong>Real-time inventory</strong>
                <span>Never run out of critical stock</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><ShieldCheck size={16} /></div>
              <div>
                <strong>Expiry tracking</strong>
                <span>Automated alerts before batches expire</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><TrendingUp size={16} /></div>
              <div>
                <strong>Business insights</strong>
                <span>See what's selling and what's not</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-foot">© 2026 MediStock. Built for pharmacists.</div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-form-head">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <div className="field">
            <label>Email address</label>
            <input
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@pharmacy.com"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div className="auth-pass">
              <input
                type={show ? "text" : "password"} required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow((v) => !v)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary auth-submit">Sign in</button>

          <div className="auth-foot">
            Don't have an account? <a href="#" className="auth-link">Contact admin</a>
          </div>
        </form>
      </div>
    </div>
  );
}