import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { getOrder } from "../store/orders";
import { formatPrice } from "../data/products";
import { ArrowRight, PackageIcon, ShieldIcon, TagIcon, TruckIcon } from "../components/Icons";
import { useCart } from "../store/CartContext";

const TIMELINE = [
  { label: "Order received", note: "Entered in the register" },
  { label: "Sealed at atelier", note: "Serial engraved & lacquered" },
  { label: "With the courier", note: "Insured, white gloves on" },
  { label: "Delivered", note: "Signature & a small bow" },
];

function AnimatedSeal() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <span className="absolute -inset-4 border border-brass/40 animate-spin-slow" />
      <span className="absolute -inset-9 border border-brass/20 animate-spin-rev" />
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#c9a24b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="277"
          style={{ strokeDashoffset: 277, animation: "seal-draw 1s ease forwards 0.2s" }}
        />
        <motion.path
          d="M32 51 45 64 69 38"
          fill="none"
          stroke="#171510"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          initial={{ strokeDashoffset: 60 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
        />
      </svg>
      <style>{`@keyframes seal-draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const order = useMemo(() => (id ? getOrder(id) : undefined), [id]);
  const { pushToast } = useCart();
  const reduce = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!order) return;
    const t = window.setTimeout(() => setActiveStep(1), 1600);
    return () => window.clearTimeout(t);
  }, [order]);

  useEffect(() => {
    if (!order || reduce) return;
    const colors = ["#c9a24b", "#e9cd8b", "#97721d", "#171510"];
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.35 }, colors, scalar: 0.9 });
    const t = window.setTimeout(
      () => confetti({ particleCount: 50, spread: 100, origin: { y: 0.3 }, colors, scalar: 0.7 }),
      350
    );
    return () => window.clearTimeout(t);
  }, [order, reduce]);

  if (!order) return <Navigate to="/shop" replace />;

  const d = new Date(order.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <AnimatedSeal />
          <div className="mt-10 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">Order registered</div>
          <h1 className="mt-4 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-7xl">
            The seal <span className="italic font-medium text-gold">is set.</span>
          </h1>
          <p className="mt-5 max-w-md mx-auto text-mist leading-relaxed">
            Your objets are being engraved at the atelier. A letter of confirmation is on
            its way to <span className="text-ink font-medium">{order.email}</span>.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 border-2 border-ink bg-bone/60 px-6 py-3">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Serial</span>
            <motion.span
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display font-bold text-xl tracking-[0.1em]"
            >
              {order.id}
            </motion.span>
          </div>
        </motion.div>

        {/* timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-14 border-2 border-ink bg-paper p-6 md:p-8"
        >
          <div className="grid grid-cols-4 gap-2">
            {TIMELINE.map((t, i) => {
              const done = i <= activeStep;
              return (
                <div key={t.label} className="relative text-center">
                  {i > 0 && (
                    <span className="absolute top-4 right-1/2 w-full h-[2px] bg-ink/10 -z-0">
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-brass"
                        initial={{ width: 0 }}
                        animate={{ width: done ? "100%" : 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.25 }}
                      />
                    </span>
                  )}
                  <motion.span
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.25 }}
                    className={`relative z-10 inline-flex w-8 h-8 border-2 items-center justify-center transition-colors duration-500 ${
                      done ? "bg-brass border-ink" : "bg-paper border-ink/25"
                    }`}
                  >
                    {i === 0 ? <PackageIcon className="w-3.5 h-3.5" /> : i === 3 ? <TruckIcon className="w-3.5 h-3.5" /> : <ShieldIcon className="w-3.5 h-3.5" />}
                  </motion.span>
                  <div className={`mt-3 font-mono text-[9px] tracking-[0.16em] uppercase leading-relaxed ${done ? "text-ink" : "text-mist/60"}`}>
                    {t.label}
                    <span className="block text-mist/70 normal-case tracking-normal font-body text-[10px] mt-0.5">{t.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* receipt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 border-2 border-ink bg-paper"
        >
          <div className="px-6 md:px-8 py-5 border-b-2 border-ink flex flex-wrap items-center justify-between gap-3">
            <span className="font-display font-extrabold text-xl">The receipt.</span>
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-mist">
              {d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} — {order.shippingMethod}
            </span>
          </div>
          <ul className="divide-y divide-ink/10">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center gap-4 px-6 md:px-8 py-4">
                <span className="w-14 h-14 plate-dark border border-ink/20 p-1 shrink-0">
                  <img src={it.img} alt={it.name} className="blend-lighten w-full h-full object-contain" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{it.name}</div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-mist">{it.category} · ×{it.qty}</div>
                </div>
                <span className="tabular-nums">{formatPrice(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="px-6 md:px-8 py-5 border-t-2 border-ink bg-bone/60 space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-mist">Subtotal</span><span className="tabular-nums">{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gold font-medium">
                <span className="flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" />{order.promoCode}</span>
                <span className="tabular-nums">−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-mist">Delivery</span><span className="tabular-nums">{order.shippingCost === 0 ? "Complimentary" : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between items-baseline border-t-2 border-ink pt-3">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase">Total paid</span>
              <span className="font-display font-extrabold text-3xl tabular-nums">{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-mist pt-1">{order.address}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            data-cursor
            onClick={() => pushToast("Ledger saved", "Find this order under Profile — Orders.")}
            className="border-2 border-ink px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-paper transition-all duration-300"
          >
            Note the serial
          </button>
          <Link
            to="/shop"
            data-cursor
            className="group btn-sheen bg-ink text-paper px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center gap-3"
          >
            Continue collecting <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
