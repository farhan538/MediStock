import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Boxes, ShieldCheck, TrendingUp, ArrowRight, Sparkles, Zap,
  User, ChevronDown, Check
} from "lucide-react";

const STYLES = `
/* ============ LIGHT PROFESSIONAL WELCOME PAGE ============ */
.wl-page {
  min-height: 100vh;
  background: #F8FAFC;
  color: #0F172A;
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}
.wl-page *, .wl-page *::before, .wl-page *::after { box-sizing: border-box; }

/* Soft pastel background blobs */
.wl-blob {
  position: absolute; border-radius: 50%;
  filter: blur(120px); opacity: 0.6; z-index: 0;
}
.wl-blob-1 { width: 600px; height: 600px; background: #CCFBF1; top: -200px; left: -200px; }
.wl-blob-2 { width: 500px; height: 500px; background: #E0F2FE; bottom: -100px; right: -100px; }
.wl-blob-3 { width: 400px; height: 400px; background: #F3E8FF; top: 20%; left: 40%; opacity: 0.4; }

/* Nav */
.wl-nav {
  position: relative; z-index: 10;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 48px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}
.wl-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 18px; color: #0F172A; text-decoration: none; }
.wl-logo-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #14B8A6, #0F766E);
  color: #fff; display: grid; place-items: center; font-size: 16px;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}
.wl-nav-actions { display: flex; align-items: center; gap: 16px; }

/* Role Selector Dropdown */
.wl-role-wrap { position: relative; }
.wl-role-btn {
  display: flex; align-items: center; gap: 8px;
  background: #FFFFFF; border: 1px solid #E2E8F0;
  padding: 8px 14px; border-radius: 8px;
  font-size: 13.5px; font-weight: 600; color: #334155;
  cursor: pointer; transition: all 0.15s;
}
.wl-role-btn:hover { border-color: #CBD5E1; background: #F8FAFC; }
.wl-role-menu {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #FFFFFF; border: 1px solid #E2E8F0;
  border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1);
  padding: 6px; width: 180px; z-index: 50;
}
.wl-role-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;
  color: #64748B; cursor: pointer; transition: all 0.15s;
}
.wl-role-item:hover { background: #F1F5F9; color: #0F172A; }
.wl-role-item.active { color: #0F766E; font-weight: 600; }

/* Buttons */
.wl-btn-ghost { font-size: 14px; font-weight: 600; color: #64748B; text-decoration: none; transition: color 0.15s; }
.wl-btn-ghost:hover { color: #0F172A; }
.wl-btn-primary {
  background: #0F766E; color: #FFFFFF; text-decoration: none;
  padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
  transition: all 0.2s; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
}
.wl-btn-primary:hover { background: #115E59; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15, 118, 110, 0.3); }

/* Hero Section */
.wl-hero {
  position: relative; z-index: 5;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; padding: 80px 48px 100px;
  max-width: 1400px; margin: 0 auto; align-items: center;
}
.wl-hero-copy { max-width: 540px; }
.wl-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #ECFDF5; border: 1px solid #A7F3D0;
  color: #047857; padding: 6px 14px; border-radius: 20px;
  font-size: 12.5px; font-weight: 600; margin-bottom: 24px;
}
.wl-headline {
  font-size: 54px; font-weight: 800; line-height: 1.1;
  letter-spacing: -1.5px; color: #0F172A; margin: 0 0 24px;
}
.wl-headline span { color: #0F766E; }
.wl-sub { font-size: 17px; color: #64748B; line-height: 1.6; margin-bottom: 36px; }
.wl-cta-row { display: flex; gap: 14px; margin-bottom: 48px; }
.wl-btn-lg {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
}
.wl-btn-lg-primary { background: #0F766E; color: #FFFFFF; box-shadow: 0 6px 20px rgba(15, 118, 110, 0.25); }
.wl-btn-lg-primary:hover { background: #115E59; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15, 118, 110, 0.35); }
.wl-btn-lg-outline { background: #FFFFFF; color: #334155; border: 1px solid #E2E8F0; }
.wl-btn-lg-outline:hover { background: #F8FAFC; border-color: #CBD5E1; }

.wl-trust { display: flex; gap: 32px; padding-top: 32px; border-top: 1px solid #E2E8F0; }
.wl-trust div { display: flex; flex-direction: column; gap: 4px; }
.wl-trust strong { font-size: 24px; font-weight: 700; color: #0F172A; }
.wl-trust span { font-size: 13px; color: #64748B; font-weight: 500; }

/* =========================================
   3D MEDICINE VISUAL (PURE CSS & SVG)
   ========================================= */
.wl-hero-visual { 
  position: relative; 
  height: 500px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.wl-3d-scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: wlFloat 6s ease-in-out infinite;
}

.wl-svg-3d {
  width: 100%;
  max-width: 420px;
  height: auto;
  filter: drop-shadow(0 30px 40px rgba(15, 118, 110, 0.15));
}

/* Floating Glass Mini Cards */
.wl-float {
  position: absolute; background: rgba(255, 255, 255, 0.9); padding: 12px 16px; border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1); border: 1px solid #F1F5F9;
  display: flex; align-items: center; gap: 12px; z-index: 3;
  backdrop-filter: blur(10px);
  animation: wlFloat 5s ease-in-out infinite;
}
.wl-float-1 { top: 20px; left: 0; animation-delay: 0s; }
.wl-float-2 { bottom: 40px; right: 0; animation-delay: -2.5s; }
.wl-float-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.wl-float-text { display: flex; flex-direction: column; gap: 2px; }
.wl-float-text span { font-size: 11.5px; color: #64748B; font-weight: 500; }
.wl-float-text strong { font-size: 14px; color: #0F172A; font-weight: 700; }

@keyframes wlFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

/* Features Section */
.wl-features { position: relative; z-index: 5; padding: 80px 48px; max-width: 1200px; margin: 0 auto; }
.wl-section-head { text-align: center; margin-bottom: 56px; }
.wl-section-head h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; color: #0F172A; margin: 0 0 16px; }
.wl-section-head p { font-size: 16px; color: #64748B; max-width: 600px; margin: 0 auto; }
.wl-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.wl-feature-card {
  background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px;
  transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}
.wl-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.05); border-color: #CBD5E1; }
.wl-feature-icon {
  width: 48px; height: 48px; border-radius: 12px; background: #F0FDFA; color: #0F766E;
  display: flex; align-items: center; justify-content: center; margin-bottom: 24px;
}
.wl-feature-card h3 { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 12px; }
.wl-feature-card p { font-size: 14.5px; color: #64748B; line-height: 1.6; margin: 0; }

/* CTA Section */
.wl-cta { position: relative; z-index: 5; padding: 40px 48px 80px; max-width: 1000px; margin: 0 auto; }
.wl-cta-inner {
  background: linear-gradient(135deg, #0F766E, #115E59);
  border-radius: 24px; padding: 60px 40px; text-align: center; color: #FFFFFF;
  box-shadow: 0 20px 40px -10px rgba(15, 118, 110, 0.4); position: relative; overflow: hidden;
}
.wl-cta-inner h2 { font-size: 32px; font-weight: 800; margin: 0 0 16px; letter-spacing: -0.5px; }
.wl-cta-inner p { font-size: 16px; color: #CCFBF1; margin: 0 0 32px; }
.wl-cta-inner .wl-btn-primary { background: #FFFFFF; color: #0F766E; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.wl-cta-inner .wl-btn-primary:hover { background: #F8FAFC; transform: translateY(-2px); }

.wl-footer { text-align: center; padding: 32px; color: #94A3B8; font-size: 13px; font-weight: 500; border-top: 1px solid #E2E8F0; }

/* Responsive */
@media (max-width: 1024px) {
  .wl-hero { grid-template-columns: 1fr; gap: 40px; padding: 60px 32px; text-align: center; }
  .wl-hero-copy { margin: 0 auto; }
  .wl-cta-row { justify-content: center; }
  .wl-trust { justify-content: center; }
  .wl-headline { font-size: 42px; }
  .wl-feature-grid { grid-template-columns: 1fr; }
  .wl-float-1 { left: 10%; top: 0; }
  .wl-float-2 { right: 10%; bottom: 0; }
  .wl-hero-visual { height: 400px; margin-top: 20px; }
}
@media (max-width: 768px) {
  .wl-nav { padding: 16px 20px; flex-direction: column; gap: 16px; }
  .wl-nav-actions { width: 100%; justify-content: space-between; }
  .wl-hero { padding: 40px 20px; }
  .wl-headline { font-size: 32px; }
  .wl-sub { font-size: 15px; }
  .wl-cta-row { flex-direction: column; }
  .wl-trust { gap: 20px; }
  .wl-trust strong { font-size: 20px; }
  .wl-float { display: none; }
  .wl-hero-visual { height: 300px; }
}
`;

