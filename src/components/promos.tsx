import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  COUPONS,
  PRODUCTS,
  WHEEL_PRIZES,
  formatPrice,
  type Product,
} from "../data/products";
import { ArrowRight, CheckIcon, DiamondIcon, PlusIcon, TimerIcon } from "./Icons";
import { Reveal, SectionHead } from "./shared";
import { useCart } from "../store/CartContext";
import { claimCode, getClaimedCodes } from "../store/coupons";

/* ================= banner carousel ================= */

const SLIDES = [
  {
    bg: "bg-ink text-paper",
    kicker: "Run 07 is boarding",
    title: "Ten percent, while the counter runs.",
    sub: "Every objet in the run — one code, no asterisks.",
    cta: "Enter the shop",
    to: "/shop",
    img: PRODUCTS[0].img,
    code: "GILD10",
  },
  {
    bg: "bg-brass text-ink",
    kicker: "White-glove service",
    title: "Free hand-carried delivery over $500.",
    sub: "Insured to the door, gloves on, packaging reclaimed.",
    cta: "Build your vault",
    to: "/cart",
    img: PRODUCTS[3].img,
    code: null,
  },
  {
    bg: "plate-pine text-paper",
    kicker: "Gold exchange",
    title: "Trade a retired objet at book value.",
    sub: "Every serial we ever issued can come home.",
    cta: "How it works",
    to: "/maison",
    img: PRODUCTS[1].img,
    code: null,
  },
];

export function PromoCarousel() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5200);
    return () => window.clearInterval(t);
  }, [reduce]);

  return (
    <section className="mx-auto max-w-[88rem] px-5 md:px-8 pt-6">
      <Reveal y={28}>
        <div className="relative border-2 border-ink overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {SLIDES.map((s, idx) => (
              <div key={s.kicker} className={`w-full shrink-0 ${s.bg}`}>
                <div className="grid md:grid-cols-[1.25fr_0.75fr] items-center">
                  <div className="px-7 md:px-14 py-10 md:py-12">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase opacity-70">
                      <DiamondIcon className="w-2 h-2" /> {s.kicker}
                    </div>
                    <h2 className="mt-4 font-display font-extrabold tracking-tight leading-[0.95] text-3xl md:text-5xl max-w-xl">
                      {s.title}
                    </h2>
                    <p className="mt-3 max-w-md opacity-70 leading-relaxed">{s.sub}</p>
                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <Link
                        to={s.to}
                        data-cursor
                        className={`btn-sheen group px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase border-2 transition-colors duration-300 flex items-center gap-3 ${
                          idx === 1 ? "bg-ink text-paper border-ink hover:bg-coal" : "bg-brass text-ink border-brass hover:bg-goldlight"
                        }`}
                      >
                        {s.cta}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                      {s.code && (
                        <span className="font-display font-bold tracking-[0.14em] text-xl opacity-80">{s.code}</span>
                      )}
                    </div>
                  </div>
                  <div className="relative hidden md:flex items-center justify-center py-8 pr-10">
                    <img
                      src={s.img}
                      alt=""
                      className={`blend-lighten w-56 object-contain ${idx !== 1 ? "" : ""} animate-float`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* controls */}
          <div className="absolute bottom-4 left-7 md:left-14 flex items-center gap-2.5">
            {SLIDES.map((_, d) => (
              <button
                key={d}
                data-cursor
                onClick={() => setI(d)}
                aria-label={`Banner ${d + 1}`}
                className={`h-1.5 transition-all duration-400 ${d === i ? "w-10 bg-brass" : "w-4 bg-current opacity-25 hover:opacity-60"}`}
              />
            ))}
          </div>
          <div className="absolute bottom-3.5 right-5 flex gap-2">
            <button
              data-cursor
              onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)}
              aria-label="Previous banner"
              className="w-9 h-9 border-2 border-current flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              data-cursor
              onClick={() => setI((i + 1) % SLIDES.length)}
              aria-label="Next banner"
              className="w-9 h-9 border-2 border-current flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= coupon wall ================= */

