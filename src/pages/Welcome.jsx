import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Package,
  CalendarCheck,
  AlertTriangle,
  Bell,
  CheckCircle2,
  PlusCircle,
  ScanLine,
  LineChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MedicineScene from "../three/MedicineScene";

// Change this to your admin login route (check your router file)
const LOGIN_ROUTE = "/login";

/* ---------- helpers ---------- */

// Number that counts up when it scrolls into view
function CountUp({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// Glass card that floats gently around the 3D scene
function FloatCard({ className, delay = 0, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay: 0.8 + delay, duration: 0.6 },
        y: { delay: 0.8 + delay, duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute z-20 rounded-2xl border border-white/15 bg-[#0a2c26]/70 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Card with a spotlight that follows the cursor
function SpotCard({ icon: Icon, title, text }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const bg = useTransform(
    [x, y],
    ([mx, my]) =>
      `radial-gradient(220px circle at ${mx}px ${my}px, rgba(52,211,153,0.18), transparent 70%)`
  );

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-lg"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="relative">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/30 transition group-hover:bg-emerald-400/20">
          <Icon className="text-emerald-300" size={24} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-emerald-100/60">{text}</p>
      </div>
    </motion.div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7 },
};

/* ---------- page ---------- */

export default function Welcome() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Soft glow that follows the mouse across the page
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glow = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(16,185,129,0.12), transparent 60%)`
  );

  const goToLogin = () => navigate(LOGIN_ROUTE);

  const features = [
    { icon: Package, title: "Stock Control", text: "Add, update and track every medicine batch with live quantities." },
    { icon: CalendarCheck, title: "Expiry Tracking", text: "See what expires soon and act before stock goes to waste." },
    { icon: ShieldCheck, title: "Safe Inventory", text: "Separate usable stock from expired items at a glance." },
    { icon: Activity, title: "Stock Insights", text: "Understand what moves fast and what needs reordering." },
  ];

  const steps = [
    { icon: PlusCircle, title: "Add your medicines", text: "Enter name, batch, quantity and expiry date." },
    { icon: ScanLine, title: "Track automatically", text: "Stock levels and expiry dates update as you work." },
    { icon: LineChart, title: "Act on insights", text: "Reorder low stock and clear expiring items early." },
  ];

  return (
    <main
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY + window.scrollY);
      }}
      className="relative min-h-screen overflow-hidden bg-[#061f1b] text-white selection:bg-emerald-400/30"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-emerald-400 to-teal-300"
      />

      {/* Background: grid + glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 75%)",
        }}
      />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="absolute -right-40 bottom-1/3 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl" />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-8 py-6 md:px-16"
      >
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-300">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400 text-lg text-[#06251e]">✚</span>
          MediStock
        </h1>

        <span className="hidden text-sm text-emerald-100/70 sm:block">
          Smart Medicine Stock Management
        </span>

        <button
          onClick={goToLogin}
          className="rounded-lg border border-emerald-400/40 px-5 py-2 transition hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          Get Started
        </button>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-8 py-10 md:grid-cols-2 md:px-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Your Pharmacy. Smarter Management.
          </span>

          <h2 className="mt-7 text-5xl font-bold leading-tight md:text-6xl">
            Manage Your
            <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
              Medicine Stock
            </span>
            With Confidence.
          </h2>

          <p className="mt-6 max-w-lg leading-8 text-emerald-100/70">
            Simplify your pharmacy inventory with smart medicine management,
            stock monitoring, expiry tracking and inventory insights in one platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={goToLogin}
              className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-400 px-7 py-4 font-semibold text-[#06251e] shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore Dashboard</span>
              <ArrowRight size={20} className="relative transition group-hover:translate-x-1" />
            </motion.button>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/15 px-6 py-4 text-emerald-100/80 transition hover:border-emerald-400/50 hover:text-white"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-emerald-100/60">
            <CheckCircle2 size={18} className="text-emerald-400" />
            No setup needed. Start tracking in minutes.
          </div>
        </motion.div>

        {/* 3D scene + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[420px] w-full md:h-[560px]"
        >
          <div className="absolute inset-10 rounded-full bg-emerald-400/10 blur-3xl" />
          <MedicineScene />

          <FloatCard className="left-0 top-8 w-52 md:-left-4" delay={0}>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15">
                <AlertTriangle size={18} className="text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">Low stock</p>
                <p className="text-xs text-emerald-100/60">Paracetamol · 12 left</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="right-0 top-1/3 w-52 md:-right-4" delay={0.4}>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-400/15">
                <Bell size={18} className="text-rose-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">Expiring soon</p>
                <p className="text-xs text-emerald-100/60">3 batches in 7 days</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard className="bottom-10 left-6 w-56 md:left-2" delay={0.8}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-100/70">Stock health</span>
              <span className="font-semibold text-emerald-300">92%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ delay: 1.6, duration: 1.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
              />
            </div>
          </FloatCard>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-8 md:px-16">
        <motion.div
          {...reveal}
          className="grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-lg md:grid-cols-4"
        >
          {[
            { n: 10000, s: "+", l: "Medicines tracked" },
            { n: 99, s: "%", l: "Stock accuracy" },
            { n: 24, s: "/7", l: "Expiry monitoring" },
            { n: 5, s: "x", l: "Faster stock checks" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-bold text-emerald-300 md:text-4xl">
                <CountUp to={s.n} suffix={s.s} />
              </p>
              <p className="mt-1 text-sm text-emerald-100/60">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-8 py-24 md:px-16">
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <h3 className="text-3xl font-bold md:text-4xl">Everything your pharmacy shelf needs</h3>
          <p className="mt-4 text-emerald-100/60">
            One place to see what you have, what is running out, and what is about to expire.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <SpotCard {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-5xl px-8 pb-24 md:px-16">
        <motion.h3 {...reveal} className="text-center text-3xl font-bold md:text-4xl">
          Up and running in three steps
        </motion.h3>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center"
            >
              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/40 bg-[#0a2c26] shadow-lg shadow-emerald-500/10">
                <s.icon className="text-emerald-300" size={26} />
              </div>
              <h4 className="mt-5 text-lg font-semibold">
                {i + 1}. {s.title}
              </h4>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-emerald-100/60">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-8 pb-24 md:px-16">
        <motion.div
          {...reveal}
          className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-[#0a2c26] to-teal-500/10 p-10 text-center md:p-14"
        >
          <div className="absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
          <h3 className="relative text-3xl font-bold md:text-4xl">Ready to take control of your stock?</h3>
          <p className="relative mx-auto mt-4 max-w-xl text-emerald-100/70">
            Log in as admin to see your inventory, expiry dates and insights in one view.
          </p>
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={goToLogin}
            className="relative mt-8 inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-8 py-4 font-semibold text-[#06251e] shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
          >
            Admin Login
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-6 text-center text-sm text-emerald-100/40">
        © 2026 MediStock | Smart Medicine Stock Management System
      </footer>
    </main>
  );
}