export default function Welcome() {
  const [role, setRole] = useState("Manager");
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="wl-page">
        <div className="wl-blob wl-blob-1" />
        <div className="wl-blob wl-blob-2" />
        <div className="wl-blob wl-blob-3" />

        {/* Navbar */}
        <nav className="wl-nav">
          <Link to="/" className="wl-logo">
            <div className="wl-logo-mark">M</div>
            <span>MediStock</span>
          </Link>
          
          <div className="wl-nav-actions">
            {/* Manager Role Selector */}
            <div className="wl-role-wrap" ref={dropdownRef}>
              <button className="wl-role-btn" onClick={() => setRoleOpen(!roleOpen)}>
                <User size={16} />
                {role}
                <ChevronDown size={14} color="#94A3B8" />
              </button>
              {roleOpen && (
                <div className="wl-role-menu">
                  {["Manager", "Pharmacist", "Admin"].map((r) => (
                    <div
                      key={r}
                      className={`wl-role-item ${role === r ? "active" : ""}`}
                      onClick={() => { setRole(r); setRoleOpen(false); }}
                    >
                      {r}
                      {role === r && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/login" className="wl-btn-ghost">Sign in</Link>
            <Link to="/login" className="wl-btn-primary">Get started</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="wl-hero">
          <div className="wl-hero-copy">
            <div className="wl-badge">
              <Sparkles size={14} />
              <span>Trusted by 500+ pharmacies</span>
            </div>
            <h1 className="wl-headline">
              The pharmacy <span>operating system</span> for modern teams.
            </h1>
            <p className="wl-sub">
              Track medicines, batches, and expiry in one place. Eliminate spreadsheets and get real-time visibility into your entire pharmacy operation.
            </p>
            <div className="wl-cta-row">
              <Link to="/login" className="wl-btn-lg wl-btn-lg-primary">
                Open dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="wl-btn-lg wl-btn-lg-outline">
                Sign in
              </Link>
            </div>
            <div className="wl-trust">
              <div><strong>500+</strong><span>Pharmacies</span></div>
              <div><strong>2M+</strong><span>Meds tracked</span></div>
              <div><strong>99.9%</strong><span>Uptime</span></div>
            </div>
          </div>

          {/* Right Side: 3D Medicine Scene */}
          <div className="wl-hero-visual">
            
            {/* Floating Card 1 */}
            <div className="wl-float wl-float-1">
              <div className="wl-float-icon" style={{ background: "#ECFDF5", color: "#059669" }}>
                <TrendingUp size={18} />
              </div>
              <div className="wl-float-text">
                <span>Today's sales</span>
                <strong>₹26,400</strong>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="wl-float wl-float-2">
              <div className="wl-float-icon" style={{ background: "#F0FDFA", color: "#0F766E" }}>
                <Boxes size={18} />
              </div>
              <div className="wl-float-text">
                <span>Inventory</span>
                <strong>1,284 Items</strong>
              </div>
            </div>

            {/* The 3D Medicine SVG Graphic */}
            <div className="wl-3d-scene">
              <svg className="wl-svg-3d" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bottleBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>
                  <linearGradient id="bottleCap" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#0F766E" />
                  </linearGradient>
                  <linearGradient id="pillBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                  <linearGradient id="pillTop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0D9488" />
                  </linearGradient>
                  <linearGradient id="boxFront" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F1F5F9" />
                  </linearGradient>
                  <linearGradient id="boxSide" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                  <linearGradient id="boxTop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="25" stdDeviation="20" floodColor="#0F766E" floodOpacity="0.15" />
                  </filter>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* Background Glow */}
                <circle cx="250" cy="250" r="180" fill="#F0FDFA" opacity="0.6" filter="blur(40px)" />
                
                {/* Medicine Box (Isometric) */}
                <g transform="translate(80, 180) scale(0.9)" filter="url(#softShadow)">
                  {/* Top Face */}
                  <path d="M100 50 L200 0 L300 50 L200 100 Z" fill="url(#boxTop)" />
                  {/* Front Face */}
                  <path d="M100 50 L200 100 L200 220 L100 170 Z" fill="url(#boxFront)" />
                  {/* Side Face */}
                  <path d="M200 100 L300 50 L300 170 L200 220 Z" fill="url(#boxSide)" />
                  
                  {/* Box Details */}
                  <path d="M120 70 L180 100 L180 130 L120 100 Z" fill="#CCFBF1" />
                  <path d="M210 115 L280 80 L280 100 L210 135 Z" fill="#E2E8F0" />
                  <path d="M210 135 L280 100 L280 110 L210 145 Z" fill="#CBD5E1" />
                  
                  {/* Cross Icon on box */}
                  <path d="M140 120 L150 125 L150 135 L160 140 L160 130 L170 135 L170 145 L160 140 L160 150 L150 145 L150 135 L140 130 Z" fill="#0F766E" />
                </g>

                {/* 3D Pill Bottle */}
                <g transform="translate(250, 150)" filter="url(#shadow)">
                  {/* Bottle Body */}
                  <rect x="30" y="80" width="90" height="180" rx="15" fill="url(#bottleBody)" />
                  {/* Bottle Highlight */}
                  <rect x="40" y="85" width="15" height="170" rx="7" fill="#FFFFFF" opacity="0.8" />
                  {/* Bottle Label */}
                  <rect x="30" y="130" width="90" height="70" fill="#F8FAFC" />
                  <rect x="35" y="135" width="80" height="4" rx="2" fill="#0F766E" />
                  <rect x="35" y="145" width="60" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="35" y="155" width="70" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="35" y="180" width="40" height="4" rx="2" fill="#14B8A6" />
                  
                  {/* Bottle Cap */}
                  <rect x="35" y="40" width="80" height="40" rx="8" fill="url(#bottleCap)" />
                  {/* Cap Details */}
                  <rect x="35" y="45" width="80" height="4" fill="#0F766E" opacity="0.5" />
                  <rect x="35" y="55" width="80" height="4" fill="#0F766E" opacity="0.5" />
                  <rect x="35" y="65" width="80" height="4" fill="#0F766E" opacity="0.5" />
                  <rect x="40" y="42" width="10" height="35" rx="5" fill="#FFFFFF" opacity="0.3" />
                </g>

                {/* 3D Floating Capsule */}
                <g transform="translate(180, 80) rotate(35)" filter="url(#shadow)">
                  <rect x="0" y="0" width="60" height="140" rx="30" fill="url(#pillBody)" />
                  <path d="M0 35 L60 35 L60 30 C60 13.4 46.6 0 30 0 C13.4 0 0 13.4 0 30 Z" fill="url(#pillTop)" />
                  {/* Capsule Highlight */}
                  <rect x="10" y="10" width="8" height="120" rx="4" fill="#FFFFFF" opacity="0.5" />
                  <line x1="0" y1="35" x2="60" y2="35" stroke="#CBD5E1" strokeWidth="2" />
                </g>

                {/* Small Floating Pills */}
                <g transform="translate(360, 320)" filter="url(#softShadow)">
                  <rect x="0" y="0" width="30" height="70" rx="15" fill="url(#pillBody)" transform="rotate(-45)" />
                  <path d="M-5 10 L35 10" stroke="#0F766E" strokeWidth="2" transform="rotate(-45)" />
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="wl-features">
          <div className="wl-section-head">
            <h2>Everything you need to manage efficiently</h2>
            <p>A complete pharmacy management suite designed specifically for pharmacists and managers.</p>
          </div>
          
          <div className="wl-feature-grid">
            <div className="wl-feature-card">
              <div className="wl-feature-icon"><Boxes size={24} /></div>
              <h3>Real-time inventory</h3>
              <p>Never run out of critical stock. Automated low-stock alerts keep your shelves full without manual checks.</p>
            </div>
            <div className="wl-feature-card">
              <div className="wl-feature-icon"><ShieldCheck size={24} /></div>
              <h3>Expiry tracking</h3>
              <p>Batch-level alerts before medicines expire. Reduce wastage and stay compliant with automated reporting.</p>
            </div>
            <div className="wl-feature-card">
              <div className="wl-feature-icon"><TrendingUp size={24} /></div>
              <h3>Business insights</h3>
              <p>See what's selling, what's not, and where your margin really comes from with real-time analytics.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="wl-cta">
          <div className="wl-cta-inner">
            <h2>Ready to modernize your pharmacy?</h2>
            <p>Join 500+ pharmacies already using MediStock to streamline their operations.</p>
            <Link to="/login" className="wl-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "15px" }}>
              <Zap size={18} /> Get started free
            </Link>
          </div>
        </section>

        <footer className="wl-footer">
          © 2026 MediStock. Built for pharmacists.
        </footer>
      </div>
    </>
  );
}