export function CouponWall() {
  const [claimed, setClaimed] = useState<string[]>(() => getClaimedCodes());
  const { pushToast } = useCart();

  const claim = (code: string) => {
    setClaimed(claimCode(code));
    pushToast(`Coupon clipped — ${code}`, "Apply it in the vault ledger before checkout.");
  };

  return (
    <section className="py-24 border-t-2 border-ink bg-bone/40">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <SectionHead
          index="P1"
          kicker="Coupon Ledger"
          title={
            <>
              Clip them <span className="italic font-medium text-gold">before they vanish.</span>
            </>
          }
          right={
            <p className="max-w-xs text-sm text-mist leading-relaxed">
              Four standing offers this week. Clipped codes live in your vault and apply
              at checkout.
            </p>
          }
        />
        <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {COUPONS.map((c, i) => {
            const isClaimed = claimed.includes(c.code);
            return (
              <Reveal key={c.code} delay={i * 0.07} y={30}>
                <div className={`ticket group hover-lift ${isClaimed ? "opacity-90" : ""}`}>
                  <div className="flex items-stretch">
                    <div className="w-[38%] bg-ink text-brass flex flex-col items-center justify-center py-6 border-r-2 border-dashed border-ink">
                      <span className="font-display font-extrabold text-3xl leading-none">{c.pct}</span>
                      <span className="mt-2 font-mono text-[8px] tracking-[0.26em] uppercase text-paper/50">{c.code}</span>
                    </div>
                    <div className="flex-1 px-5 py-5 flex flex-col">
                      <h3 className="font-display font-bold text-lg leading-tight">{c.title}</h3>
                      <p className="mt-1 text-xs text-mist">{c.note}</p>
                      <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust flex items-center gap-1.5">
                        <TimerIcon className="w-3.5 h-3.5" /> {c.expiry}
                      </p>
                      <button
                        data-cursor
                        onClick={() => !isClaimed && claim(c.code)}
                        disabled={isClaimed}
                        className={`mt-4 w-full py-2.5 font-mono text-[10px] tracking-[0.22em] uppercase border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                          isClaimed
                            ? "bg-pine text-paper border-pine"
                            : "border-ink hover:bg-brass hover:border-brass"
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5" /> Clipped
                          </>
                        ) : (
                          "Claim coupon"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= flash drop strip ================= */

export function FlashDeals() {
  const { add } = useCart();
  const navigate = useNavigate();
  const deals = useMemo(() => PRODUCTS.filter((p) => p.was).slice(0, 3), []);
  const claimedPct = [78, 64, 86];

  const target = useMemo(() => Date.now() + 3 * 3600000 + 21 * 60000, []);
  const [left, setLeft] = useState(target - Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setLeft(Math.max(target - Date.now(), 0)), 1000);
    return () => window.clearInterval(t);
  }, [target]);
  const hh = String(Math.floor(left / 3600000)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

  return (
    <section className="py-24 bg-ink text-paper border-y-2 border-ink overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass">
                <span className="w-2 h-2 bg-rust rounded-full animate-deal-pulse" /> Flash drop — P2
              </div>
              <h2 className="mt-4 font-display font-extrabold tracking-tight leading-[0.95] text-4xl md:text-6xl">
                Gone <span className="italic font-medium text-brass">in hours.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 font-display font-bold text-2xl text-goldlight tabular-nums">
              <TimerIcon className="w-6 h-6 text-brass" />
              {hh}
              <span className="text-brass">:</span>
              {mm}
              <span className="text-brass">:</span>
              {ss}
              <span className="ml-2 font-mono text-[9px] tracking-[0.22em] uppercase text-paper/40 font-body font-normal">until prices reset</span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {deals.map((p, i) => (
            <FlashCard key={p.id} product={p} claimed={claimedPct[i]} onAdd={() => add(p)} onView={() => navigate(`/product/${p.id}`)} delay={i * 0.09} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashCard({
  product,
  claimed,
  onAdd,
  onView,
  delay,
}: {
  product: Product;
  claimed: number;
  onAdd: () => void;
  onView: () => void;
  delay: number;
}) {
  const pct = Math.round((1 - product.price / (product.was ?? product.price)) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group border-2 border-paper/15 hover:border-brass transition-colors duration-300 bg-coal/60"
    >
      <button data-cursor onClick={onView} className="relative block w-full plate-dark px-8 pt-9 pb-5" aria-label={`View ${product.name}`}>
        <span className="absolute top-4 left-4 bg-rust text-paper font-display font-extrabold text-lg px-3 py-1 animate-deal-pulse">
          −{pct}%
        </span>
        <img
          src={product.img}
          alt={product.name}
          className="blend-lighten mx-auto h-44 object-contain transition-transform duration-700 group-hover:scale-107 group-hover:-rotate-1"
        />
      </button>
      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <button data-cursor onClick={onView} className="font-display font-bold text-xl hover:text-brass transition-colors">
            {product.name}
          </button>
          <span className="flex items-baseline gap-2 tabular-nums">
            <span className="text-goldlight font-bold">{formatPrice(product.price)}</span>
            <span className="text-paper/35 line-through text-sm">{formatPrice(product.was ?? 0)}</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-paper/50">
            <span>{claimed}% claimed</span>
            <span>{100 - claimed}% left</span>
          </div>
          <div className="mt-2 h-2 bg-paper/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rust to-brass"
              initial={{ width: 0 }}
              whileInView={{ width: `${claimed}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
        <button
          data-cursor
          onClick={onAdd}
          className="btn-sheen group/btn mt-5 w-full bg-brass text-ink py-3 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
        >
          <PlusIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:rotate-90" />
          Grab at flash price
        </button>
      </div>
    </motion.div>
  );
}

/* ================= just-for-you deal grid ================= */

export function DealGrid() {
  const { add } = useCart();
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <SectionHead
          index="P3"
          kicker="For Your Vault"
          title={
            <>
              Picked while <span className="italic font-medium text-gold">you looked.</span>
            </>
          }
          right={
            <Link
              to="/shop"
              data-cursor
              className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-ink hover:text-gold transition-colors"
            >
              The whole run <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          }
        />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group border-2 border-ink bg-paper hover-lift hover:border-gold"
            >
              <button data-cursor onClick={() => navigate(`/product/${p.id}`)} className="relative block w-full plate-dark overflow-hidden" aria-label={`View ${p.name}`}>
                {p.was ? (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-rust text-paper font-mono text-[9px] font-medium tracking-[0.14em] px-2 py-1">
                    −{Math.round((1 - p.price / p.was) * 100)}%
                  </span>
                ) : p.tag ? (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-brass text-ink font-mono text-[9px] font-medium tracking-[0.14em] px-2 py-1">
                    {p.tag}
                  </span>
                ) : null}
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="blend-lighten mx-auto h-32 md:h-40 object-contain px-6 py-6 transition-transform duration-700 group-hover:scale-108"
                />
              </button>
              <div className="px-4 py-3.5 flex items-center justify-between gap-2 border-t-2 border-ink">
                <div className="min-w-0">
                  <button data-cursor onClick={() => navigate(`/product/${p.id}`)} className="font-display font-bold text-sm md:text-base hover:text-gold transition-colors truncate block">
                    {p.name}
                  </button>
                  <div className="text-xs tabular-nums">
                    <span className="text-mist">{formatPrice(p.price)}</span>
                    {p.was && <span className="ml-1.5 text-mist/50 line-through">{formatPrice(p.was)}</span>}
                  </div>
                </div>
                <button
                  data-cursor
                  onClick={() => add(p)}
                  aria-label={`Add ${p.name} to cart`}
                  className="shrink-0 w-9 h-9 border-2 border-ink flex items-center justify-center hover:bg-brass hover:border-brass hover:rotate-90 transition-all duration-300"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
          <motion.button
            data-cursor
            onClick={() => navigate("/shop")}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6%" }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-dashed border-ink/30 min-h-[180px] flex flex-col items-center justify-center gap-3 hover:border-gold hover:bg-brass/10 transition-all duration-300 group"
          >
            <ArrowRight className="w-7 h-7 text-gold transition-transform duration-300 group-hover:translate-x-2" />
            <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist group-hover:text-ink">The full run</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

/* ================= spin-to-win wheel ================= */

const WHEEL_COLORS: Array<{ fill: string; text: string }> = [
  { fill: "#171510", text: "#e9cd8b" },
  { fill: "#c9a24b", text: "#171510" },
  { fill: "#24382c", text: "#e9cd8b" },
  { fill: "#97721d", text: "#f2efe7" },
  { fill: "#211e15", text: "#c9a24b" },
  { fill: "#e9cd8b", text: "#171510" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof WHEEL_PRIZES)[0] | null>(null);
  const { applyPromo, pushToast } = useCart();
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const center = idx * 60 + 30;
    const current = ((rotation % 360) + 360) % 360;
    const delta = ((360 - center - current) % 360 + 360) % 360;
    const target = rotation + 5 * 360 + delta;
    setRotation(target);
    timer.current = window.setTimeout(() => {
      setSpinning(false);
      const prize = WHEEL_PRIZES[idx];
      setResult(prize);
      if (prize.code) {
        claimCode(prize.code);
        applyPromo(prize.code);
        pushToast(`The wheel grants ${prize.label}`, `${prize.code} is applied to your vault.`);
      } else {
        pushToast("The house smiles", "Spin again — the wheel is generous tonight.");
      }
    }, 4400);
  };

  const N = WHEEL_PRIZES.length;

  return (
    <section className="py-24 border-t-2 border-ink bg-ink text-paper overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1 relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full bg-brass/10 blur-[90px]" />
          </div>
          <div className="relative" style={{ width: 340, height: 340 }}>
            {/* pointer */}
            <svg viewBox="0 0 40 34" className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" aria-hidden>
              <path d="M20 34 4 4h32L20 34Z" fill="#c9a24b" stroke="#171510" strokeWidth="2.5" />
            </svg>
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none",
              }}
            >
              {WHEEL_PRIZES.map((p, i) => {
                const a0 = i * (360 / N);
                const a1 = (i + 1) * (360 / N);
                const p0 = polar(100, 100, 98, a0);
                const p1 = polar(100, 100, 98, a1);
                const c = WHEEL_COLORS[i % WHEEL_COLORS.length];
                return (
                  <g key={p.label}>
                    <path d={`M100 100 L${p0.x} ${p0.y} A98 98 0 0 1 ${p1.x} ${p1.y} Z`} fill={c.fill} stroke="#171510" strokeWidth="1.5" />
                    <g transform={`rotate(${a0 + 360 / N / 2} 100 100)`}>
                      <text x="100" y="34" textAnchor="middle" fill={c.text} style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
                        {p.label}
                      </text>
                      <text x="100" y="47" textAnchor="middle" fill={c.text} opacity="0.65" style={{ fontSize: "6px", fontFamily: "IBM Plex Mono, monospace", letterSpacing: "0.5px" }}>
                        {p.sub}
                      </text>
                    </g>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="17" fill="#f2efe7" stroke="#171510" strokeWidth="2.5" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <DiamondIcon className="w-3.5 h-3.5 text-gold" />
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass">
              <span className="w-8 h-px bg-brass" /> House game — P4
            </div>
            <h2 className="mt-5 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-6xl">
              The gilded <span className="italic font-medium text-brass">spin.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-paper/55 leading-relaxed">
              One turn per visit. The wheel hands out ledger codes — up to twenty-five
              percent — and whatever it grants is already waiting in your vault.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-md">
              {WHEEL_PRIZES.filter((p) => p.code).map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-sm text-paper/70">
                  <DiamondIcon className="w-2 h-2 text-brass shrink-0" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase">{p.label}</span>
                  <span className="text-paper/40">· {p.sub}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <button
                data-cursor
                onClick={spin}
                disabled={spinning}
                className={`btn-sheen px-10 py-4 font-mono text-[11px] tracking-[0.26em] uppercase transition-all duration-300 flex items-center gap-3 ${
                  spinning ? "bg-coal text-paper/40 cursor-wait" : "bg-brass text-ink hover:bg-goldlight"
                }`}
              >
                {spinning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    The wheel decides…
                  </>
                ) : (
                  "Spin the wheel"
                )}
              </button>
              {result && !spinning && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-display font-bold text-xl ${result.code ? "text-goldlight" : "text-paper/50"}`}
                >
                  {result.code ? `You won ${result.label}` : "Almost — try again"}
                </motion.span>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
