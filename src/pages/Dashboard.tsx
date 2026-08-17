import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice, type Category } from "../data/products";
import {
  DashStatus,
  DashState,
  REVENUE_WEEKS,
  SPARKS,
  loadDash,
  saveDash,
} from "../store/dashboard";
import { getSettings, saveCustomPromos, getCustomPromos, saveSettings, type DashSettings } from "../store/coupons";
import {
  OPENROUTER_MODELS,
  getApiKey,
  getModel,
  saveApiKey,
  saveModel,
  testKey,
} from "../store/openrouter";
import { useCart } from "../store/CartContext";
import { BrandingTab, CatalogTab, HomepageTab, ShippingTab } from "./DashboardTabs";
import {
  ArrowUpRight,
  BellIcon,
  BoltIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  CloseIcon,
  DiamondIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LogoMark,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "../components/Icons";

function OpenRouterCard() {
  const [key, setKey] = useState(() => getApiKey());
  const [model, setModel] = useState(() => getModel());
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const saved = Boolean(getApiKey());

  const save = () => {
    saveApiKey(key);
    saveModel(model);
    setResult({ ok: true, message: "Saved — the Concierge is listening on the storefront." });
  };

  const runTest = async () => {
    if (!key.trim()) {
      setResult({ ok: false, message: "Paste a key first — it starts with sk-or-." });
      return;
    }
    setTesting(true);
    setResult(null);
    const r = await testKey(key);
    setResult(r);
    setTesting(false);
  };

  return (
    <div className="border border-brass/35 bg-coal/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-bold text-xl flex items-center gap-2.5">
          <ChatIcon className="w-5 h-5 text-brass" /> Concierge AI · OpenRouter
        </h3>
        <span
          className={`font-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1.5 border ${
            saved ? "text-[#9fc4ab] border-[#9fc4ab]/40" : "text-rust border-rust/50"
          }`}
        >
          {saved ? "Connected" : "No key"}
        </span>
      </div>
      <p className="mt-2 text-xs text-paper/45 leading-relaxed">
        One key powers the floating Concierge chat on the storefront. It answers from the
        live catalog, codes and house policies — nothing else leaves the browser.
      </p>

      <div className="mt-5">
        <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">OpenRouter API key</label>
        <div className="mt-2 flex items-center border border-paper/15 bg-ink focus-within:border-brass transition-colors">
          <KeyIcon className="w-4 h-4 ml-3.5 text-brass shrink-0" />
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setResult(null);
            }}
            placeholder="sk-or-v1-…"
            className="flex-1 min-w-0 bg-transparent px-3 py-3 font-mono text-sm focus:outline-none placeholder:text-paper/25"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            data-cursor
            onClick={() => setShow((s) => !s)}
            className="px-3.5 text-paper/40 hover:text-brass transition-colors"
            aria-label={show ? "Hide key" : "Show key"}
          >
            {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">Model</label>
        <div className="mt-2 relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full appearance-none bg-ink border border-paper/15 px-4 py-3 pr-10 font-mono text-xs text-paper focus:outline-none focus:border-brass cursor-pointer transition-colors"
          >
            {OPENROUTER_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} — {m.id}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 12 8" className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-2 pointer-events-none text-brass" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m1 1.5 5 5 5-5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {result && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 border px-4 py-3 text-xs ${
            result.ok
              ? "border-[#9fc4ab]/45 text-[#9fc4ab] bg-[#9fc4ab]/5"
              : "border-rust/50 text-[#d98a72] bg-rust/5"
          }`}
        >
          {result.message}
        </motion.p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          data-cursor
          onClick={save}
          className="btn-sheen flex-1 bg-brass text-ink py-3 font-mono text-[10px] tracking-[0.22em] uppercase font-medium hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
        >
          <CheckIcon className="w-4 h-4" /> Save key
        </button>
        <button
          data-cursor
          onClick={runTest}
          disabled={testing}
          className="border border-paper/25 px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-paper/70 hover:border-brass hover:text-brass transition-all duration-300 disabled:opacity-50 flex items-center gap-2.5"
        >
          {testing ? (
            <span className="w-3.5 h-3.5 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
          ) : (
            <BoltIcon className="w-3.5 h-3.5" />
          )}
          Test line
        </button>
      </div>
      <p className="mt-3 text-[10px] text-paper/30 leading-relaxed">
        Stored in this browser's ledger only. Create a key at openrouter.ai/keys — free
        models work out of the box.
      </p>
    </div>
  );
}

type Tab =
  | "overview"
  | "orders"
  | "products"
  | "catalog"
  | "customers"
  | "promos"
  | "homepage"
  | "branding"
  | "shipping"
  | "settings";

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Overview", icon: <BoltIcon className="w-4 h-4" /> },
  { id: "orders", label: "Orders", icon: <CartIcon className="w-4 h-4" /> },
  { id: "products", label: "Inventory", icon: <PackageIcon className="w-4 h-4" /> },
  { id: "catalog", label: "Catalog", icon: <DiamondIcon className="w-3.5 h-3.5" /> },
  { id: "customers", label: "Customers", icon: <UserIcon className="w-4 h-4" /> },
  { id: "promos", label: "Promotions", icon: <TagIcon className="w-4 h-4" /> },
  { id: "homepage", label: "Homepage", icon: <BellIcon className="w-4 h-4" /> },
  { id: "branding", label: "Branding", icon: <LogoMark className="w-4 h-4" /> },
  { id: "shipping", label: "Shipping", icon: <TruckIcon className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
];

const STATUS_STYLE: Record<DashStatus, string> = {
  placed: "border-brass/50 text-goldlight bg-brass/10",
  sealed: "border-pine text-[#9fc4ab] bg-pine/20",
  "in-transit": "border-gold/50 text-brass bg-gold/10",
  delivered: "border-[#3e5c48] text-[#b9d6c2] bg-[#24382c]/50",
  cancelled: "border-rust/60 text-[#d98a72] bg-rust/10",
};

const CHART_TOOLTIP = {
  background: "#211e15",
  border: "1px solid rgba(201,162,75,0.35)",
  color: "#f2efe7",
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-GB");
}

/* ================= small pieces ================= */

function Spark({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={pts} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sp-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} fill={`url(#sp-${color})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  up,
  data,
  color,
  delay,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  data: number[];
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-paper/12 bg-coal/70 p-5 hover:border-brass/40 transition-colors duration-300 group"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">{label}</span>
        <span className={`font-mono text-[10px] tabular-nums ${up ? "text-[#9fc4ab]" : "text-[#d98a72]"}`}>
          {up ? "▲" : "▼"} {delta}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="font-display font-extrabold text-3xl text-paper tabular-nums group-hover:text-goldlight transition-colors">
          {value}
        </span>
        <Spark data={data} color={color} />
      </div>
    </motion.div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      data-cursor
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={`relative w-12 h-6.5 h-7 border-2 transition-colors duration-300 ${on ? "bg-brass border-brass" : "bg-transparent border-paper/25"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 transition-all duration-300 ${on ? "left-6 bg-ink" : "left-0.5 bg-paper/50"}`}
      />
    </button>
  );
}

/* ================= tabs ================= */

function OverviewTab({ dash }: { dash: DashState }) {
  const revenue = REVENUE_WEEKS.reduce((s, r) => s + r.revenue, 0);
  const orders = dash.orders.length;
  const aov = Math.round(revenue / 390);
  const recent = dash.orders.slice(0, 6);

  const catData = useMemo(() => {
    const m = new Map<Category, number>();
    dash.products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + p.price));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [dash.products]);
  const PIE_COLORS = ["#c9a24b", "#97721d", "#24382c", "#e9cd8b"];

  const top = [
    { name: "Aurion One", sold: 342 },
    { name: "Halo Buds Pro", sold: 511 },
    { name: "Meridian S", sold: 289 },
    { name: "Obelisk", sold: 240 },
    { name: "Falcon X", sold: 133 },
  ];
  const maxSold = Math.max(...top.map((t) => t.sold));
  const low = dash.products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi label="Revenue · 12 weeks" value={formatPrice(revenue)} delta="18.2%" up data={SPARKS.revenue} color="#c9a24b" delay={0} />
        <Kpi label="Orders · live" value={String(orders + 380)} delta="9.4%" up data={SPARKS.orders} color="#9fc4ab" delay={0.06} />
        <Kpi label="Average order" value={formatPrice(aov)} delta="4.1%" up data={SPARKS.aov} color="#e9cd8b" delay={0.12} />
        <Kpi label="Conversion" value="3.4%" delta="0.3pt" up data={SPARKS.conversion} color="#d98a72" delay={0.18} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="xl:col-span-2 border border-paper/12 bg-coal/70 p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl">Revenue ledger</h3>
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40">Last 12 weeks</span>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_WEEKS} margin={{ top: 5, right: 5, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="revGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a24b" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#c9a24b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(242,239,231,0.06)" vertical={false} />
                <XAxis dataKey="w" stroke="rgba(242,239,231,0.3)" fontSize={10} fontFamily="IBM Plex Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(242,239,231,0.3)" fontSize={10} fontFamily="IBM Plex Mono" tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} />
                <Tooltip contentStyle={CHART_TOOLTIP} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} cursor={{ stroke: "rgba(201,162,75,0.4)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#c9a24b" strokeWidth={2} fill="url(#revGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="border border-paper/12 bg-coal/70 p-6"
        >
          <h3 className="font-display font-bold text-xl">Value by discipline</h3>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3} stroke="#171510">
                  {catData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP} formatter={(v) => [formatPrice(Number(v)), ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {catData.map((c, i) => (
              <li key={c.name} className="flex items-center gap-2.5 text-xs text-paper/60">
                <span className="w-2.5 h-2.5" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {c.name}
                <span className="ml-auto tabular-nums font-mono text-[10px] text-paper/40">{formatPrice(c.value)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="xl:col-span-2 border border-paper/12 bg-coal/70"
        >
          <div className="flex items-center justify-between px-6 pt-6">
            <h3 className="font-display font-bold text-xl">Recent seals</h3>
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40">Latest {recent.length}</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 border-b border-paper/10">
                  <th className="px-6 py-3 font-normal">Order</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-paper/6 hover:bg-paper/4 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-brass">{o.id}</td>
                    <td className="px-4 py-3.5">{o.customer}</td>
                    <td className="px-4 py-3.5 tabular-nums">{formatPrice(o.total)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`border px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] uppercase ${STATUS_STYLE[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="border border-paper/12 bg-coal/70 p-6"
          >
            <h3 className="font-display font-bold text-xl">Top objets</h3>
            <ul className="mt-4 space-y-3.5">
              {top.map((t, i) => (
                <li key={t.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-paper/70">{t.name}</span>
                    <span className="font-mono text-[10px] text-paper/40 tabular-nums">{t.sold} sold</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-paper/8 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: i === 0 ? "#c9a24b" : "#97721d" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.sold / maxSold) * 100}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-rust/40 bg-rust/5 p-6"
          >
            <h3 className="font-display font-bold text-xl flex items-center gap-2.5">
              <DiamondIcon className="w-2.5 h-2.5 text-rust" /> Low stock
            </h3>
            <ul className="mt-4 space-y-2.5">
              {low.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-xs">
                  <span className="text-paper/70">{p.name}</span>
                  <span className={`font-mono text-[10px] tabular-nums ${p.stock <= 5 ? "text-[#d98a72]" : "text-paper/40"}`}>
                    {p.stock} left
                  </span>
                </li>
              ))}
              {low.length === 0 && <li className="text-xs text-paper/40">All shelves healthy.</li>}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({
  dash,
  search,
  onStatus,
}: {
  dash: DashState;
  search: string;
  onStatus: (id: string, status: DashStatus) => void;
}) {
  const [filter, setFilter] = useState<DashStatus | "all">("all");
  const q = search.trim().toLowerCase();
  const list = dash.orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.email.toLowerCase().includes(q))
  );

  const pills: Array<DashStatus | "all"> = ["all", "placed", "sealed", "in-transit", "delivered", "cancelled"];

  return (
    <div className="border border-paper/12 bg-coal/70">
      <div className="flex flex-wrap items-center gap-2 px-6 py-5 border-b border-paper/10">
        {pills.map((p) => {
          const count = p === "all" ? dash.orders.length : dash.orders.filter((o) => o.status === p).length;
          return (
            <button
              key={p}
              data-cursor
              onClick={() => setFilter(p)}
              className={`px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase border transition-all duration-300 ${
                filter === p ? "bg-brass text-ink border-brass" : "border-paper/15 text-paper/50 hover:border-brass/50 hover:text-paper"
              }`}
            >
              {p} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 border-b border-paper/10">
              <th className="px-6 py-3.5 font-normal">Order</th>
              <th className="px-4 py-3.5 font-normal">Customer</th>
              <th className="px-4 py-3.5 font-normal">Date</th>
              <th className="px-4 py-3.5 font-normal">Items</th>
              <th className="px-4 py-3.5 font-normal">Method</th>
              <th className="px-4 py-3.5 font-normal">Total</th>
              <th className="px-6 py-3.5 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-paper/6 hover:bg-paper/4 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-brass">{o.id}</td>
                <td className="px-4 py-4">
                  <div>{o.customer}</div>
                  <div className="text-[11px] text-paper/35">{o.email}</div>
                </td>
                <td className="px-4 py-4 font-mono text-xs text-paper/55 tabular-nums">
                  {new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </td>
                <td className="px-4 py-4 tabular-nums">{o.items}</td>
                <td className="px-4 py-4 text-xs text-paper/55">{o.method}</td>
                <td className="px-4 py-4 tabular-nums font-medium">{formatPrice(o.total)}</td>
                <td className="px-6 py-4">
                  <select
                    value={o.status}
                    onChange={(e) => onStatus(o.id, e.target.value as DashStatus)}
                    className={`bg-transparent border px-2.5 py-1.5 font-mono text-[9px] tracking-[0.14em] uppercase cursor-pointer focus:outline-none ${STATUS_STYLE[o.status]}`}
                  >
                    {(["placed", "sealed", "in-transit", "delivered", "cancelled"] as DashStatus[]).map((s) => (
                      <option key={s} value={s} className="bg-coal text-paper">
                        {s}
                    </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-paper/40 font-mono text-xs tracking-[0.2em] uppercase">
                  Nothing in the ledger matches
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsTab({
  dash,
  search,
  onStock,
  onToggle,
}: {
  dash: DashState;
  search: string;
  onStock: (id: string, delta: number) => void;
  onToggle: (id: string) => void;
}) {
  const q = search.trim().toLowerCase();
  const list = dash.products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  return (
    <div className="border border-paper/12 bg-coal/70 overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="text-left font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 border-b border-paper/10">
            <th className="px-6 py-3.5 font-normal">Objet</th>
            <th className="px-4 py-3.5 font-normal">Discipline</th>
            <th className="px-4 py-3.5 font-normal">Price</th>
            <th className="px-4 py-3.5 font-normal">Stock</th>
            <th className="px-6 py-3.5 font-normal">On sale</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className={`border-b border-paper/6 hover:bg-paper/4 transition-colors ${p.active ? "" : "opacity-45"}`}>
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3.5">
                  <span className="w-12 h-12 plate-dark border border-paper/15 p-1 shrink-0">
                    <img src={p.img} alt="" className="blend-lighten w-full h-full object-contain" />
                  </span>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-paper/35">{p.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs text-paper/60">{p.category}</td>
              <td className="px-4 py-3.5 tabular-nums">{formatPrice(p.price)}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    data-cursor
                    onClick={() => onStock(p.id, -1)}
                    className="w-7 h-7 border border-paper/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors"
                    aria-label={`Decrease ${p.name} stock`}
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  <span className={`w-10 text-center font-mono text-xs tabular-nums ${p.stock <= 5 ? "text-[#d98a72]" : p.stock <= 10 ? "text-brass" : "text-paper/80"}`}>
                    {p.stock}
                  </span>
                  <button
                    data-cursor
                    onClick={() => onStock(p.id, 1)}
                    className="w-7 h-7 border border-paper/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors"
                    aria-label={`Increase ${p.name} stock`}
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="px-6 py-3.5">
                <Toggle on={p.active} onChange={() => onToggle(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomersTab({ dash }: { dash: DashState }) {
  const customers = useMemo(() => {
    const m = new Map<string, { name: string; email: string; orders: number; spent: number; last: string }>();
    dash.orders.forEach((o) => {
      const key = o.email.toLowerCase();
      const prev = m.get(key);
      m.set(key, {
        name: o.customer,
        email: o.email,
        orders: (prev?.orders ?? 0) + 1,
        spent: (prev?.spent ?? 0) + (o.status === "cancelled" ? 0 : o.total),
        last: !prev || +new Date(o.date) > +new Date(prev.last) ? o.date : prev.last,
      });
    });
    return Array.from(m.values()).sort((a, b) => b.spent - a.spent);
  }, [dash.orders]);

  return (
    <div className="border border-paper/12 bg-coal/70 overflow-x-auto">
      <table className="w-full text-sm min-w-[680px]">
        <thead>
          <tr className="text-left font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 border-b border-paper/10">
            <th className="px-6 py-3.5 font-normal">Member</th>
            <th className="px-4 py-3.5 font-normal">Orders</th>
            <th className="px-4 py-3.5 font-normal">Lifetime value</th>
            <th className="px-4 py-3.5 font-normal">Last order</th>
            <th className="px-6 py-3.5 font-normal">Tier</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const tier = c.spent >= 2000 ? "Gold" : c.spent >= 900 ? "Brass" : "Bronze";
            const tierCls =
              tier === "Gold"
                ? "bg-brass text-ink"
                : tier === "Brass"
                ? "border border-gold/50 text-brass"
                : "border border-paper/20 text-paper/50";
            return (
              <tr key={c.email} className="border-b border-paper/6 hover:bg-paper/4 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-9 h-9 rounded-full bg-pine text-goldlight font-display font-bold text-sm flex items-center justify-center">
                      {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-[11px] text-paper/35">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 tabular-nums">{c.orders}</td>
                <td className="px-4 py-4 tabular-nums font-medium">{formatPrice(c.spent)}</td>
                <td className="px-4 py-4 font-mono text-xs text-paper/55 tabular-nums">
                  {new Date(c.last).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase ${tierCls}`}>{tier}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PromosTab({
  dash,
  onToggle,
  onMint,
}: {
  dash: DashState;
  onToggle: (code: string) => void;
  onMint: (code: string, kind: "pct" | "flat", value: number) => string | null;
}) {
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"pct" | "flat">("pct");
  const [value, setValue] = useState("10");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(value, 10);
    if (code.trim().length < 3) return setErr("Code needs at least 3 characters");
    if (!v || v <= 0 || (kind === "pct" && v > 90)) return setErr(kind === "pct" ? "Percent must be 1–90" : "Value must be positive");
    const error = onMint(code.trim().toUpperCase(), kind, v);
    if (error) return setErr(error);
    setErr(null);
    setCode("");
    setValue("10");
  };

  return (
    <div className="grid xl:grid-cols-3 gap-4 items-start">
      <div className="xl:col-span-2 border border-paper/12 bg-coal/70 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 border-b border-paper/10">
              <th className="px-6 py-3.5 font-normal">Code</th>
              <th className="px-4 py-3.5 font-normal">Offer</th>
              <th className="px-4 py-3.5 font-normal">Times used</th>
              <th className="px-4 py-3.5 font-normal">Origin</th>
              <th className="px-6 py-3.5 font-normal">Live</th>
            </tr>
          </thead>
          <tbody>
            {dash.promos.map((p) => (
              <tr key={p.code} className={`border-b border-paper/6 hover:bg-paper/4 transition-colors ${p.active ? "" : "opacity-45"}`}>
                <td className="px-6 py-4 font-display font-bold tracking-[0.1em] text-goldlight">{p.code}</td>
                <td className="px-4 py-4 text-xs text-paper/60">
                  {p.kind === "pct" ? `${p.value}% off` : `${formatPrice(p.value)} off`}
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-xs tabular-nums text-paper/70">{p.used}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`font-mono text-[9px] tracking-[0.16em] uppercase px-2 py-1 border ${p.custom ? "border-brass/50 text-brass" : "border-paper/20 text-paper/45"}`}>
                    {p.custom ? "Minted" : "House"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Toggle on={p.active} onChange={() => onToggle(p.code)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-brass/35 bg-coal/70 p-6">
        <h3 className="font-display font-bold text-xl flex items-center gap-2.5">
          <TagIcon className="w-5 h-5 text-brass" /> Mint a code
        </h3>
        <p className="mt-2 text-xs text-paper/45 leading-relaxed">
          Minted codes work immediately at the boutique checkout — the ledger updates
          both sides at once.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">Code</label>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErr(null);
              }}
              placeholder="ATELIER30"
              className="mt-2 w-full bg-ink border border-paper/15 px-4 py-3 font-mono tracking-[0.18em] focus:outline-none focus:border-brass transition-colors placeholder:text-paper/25"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">Type</label>
              <div className="mt-2 grid grid-cols-2 border border-paper/15">
                {(["pct", "flat"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    data-cursor
                    onClick={() => setKind(k)}
                    className={`py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${kind === k ? "bg-brass text-ink" : "text-paper/50 hover:text-paper"}`}
                  >
                    {k === "pct" ? "%" : "$"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">Value</label>
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/\D/g, ""));
                  setErr(null);
                }}
                inputMode="numeric"
                className="mt-2 w-full bg-ink border border-paper/15 px-4 py-3 font-mono focus:outline-none focus:border-brass transition-colors"
              />
            </div>
          </div>
          {err && <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#d98a72]">{err}</p>}
          <button
            data-cursor
            type="submit"
            className="btn-sheen group w-full bg-brass text-ink py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
          >
            <PlusIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
            Mint into the ledger
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onSave,
  onReset,
}: {
  settings: DashSettings;
  onSave: (s: DashSettings) => void;
  onReset: () => void;
}) {
  const [local, setLocal] = useState(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="grid xl:grid-cols-2 gap-4 items-start">
      <div className="border border-paper/12 bg-coal/70 p-6 space-y-6">
        <h3 className="font-display font-bold text-xl">Storefront rules</h3>
        <p className="text-xs text-paper/45 leading-relaxed border border-paper/10 px-4 py-3">
          Delivery thresholds live under <span className="text-brass">Shipping</span> · maintenance
          mode and store identity live under <span className="text-brass">Branding</span> · section
          switches and copy live under <span className="text-brass">Homepage</span>.
        </p>
        <div className="flex items-center justify-between border-t border-paper/10 pt-5">
          <div>
            <div className="font-medium text-sm">Private-list letters</div>
            <div className="text-xs text-paper/40 mt-0.5">Seasonal letter to members.</div>
          </div>
          <Toggle on={local.newsletter} onChange={(v) => setLocal((s) => ({ ...s, newsletter: v }))} />
        </div>
        <div className="border-t border-paper/10 pt-5">
          <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">Ledger currency</label>
          <div className="mt-2 grid grid-cols-3 border border-paper/15 w-56">
            {(["USD", "EUR", "CHF"] as const).map((c) => (
              <button
                key={c}
                type="button"
                data-cursor
                onClick={() => setLocal((s) => ({ ...s, currency: c }))}
                className={`py-2.5 font-mono text-[10px] tracking-[0.18em] transition-colors ${local.currency === c ? "bg-brass text-ink" : "text-paper/50 hover:text-paper"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <button
          data-cursor
          onClick={() => onSave(local)}
          className="btn-sheen w-full bg-brass text-ink py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
        >
          <CheckIcon className="w-4 h-4" /> Save rules to the storefront
        </button>
      </div>

      <div className="space-y-4">
        <div className="border border-paper/12 bg-coal/70 p-6">
          <h3 className="font-display font-bold text-xl">System</h3>
          <ul className="mt-4 space-y-3 text-xs text-paper/55">
            <li className="flex justify-between border-b border-paper/8 pb-3">
              <span>Build</span>
              <span className="font-mono text-brass">AURION Console 2.4.0</span>
            </li>
            <li className="flex justify-between border-b border-paper/8 pb-3">
              <span>Register storage</span>
              <span className="font-mono text-paper/70">Local ledger · encrypted at rest (concept)</span>
            </li>
            <li className="flex justify-between">
              <span>Uptime</span>
              <span className="font-mono text-[#9fc4ab]">99.98% · 30 days</span>
            </li>
          </ul>
        </div>
        <OpenRouterCard />
        <div className="border border-rust/40 bg-rust/5 p-6">
          <h3 className="font-display font-bold text-xl text-[#d98a72]">Danger zone</h3>
          <p className="mt-2 text-xs text-paper/45">
            Reseeds the demo ledger. Real checkout orders are kept; dashboard edits are
            wiped.
          </p>
          {confirmReset ? (
            <div className="mt-4 flex gap-3">
              <button
                data-cursor
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                className="bg-rust text-paper px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:opacity-85 transition-opacity"
              >
                Yes, reseed
              </button>
              <button
                data-cursor
                onClick={() => setConfirmReset(false)}
                className="border border-paper/25 px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/60 hover:text-paper transition-colors"
              >
                Keep it
              </button>
            </div>
          ) : (
            <button
              data-cursor
              onClick={() => setConfirmReset(true)}
              className="mt-4 border border-rust/60 text-[#d98a72] px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-rust hover:text-paper transition-all duration-300"
            >
              Reseed demo data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= page ================= */

export default function Dashboard() {
  const [dash, setDash] = useState<DashState>(() => loadDash());
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState<DashSettings>(() => getSettings());
  const { pushToast } = useCart();
  const clock = useClock();

  const update = (fn: (d: DashState) => DashState, toast?: [string, string?]) => {
    setDash((d) => {
      const next = fn(d);
      saveDash(next);
      return next;
    });
    if (toast) pushToast(toast[0], toast[1]);
  };

  const onStatus = (id: string, status: DashStatus) =>
    update(
      (d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
      ["Ledger updated", `${id} → ${status}`]
    );

  const onStock = (id: string, delta: number) =>
    update((d) => ({
      ...d,
      products: d.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
    }));

  const onToggleProduct = (id: string) =>
    update((d) => ({
      ...d,
      products: d.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    }));

  const onTogglePromo = (code: string) => {
    const target = dash.promos.find((p) => p.code === code);
    const willBeActive = target ? !target.active : false;
    update(
      (d) => ({ ...d, promos: d.promos.map((p) => (p.code === code ? { ...p, active: !p.active } : p)) }),
      ["Promo ledger updated", `${code} is now ${willBeActive ? "live" : "paused"}`]
    );
    if (target?.custom) {
      const label =
        target.kind === "pct"
          ? `${target.value}% off — minted at the console`
          : `${formatPrice(target.value)} off — minted at the console`;
      const customs = getCustomPromos();
      if (willBeActive) {
        if (!customs.some((c) => c.code === code)) {
          saveCustomPromos([...customs, { code, label, type: target.kind, value: target.value }]);
        }
      } else {
        saveCustomPromos(customs.filter((c) => c.code !== code));
      }
    }
  };

  const onMint = (code: string, kind: "pct" | "flat", value: number): string | null => {
    if (dash.promos.some((p) => p.code === code)) return "That code already exists in the ledger";
    update(
      (d) => ({
        ...d,
        promos: [{ code, kind, value, used: 0, active: true, custom: true }, ...d.promos],
      }),
      ["Code minted", `${code} is live at checkout`]
    );
    saveCustomPromos([
      ...getCustomPromos(),
      { code, label: kind === "pct" ? `${value}% off — minted at the console` : `${formatPrice(value)} off — minted at the console`, type: kind, value },
    ]);
    return null;
  };

  const onSaveSettings = (s: DashSettings) => {
    setSettings(s);
    saveSettings(s);
    pushToast("Rules saved", `Free delivery now above ${formatPrice(s.freeShipAt)}.`);
  };

  const onReset = () => {
    try {
      localStorage.removeItem("aurion-dash-state-v1");
    } catch {
      /* ignore */
    }
    setDash(loadDash());
    pushToast("Ledger reseeded", "Demo data restored.");
  };

  const title = TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-ink text-paper flex"
    >
      {/* sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-paper/10 bg-coal/60 sticky top-0 h-screen">
        <Link to="/" data-cursor className="flex items-center gap-3 px-6 py-7 border-b border-paper/10 group">
          <LogoMark className="w-6 h-6 text-brass transition-transform duration-500 group-hover:rotate-[360deg]" />
          <span className="font-display font-extrabold tracking-[0.24em]">AURION</span>
          <span className="ml-auto font-mono text-[8px] tracking-[0.2em] uppercase text-brass border border-brass/40 px-1.5 py-0.5">
            Console
          </span>
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              data-cursor
              onClick={() => setTab(t.id)}
              className={`relative w-full flex items-center gap-3.5 px-4 py-3 font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ${
                tab === t.id ? "bg-brass/12 text-goldlight" : "text-paper/45 hover:text-paper hover:bg-paper/4"
              }`}
            >
              {tab === t.id && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-brass" />}
              {t.icon}
              {t.label}
              {t.id === "orders" && (
                <span className="ml-auto bg-brass text-ink text-[9px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                  {dash.orders.filter((o) => o.status === "placed").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-6 space-y-3">
          <Link
            to="/"
            data-cursor
            className="group flex items-center gap-3 px-4 py-3 border border-paper/12 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/55 hover:text-brass hover:border-brass/50 transition-all duration-300"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            Back to boutique
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 bg-ink/60 border border-paper/10">
            <span className="w-9 h-9 rounded-full bg-brass text-ink font-display font-bold flex items-center justify-center">A</span>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">Atelier Admin</div>
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-paper/35">Root key</div>
            </div>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0">
        {/* topbar */}
        <header className="sticky top-0 z-30 bg-ink/90 backdrop-blur border-b border-paper/10">
          <div className="flex items-center gap-4 px-5 md:px-8 py-4">
            <div className="min-w-0">
              <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-brass">Back of house</div>
              <h1 className="font-display font-extrabold text-xl md:text-2xl truncate">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2.5 border border-paper/15 bg-coal/60 px-3.5 py-2.5 focus-within:border-brass transition-colors">
                <SearchIcon className="w-4 h-4 text-paper/35" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the ledger…"
                  className="bg-transparent text-sm w-40 focus:outline-none placeholder:text-paper/30"
                />
              </div>
              <span className="hidden xl:block font-mono text-[11px] tabular-nums text-paper/50 border border-paper/12 px-3 py-2.5">
                GVA {clock}
              </span>
              <button
                data-cursor
                onClick={() => pushToast("3 seals awaiting review", "Daniel Okafor ordered the Falcon X.")}
                className="relative w-10 h-10 border border-paper/15 flex items-center justify-center text-paper/60 hover:text-brass hover:border-brass/50 transition-all duration-300"
                aria-label="Notifications"
              >
                <BellIcon className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rust rounded-full" />
              </button>
            </div>
          </div>
          {/* mobile tabs */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar border-t border-paper/8 px-3 gap-1.5 py-2.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                data-cursor
                onClick={() => setTab(t.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 font-mono text-[10px] tracking-[0.16em] uppercase border transition-all ${
                  tab === t.id ? "bg-brass text-ink border-brass" : "border-paper/15 text-paper/50"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-5 md:p-8 max-w-[90rem]">
          {tab === "overview" && <OverviewTab dash={dash} />}
          {tab === "orders" && <OrdersTab dash={dash} search={search} onStatus={onStatus} />}
          {tab === "products" && <ProductsTab dash={dash} search={search} onStock={onStock} onToggle={onToggleProduct} />}
          {tab === "catalog" && <CatalogTab />}
          {tab === "customers" && <CustomersTab dash={dash} />}
          {tab === "promos" && <PromosTab dash={dash} onToggle={onTogglePromo} onMint={onMint} />}
          {tab === "homepage" && <HomepageTab />}
          {tab === "branding" && <BrandingTab />}
          {tab === "shipping" && <ShippingTab />}
          {tab === "settings" && <SettingsTab settings={settings} onSave={onSaveSettings} onReset={onReset} />}
        </main>

        <footer className="px-5 md:px-8 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/8 pt-5 font-mono text-[9px] tracking-[0.22em] uppercase text-paper/30">
            <span>AURION Console · demo ledger</span>
            <span className="flex items-center gap-2">
              <DiamondIcon className="w-2 h-2 text-brass" /> All changes persist locally
            </span>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
