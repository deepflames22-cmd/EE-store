import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { ordersFor, type Order } from "../store/orders";
import { formatPrice } from "../data/products";
import {
  ArrowRight,
  CheckIcon,
  ChevronDownIcon,
  LogoutIcon,
  PackageIcon,
  ShieldIcon,
  TagIcon,
} from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";

type Tab = "orders" | "account" | "preferences";

const STATUS_LABEL: Record<Order["status"], string> = {
  sealed: "Sealed at atelier",
  "in-transit": "In transit",
  delivered: "Delivered",
};

function OrderRow({ order, index }: { order: Order; index: number }) {
  const [open, setOpen] = useState(false);
  const d = new Date(order.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-2 border-ink bg-paper"
    >
      <button
        data-cursor
        onClick={() => setOpen((o) => !o)}
        className="w-full flex flex-wrap items-center gap-x-6 gap-y-2 px-5 md:px-7 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold tabular-nums">{order.id}</span>
        <span className="text-sm text-mist">
          {d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
        <span className="text-sm text-mist">
          {order.items.reduce((s, i) => s + i.qty, 0)} objets
        </span>
        <span className="ml-auto flex items-center gap-4">
          <span className={`font-mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border-2 ${
            order.status === "delivered" ? "border-pine text-pine" : "border-brass text-gold"
          }`}>
            {STATUS_LABEL[order.status]}
          </span>
          <span className="font-display font-bold text-lg tabular-nums">{formatPrice(order.total)}</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180 text-gold" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t-2 border-ink"
          >
            <div className="grid md:grid-cols-[1fr_260px]">
              <ul className="divide-y divide-ink/10">
                {order.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-4 px-5 md:px-7 py-4">
                    <span className="w-14 h-14 plate-dark border border-ink/20 p-1 shrink-0">
                      <img src={it.img} alt={it.name} className="blend-lighten w-full h-full object-contain" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${it.id}`} data-cursor className="font-display font-bold hover:text-gold transition-colors truncate block">
                        {it.name}
                      </Link>
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-mist">{it.category} · ×{it.qty}</span>
                    </div>
                    <span className="tabular-nums text-sm">{formatPrice(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t-2 md:border-t-0 md:border-l-2 border-ink bg-bone/60 px-6 py-5 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-mist">Subtotal</span><span className="tabular-nums">{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span className="flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" />{order.promoCode}</span>
                    <span className="tabular-nums">−{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-mist">Shipping</span><span className="tabular-nums">{order.shippingCost === 0 ? "Complimentary" : formatPrice(order.shippingCost)}</span></div>
                <div className="flex justify-between border-t-2 border-ink pt-2.5 font-display font-bold text-lg">
                  <span>Total</span><span className="tabular-nums">{formatPrice(order.total)}</span>
                </div>
                <p className="text-xs text-mist pt-2">{order.shippingMethod} — {order.address}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Profile() {
  const { user, memberNo, update, logout } = useAuth();
  const { pushToast } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("orders");
  const [name, setName] = useState(user?.name ?? "");
  const [prefs, setPrefs] = useState(user?.prefs ?? { newsletter: true, sms: false });
  const [refresh, setRefresh] = useState(0);

  const orders = useMemo(() => (user ? ordersFor(user.email) : []), [user, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <Navigate to="/auth?next=/profile" replace />;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joined = new Date(user.created).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const saveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      pushToast("A name is required", "At least two characters, if you please.");
      return;
    }
    update({ name: name.trim() });
    pushToast("Details updated", "The register has been amended.");
  };

  const savePref = (key: "newsletter" | "sms", value: boolean) => {
    const nextPrefs = { ...prefs, [key]: value };
    setPrefs(nextPrefs);
    update({ prefs: nextPrefs });
    pushToast("Preference noted", key === "newsletter" ? "The seasonal letter awaits." : "Quiet, as you wish.");
  };

  const doLogout = () => {
    logout();
    pushToast("The door is locked", "Until next time.");
    navigate("/");
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "orders", label: `Orders — ${orders.length}` },
    { id: "account", label: "Account" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        {/* header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
              <span className="w-2 h-2 bg-brass" /> Member № {memberNo} — since {joined}
            </motion.div>
            <LineMaskReveal
              className="mt-5 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-7xl"
              lines={[
                <>Bonjour,</>,
                <>
                  <span className="italic font-medium text-gold">{user.name.split(" ")[0]}.</span>
                </>,
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="flex items-center gap-5 border-2 border-ink bg-bone/60 p-5">
              <span className="w-16 h-16 bg-ink text-brass font-display font-extrabold text-2xl flex items-center justify-center shrink-0">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="font-display font-bold text-lg truncate">{user.name}</div>
                <div className="text-sm text-mist truncate">{user.email}</div>
              </div>
              <button
                data-cursor
                onClick={doLogout}
                className="ml-auto shrink-0 w-11 h-11 border-2 border-ink flex items-center justify-center hover:bg-rust hover:border-rust hover:text-paper transition-all duration-300"
                aria-label="Sign out"
              >
                <LogoutIcon className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* tabs */}
        <div className="mt-12 flex flex-wrap gap-2 border-b-2 border-ink pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              data-cursor
              onClick={() => setTab(t.id)}
              className={`relative px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase border-2 border-b-0 -mb-[2px] transition-all duration-300 ${
                tab === t.id ? "bg-ink text-paper border-ink" : "bg-transparent text-mist border-ink/20 hover:border-ink hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                {orders.length === 0 ? (
                  <div className="border-2 border-dashed border-ink/25 py-20 text-center">
                    <PackageIcon className="w-10 h-10 mx-auto text-gold" />
                    <h3 className="mt-5 font-display font-extrabold text-3xl">No serials yet.</h3>
                    <p className="mt-2 text-mist">Your orders and their service ledgers will appear here.</p>
                    <Link
                      to="/shop"
                      data-cursor
                      className="group mt-7 inline-flex items-center gap-3 bg-ink text-paper px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-coal transition-colors"
                    >
                      Begin the collection <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((o, i) => (
                      <OrderRow key={o.id} order={o} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === "account" && (
              <motion.div key="account" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="max-w-xl">
                <form onSubmit={saveAccount} className="border-2 border-ink bg-paper p-7 md:p-9 space-y-6">
                  <div>
                    <label htmlFor="p-name" className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Full name</label>
                    <input
                      id="p-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full bg-bone/50 border-2 border-ink/20 focus:border-ink px-4 py-3.5 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Email — engraved, immutable</label>
                    <input value={user.email} disabled className="mt-2 w-full bg-bone/30 border-2 border-ink/10 px-4 py-3.5 text-mist cursor-not-allowed" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-ink/15 bg-bone/50 p-4">
                      <div className="flex items-center gap-2 text-gold"><ShieldIcon className="w-4 h-4" /><span className="font-mono text-[9px] tracking-[0.2em] uppercase">Member №</span></div>
                      <div className="mt-1.5 font-display font-bold text-xl tabular-nums">{memberNo}</div>
                    </div>
                    <div className="border border-ink/15 bg-bone/50 p-4">
                      <div className="flex items-center gap-2 text-gold"><TagIcon className="w-4 h-4" /><span className="font-mono text-[9px] tracking-[0.2em] uppercase">Orders</span></div>
                      <div className="mt-1.5 font-display font-bold text-xl tabular-nums">{orders.length}</div>
                    </div>
                  </div>
                  <button data-cursor type="submit" className="btn-sheen group bg-ink text-paper px-8 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-coal transition-colors flex items-center gap-3">
                    Save amendments <CheckIcon className="w-4 h-4 text-brass group-hover:text-paper transition-colors" />
                  </button>
                </form>
              </motion.div>
            )}

            {tab === "preferences" && (
              <motion.div key="prefs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="max-w-xl space-y-4">
                {([
                  { key: "newsletter" as const, title: "The seasonal letter", desc: "One letter per run — first access and atelier invitations." },
                  { key: "sms" as const, title: "Courier whispers", desc: "A single message when your sealed box leaves Geneva." },
                ]).map((p) => (
                  <div key={p.key} className="border-2 border-ink bg-paper px-6 py-5 flex items-center justify-between gap-6">
                    <div>
                      <div className="font-display font-bold text-lg">{p.title}</div>
                      <p className="text-sm text-mist mt-1">{p.desc}</p>
                    </div>
                    <button
                      data-cursor
                      role="switch"
                      aria-checked={prefs[p.key]}
                      onClick={() => savePref(p.key, !prefs[p.key])}
                      className={`relative w-16 h-9 border-2 transition-colors duration-300 shrink-0 ${prefs[p.key] ? "bg-brass border-brass" : "bg-bone border-ink/25"}`}
                    >
                      <span
                        className={`absolute top-1 w-6 h-6 bg-ink transition-all duration-300 ${prefs[p.key] ? "left-[34px]" : "left-1"}`}
                      />
                    </button>
                  </div>
                ))}
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist pt-2">
                  Preferences save instantly to the register.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
