import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Category } from "../data/products";
import { CouponWall, DealGrid, FlashDeals, PromoCarousel, SpinWheel } from "../components/promos";
import {
  BUNDLE,
  CATEGORIES,
  LIFESTYLE_IMG,
  MARQUEE_ITEMS,
  PRODUCTS,
  TESTIMONIALS,
  formatPrice,
  type Product,
} from "../data/products";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  CopyIcon,
  DiamondIcon,
  GiftIcon,
  GlobeIcon,
  PlayIcon,
  PlusIcon,
  ShieldIcon,
  TagIcon,
  TimerIcon,
  TruckIcon,
} from "../components/Icons";
import { LineMaskReveal, Marquee, OrbitBadge, Reveal, SectionHead, TiltFrame } from "../components/shared";
import { useCart } from "../store/CartContext";
import { useCountUp, useInView } from "../hooks/useInView";

/* ---------- hero ---------- */

function Hero() {
  const hero = PRODUCTS[0];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section ref={ref} className="relative pt-28 md:pt-36 pb-14 overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-start">
        <motion.div style={{ y: yText }} className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold"
          >
            <span className="w-2 h-2 bg-brass" />
            Run 07 — Now boarding
            <span className="text-mist">/ 500 numbered pieces</span>
          </motion.div>

          <LineMaskReveal
            className="mt-6 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(3rem,9vw,8.5rem)] text-ink"
            lines={[
              <>Electronics,</>,
              <>
                dressed <span className="italic font-medium text-gold">in</span>
              </>,
              <>
                <span className="gold-shimmer">gold.</span>
              </>,
            ]}
          />

          <Reveal delay={0.5}>
            <p className="mt-8 max-w-md text-lg text-mist leading-relaxed">
              A maison of electronic objets — headphones, timepieces, drones — built in
              numbered runs and finished by hand in champagne gold.
            </p>
          </Reveal>

          <Reveal delay={0.62}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                data-cursor
                className="btn-sheen group bg-ink text-paper px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors duration-300 flex items-center gap-3"
              >
                Enter the Shop
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                to={`/product/${hero.id}`}
                data-cursor
                className="group border-2 border-ink px-8 py-[14px] font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-brass hover:border-brass transition-all duration-300 flex items-center gap-3"
              >
                <PlayIcon className="w-3.5 h-3.5 text-gold group-hover:text-ink transition-colors" />
                View in 360°
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.74}>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] tracking-[0.24em] uppercase text-mist">
              <span>As seen in — Monocle</span>
              <span>Dezeen</span>
              <span>Wired</span>
              <span>Hypebeast</span>
            </div>
          </Reveal>
        </motion.div>

        <div className="lg:col-span-5 relative">
          <Reveal delay={0.25} y={50}>
            <TiltFrame max={6} className="relative">
              <div className="relative plate-dark border-2 border-ink overflow-hidden">
                <motion.div style={{ y: yImg }} className="relative px-10 pt-14 pb-6">
                  <img
                    src={hero.img}
                    alt={hero.name}
                    draggable={false}
                    className="blend-lighten relative mx-auto w-[82%] animate-float drop-shadow-[0_30px_50px_rgba(201,162,75,0.25)]"
                  />
                  <span className="absolute top-10 left-5 font-mono text-[9px] tracking-[0.2em] uppercase text-goldlight border border-brass/40 px-2.5 py-1.5 bg-ink/60">
                    40h playback
                  </span>
                  <span className="absolute bottom-24 right-4 font-mono text-[9px] tracking-[0.2em] uppercase text-goldlight border border-brass/40 px-2.5 py-1.5 bg-ink/60">
                    24-bit / 192kHz
                  </span>
                </motion.div>
                <div className="flex items-center justify-between border-t border-paper/15 px-5 py-4">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-brass">№ 001 — 500</div>
                    <div className="font-display font-bold text-paper mt-1">
                      {hero.name} <span className="text-paper/50 font-body font-normal text-sm">— {formatPrice(hero.price)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${hero.id}`}
                    data-cursor
                    aria-label={`View ${hero.name}`}
                    className="w-11 h-11 border border-brass/50 text-brass flex items-center justify-center hover:bg-brass hover:text-ink transition-all duration-300 hover:rotate-45"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </TiltFrame>
          </Reveal>
          <div className="absolute -top-7 -right-3 md:-right-7 z-10">
            <OrbitBadge light size={110} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- promo countdown ---------- */

function FlipDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block overflow-hidden h-[1.2em] align-bottom">
      <motion.span
        key={value}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </span>
  );
}

function PromoCountdown() {
  const target = useMemo(() => Date.now() + 5 * 86400000 + 7 * 3600000 + 42 * 60000, []);
  const [left, setLeft] = useState(target - Date.now());
  const { pushToast } = useCart();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setLeft(Math.max(target - Date.now(), 0)), 1000);
    return () => window.clearInterval(t);
  }, [target]);

  const days = String(Math.floor(left / 86400000)).padStart(2, "0");
  const hours = String(Math.floor((left % 86400000) / 3600000)).padStart(2, "0");
  const mins = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText("GILD10");
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    pushToast("Code copied — GILD10", "Paste it in the vault ledger at checkout.");
    window.setTimeout(() => setCopied(false), 2000);
  };

  const cells: Array<[string, string]> = [
    [days, "Days"],
    [hours, "Hours"],
    [mins, "Minutes"],
    [secs, "Seconds"],
  ];

  return (
    <section className="relative plate-pine text-paper overflow-hidden border-y-2 border-ink">
      <div className="absolute -right-24 -top-24 opacity-40 pointer-events-none" aria-hidden>
        <OrbitBadge light size={320} text="TEN PERCENT • TEN PERCENT • TEN PERCENT • " />
      </div>
      <div className="relative mx-auto max-w-[88rem] px-5 md:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass">
              <TimerIcon className="w-4 h-4" /> Promotion — closing soon
            </div>
            <h2 className="mt-5 font-display font-extrabold tracking-tight leading-[0.95] text-4xl md:text-5xl">
              The gilded hours <span className="italic font-medium text-brass">are numbered.</span>
            </h2>
            <p className="mt-4 max-w-md text-paper/55 leading-relaxed">
              Take ten percent off everything in Run 07 while the counter runs. One code,
              every objet, no asterisks.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-4">
          <Reveal delay={0.12}>
            <div className="grid grid-cols-4 gap-3">
              {cells.map(([v, label], i) => (
                <div key={label} className="relative border-2 border-brass/40 bg-ink/50 py-5 text-center">
                  {i > 0 && <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 text-brass font-display font-bold hidden lg:block">:</span>}
                  <span className="font-display font-extrabold text-3xl md:text-4xl text-goldlight">
                    <FlipDigit value={v[0]} />
                    <FlipDigit value={v[1]} />
                  </span>
                  <span className="block mt-2 font-mono text-[9px] tracking-[0.22em] uppercase text-paper/45">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-3">
          <Reveal delay={0.2}>
            <div className="border-2 border-dashed border-brass/60 bg-ink/40 p-5 text-center">
              <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-paper/50">Your code</span>
              <div className="mt-2 font-display font-extrabold text-3xl tracking-[0.14em] text-brass">GILD10</div>
              <button
                data-cursor
                onClick={copyCode}
                className={`mt-4 w-full py-3 font-mono text-[10px] tracking-[0.24em] uppercase border-2 transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  copied
                    ? "bg-brass text-ink border-brass"
                    : "border-brass/60 text-brass hover:bg-brass hover:text-ink"
                }`}
              >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? "Copied" : "Copy code"}
              </button>
              <p className="mt-3 text-[11px] text-paper/45">Applies in the vault & at checkout.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- product rail ---------- */

function ProductRail() {
  const { add } = useCart();
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => railRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="py-24 bg-bone/50">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <SectionHead
          index="01"
          kicker="The Current Run"
          title={
            <>
              Seven objets, <span className="italic font-medium text-gold">one metal.</span>
            </>
          }
          right={
            <div className="flex gap-2">
              <button data-cursor onClick={() => scroll(-1)} aria-label="Scroll left" className="w-12 h-12 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-all duration-300">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button data-cursor onClick={() => scroll(1)} aria-label="Scroll right" className="w-12 h-12 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={railRef}
        className="mt-12 flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 md:px-[max(2rem,calc((100vw-88rem)/2+2rem))]"
      >
        {PRODUCTS.map((p, i) => (
          <RailCard key={p.id} product={p} index={i} onAdd={add} onView={() => navigate(`/product/${p.id}`)} />
        ))}
        <Link
          to="/shop"
          data-cursor
          className="snap-start shrink-0 w-[300px] md:w-[340px] border-2 border-dashed border-ink/30 flex flex-col items-center justify-center gap-4 hover:border-gold hover:bg-brass/10 transition-all duration-300 group"
        >
          <span className="font-display font-extrabold text-5xl text-outline-ink group-hover:text-gold transition-colors">+</span>
          <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-mist group-hover:text-ink">View all seven</span>
        </Link>
      </div>
    </section>
  );
}

function RailCard({
  product,
  index,
  onAdd,
  onView,
}: {
  product: Product;
  index: number;
  onAdd: (p: Product) => void;
  onView: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="snap-start shrink-0 w-[300px] md:w-[340px] group"
    >
      <div className="relative plate-dark border-2 border-ink overflow-hidden">
        <button data-cursor onClick={onView} className="block w-full px-8 pt-10 pb-4" aria-label={`View ${product.name}`}>
          <img
            src={product.img}
            alt={product.name}
            draggable={false}
            className="blend-lighten mx-auto h-52 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-hover:-rotate-2"
          />
        </button>
        <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2 py-1">
          №{String(index + 1).padStart(2, "0")}
        </span>
        {product.was && (
          <span className="absolute top-4 right-4 bg-rust text-paper font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium">
            Save {formatPrice(product.was - product.price)}
          </span>
        )}
        {!product.was && product.tag && (
          <span className="absolute top-4 right-4 bg-brass text-ink font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium">
            {product.tag}
          </span>
        )}
      </div>
      <div className="border-2 border-t-0 border-ink bg-paper px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold">{product.category}</div>
          <button data-cursor onClick={onView} className="font-display font-bold text-lg hover:text-gold transition-colors truncate">
            {product.name}
          </button>
          <div className="text-sm tabular-nums">
            <span className="text-mist">{formatPrice(product.price)}</span>
            {product.was && <span className="ml-2 text-mist/60 line-through">{formatPrice(product.was)}</span>}
          </div>
        </div>
        <button
          data-cursor
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to cart`}
          className="shrink-0 w-11 h-11 border-2 border-ink text-ink flex items-center justify-center hover:bg-brass hover:border-brass hover:rotate-90 transition-all duration-300"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- objet of the season ---------- */

function Spotlight() {
  const { add } = useCart();
  const obj = PRODUCTS.find((p) => p.id === "meridian-s") ?? PRODUCTS[1];
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yWord = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);

  return (
    <section ref={ref} className="relative bg-ink text-paper overflow-hidden border-y-2 border-ink">
      <motion.span
        style={{ y: yWord }}
        className="absolute top-6 left-0 font-display font-extrabold text-[18vw] leading-none text-outline-paper whitespace-nowrap select-none pointer-events-none"
        aria-hidden
      >
        MERIDIAN — MERIDIAN — MERIDIAN
      </motion.span>

      <div className="relative mx-auto max-w-[88rem] px-5 md:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal y={50}>
          <TiltFrame max={5}>
            <div className="relative border-2 border-brass/40 plate-dark p-8 md:p-12">
              <img
                src={obj.img}
                alt={obj.name}
                className="blend-lighten relative mx-auto w-[78%] animate-float drop-shadow-[0_30px_60px_rgba(201,162,75,0.3)]"
              />
              <span className="absolute top-5 left-5 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2.5 py-1.5">
                Objet of the season
              </span>
              <span className="absolute bottom-5 right-5 font-mono text-[9px] tracking-[0.24em] uppercase text-brass">
                № 118 — 500
              </span>
            </div>
          </TiltFrame>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass">
              <span className="w-8 h-px bg-brass" /> This week only
            </div>
            <h2 className="mt-5 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-7xl">
              {obj.name}
              <span className="text-brass">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-paper/55 text-lg leading-relaxed">{obj.blurb}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap items-baseline gap-4">
              <span className="font-display font-extrabold text-4xl text-goldlight tabular-nums">{formatPrice(obj.price)}</span>
              {obj.was && <span className="text-paper/40 line-through text-xl tabular-nums">{formatPrice(obj.was)}</span>}
              <span className="bg-rust text-paper font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1.5">
                −{formatPrice((obj.was ?? obj.price) - obj.price)} this week
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <ul className="mt-7 space-y-2.5">
              {obj.specs.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-paper/70">
                  <CheckIcon className="w-4 h-4 text-brass shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.34}>
            <div className="mt-9 flex flex-wrap gap-4">
              <button
                data-cursor
                onClick={() => add(obj)}
                className="btn-sheen group bg-brass text-ink px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-goldlight transition-colors flex items-center gap-3"
              >
                <PlusIcon className="w-4 h-4" /> Reserve № 118
              </button>
              <Link
                to={`/product/${obj.id}`}
                data-cursor
                className="group border-2 border-paper/30 px-8 py-[14px] font-mono text-[11px] tracking-[0.26em] uppercase hover:border-brass hover:text-brass transition-all duration-300 flex items-center gap-3"
              >
                Full details <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- disciplines index ---------- */

function Disciplines() {
  const navigate = useNavigate();
  const { add } = useCart();
  const [open, setOpen] = useState<Category | null>(null);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [blob, setBlob] = useState({ x: -9999, y: -9999 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const lastRipple = useRef(0);
  const idRef = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBlob({ x, y });
    if (reduce) return;
    const now = performance.now();
    if (now - lastRipple.current < 130) return;
    lastRipple.current = now;
    const id = ++idRef.current;
    setRipples((r) => [...r.slice(-6), { id, x, y }]);
    window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 1050);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <SectionHead
          index="02"
          kicker="Disciplines"
          title={
            <>
              Choose your <span className="italic font-medium text-gold">instrument.</span>
            </>
          }
          right={
            <p className="max-w-xs text-sm text-mist leading-relaxed">
              Move across the ledger — the water follows. Click a discipline to open its
              shelf.
            </p>
          }
        />
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setBlob({ x: -9999, y: -9999 })}
          className="mt-12 border-t-2 border-ink relative overflow-hidden"
        >
          <div className="water-blob" style={{ left: blob.x, top: blob.y }} aria-hidden />
          {ripples.map((r) => (
            <span key={`${r.id}-a`} className="ripple-ring" style={{ left: r.x, top: r.y }} aria-hidden>
              <span className="ripple-ring inner" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
            </span>
          ))}

          {CATEGORIES.map((c, i) => {
            const items = PRODUCTS.filter((p) => p.category === c);
            const isOpen = open === c;
            return (
              <div key={c} className="relative border-b-2 border-ink">
                <button
                  data-cursor
                  onClick={() => setOpen(isOpen ? null : c)}
                  aria-expanded={isOpen}
                  className="group relative w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[90px_1fr_auto_auto] items-center gap-4 md:gap-8 py-7 px-2 text-left"
                >
                  <span className={`font-mono text-sm transition-colors duration-300 ${isOpen ? "text-gold" : "text-mist group-hover:text-gold"}`}>
                    0{i + 1}
                  </span>
                  <span className={`font-display font-extrabold text-4xl md:text-6xl tracking-tight transition-all duration-400 ${isOpen ? "text-gold italic" : "text-ink group-hover:text-gold group-hover:translate-x-2"}`}>
                    {c}
                  </span>
                  <span className="relative hidden md:block w-20 h-20 plate-dark border-2 border-ink/20 group-hover:border-brass p-2 transition-all duration-400 group-hover:rotate-3 overflow-hidden">
                    <img
                      src={items[0]?.img}
                      alt=""
                      className="blend-lighten w-full h-full object-contain transition-transform duration-500 group-hover:scale-115"
                    />
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden sm:block font-mono text-[10px] tracking-[0.24em] uppercase text-mist">
                      {items.length} objets
                    </span>
                    <span
                      className={`w-11 h-11 border-2 flex items-center justify-center transition-all duration-400 ${
                        isOpen ? "bg-ink border-ink text-brass rotate-90" : "border-ink/25 text-ink group-hover:border-ink group-hover:border-brass group-hover:bg-brass group-hover:text-ink"
                      }`}
                    >
                      <ArrowRight className={`w-4 h-4 transition-transform duration-400 ${isOpen ? "rotate-90" : ""}`} />
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="shelf"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-9 pt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {items.map((p, pi) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 + pi * 0.07 }}
                            className="group/card border-2 border-ink bg-paper hover-lift hover:border-gold"
                          >
                            <button
                              data-cursor
                              onClick={() => navigate(`/product/${p.id}`)}
                              className="relative block w-full plate-dark overflow-hidden"
                              aria-label={`View ${p.name}`}
                            >
                              {p.was && (
                                <span className="absolute top-3 left-3 z-10 bg-rust text-paper font-mono text-[9px] font-medium tracking-[0.16em] px-2 py-1">
                                  −{Math.round((1 - p.price / p.was) * 100)}%
                                </span>
                              )}
                              {!p.was && p.tag && (
                                <span className="absolute top-3 left-3 z-10 bg-brass text-ink font-mono text-[9px] font-medium tracking-[0.16em] px-2 py-1">
                                  {p.tag}
                                </span>
                              )}
                              <img
                                src={p.img}
                                alt={p.name}
                                loading="lazy"
                                className="blend-lighten mx-auto h-48 md:h-56 object-contain px-8 py-8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-108 group-hover/card:-rotate-1"
                              />
                            </button>
                            <div className="px-5 py-4 flex items-center justify-between gap-3 border-t-2 border-ink">
                              <div className="min-w-0">
                                <button
                                  data-cursor
                                  onClick={() => navigate(`/product/${p.id}`)}
                                  className="font-display font-bold text-lg hover:text-gold transition-colors truncate block"
                                >
                                  {p.name}
                                </button>
                                <div className="text-sm tabular-nums">
                                  <span className="text-mist">{formatPrice(p.price)}</span>
                                  {p.was && <span className="ml-2 text-mist/50 line-through">{formatPrice(p.was)}</span>}
                                </div>
                              </div>
                              <button
                                data-cursor
                                onClick={() => add(p)}
                                aria-label={`Add ${p.name} to cart`}
                                className="shrink-0 w-11 h-11 border-2 border-ink flex items-center justify-center hover:bg-brass hover:border-brass hover:rotate-90 transition-all duration-300"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        <motion.button
                          data-cursor
                          onClick={() => navigate("/shop", { state: { cat: c } })}
                          initial={{ opacity: 0, y: 26 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.08 + items.length * 0.07 }}
                          className="border-2 border-dashed border-ink/30 min-h-[220px] flex flex-col items-center justify-center gap-3 hover:border-gold hover:bg-brass/10 transition-all duration-300 group/all"
                        >
                          <ArrowUpRight className="w-8 h-8 text-gold transition-transform duration-300 group-hover/all:translate-x-1.5 group-hover/all:-translate-y-1.5" />
                          <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist group-hover/all:text-ink">
                            All {c} in the shop
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- bundle ---------- */

function BundlePromo() {
  const { addMany, pushToast } = useCart();
  const items = BUNDLE.itemIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const full = items.reduce((s, p) => s + p.price, 0);
  const price = full - BUNDLE.save;

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <Reveal y={44}>
          <div className="relative bg-brass border-2 border-ink overflow-hidden">
            <span className="absolute -left-8 -bottom-20 font-display font-extrabold text-[14rem] leading-none text-ink/8 select-none" aria-hidden>
              SET
            </span>
            <div className="relative grid lg:grid-cols-12 gap-8 items-center px-6 md:px-12 py-12 md:py-14">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-ink/70">
                  <GiftIcon className="w-4 h-4" /> Bundle — {BUNDLE.note}
                </div>
                <h2 className="mt-4 font-display font-extrabold tracking-tight leading-[0.92] text-4xl md:text-6xl text-ink">
                  The Travel <span className="italic font-medium">Set.</span>
                </h2>
                <p className="mt-4 max-w-sm text-ink/70 leading-relaxed">
                  Headphones, earbuds and the column of sound — sealed in one lacquered
                  case, numbered as a set.
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-4">
                  <span className="font-display font-extrabold text-4xl text-ink tabular-nums">{formatPrice(price)}</span>
                  <span className="text-ink/45 line-through text-xl tabular-nums">{formatPrice(full)}</span>
                  <span className="bg-ink text-brass font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1.5">
                    Save {formatPrice(BUNDLE.save)}
                  </span>
                </div>
                <button
                  data-cursor
                  onClick={() => {
                    addMany(items);
                    pushToast(`${formatPrice(BUNDLE.save)} saved`, "The set travels as one serial.");
                  }}
                  className="btn-sheen group mt-7 bg-ink text-paper px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center gap-3"
                >
                  <GiftIcon className="w-4 h-4 text-brass group-hover:text-paper transition-colors" />
                  Add the whole set
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
              <div className="lg:col-span-7">
                <div className="flex items-center justify-center gap-0">
                  {items.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 40, rotate: i % 2 ? 6 : -6 }}
                      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 3 : -3 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className={`plate-dark border-2 border-ink p-5 w-36 md:w-48 hover-lift ${i === 1 ? "-mx-4 md:-mx-6 z-10 scale-105" : ""}`}
                    >
                      <img src={p.img} alt={p.name} className="blend-lighten w-full h-28 md:h-36 object-contain" />
                      <div className="mt-3 text-center font-mono text-[9px] tracking-[0.2em] uppercase text-goldlight">{p.name}</div>
                      <div className="text-center text-paper/50 text-xs tabular-nums mt-1">{formatPrice(p.price)}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- craft (sticky two-column) ---------- */

function Craft() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 70, reduce ? 0 : -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -50, reduce ? 0 : 60]);

  return (
    <section className="py-24 border-t-2 border-ink bg-ink text-paper overflow-hidden">
      <div ref={ref} className="mx-auto max-w-[88rem] px-5 md:px-8 grid lg:grid-cols-2 gap-14">
        <div className="lg:sticky lg:top-32 self-start">
          <SectionHead
            index="03"
            kicker="The Atelier"
            dark
            title={
              <>
                Machines, finished like <span className="italic font-medium text-brass">jewellery.</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-md text-paper/60 leading-relaxed">
              Every objet passes through eleven hands before it is sealed. Billet
              aluminium is machined, bead-blasted, then dressed in a 24-karat PVD coat
              the colour of late afternoon.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-9 space-y-4">
              {[
                ["24K PVD coat", "applied in a single pass, never painted"],
                ["Sapphire & brass", "glass that outlives the battery inside"],
                ["Numbered for life", "each serial engraved, registered, repairable"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-4 border-b border-paper/10 pb-4">
                  <span className="font-display font-bold text-goldlight shrink-0 w-44">{k}</span>
                  <span className="text-sm text-paper/50">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.35}>
            <Link
              to="/maison"
              data-cursor
              className="group mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-brass hover:text-goldlight transition-colors"
            >
              Inside the maison
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>

        <div className="space-y-8">
          <motion.div style={{ y: y1 }} className="relative border-2 border-brass/40 overflow-hidden">
            <div className="overflow-hidden">
              <img src={LIFESTYLE_IMG} alt="The AURION atelier at night" className="w-full aspect-[4/3] object-cover animate-kenburns" />
            </div>
            <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-paper bg-ink/80 border border-brass/30 px-3 py-1.5">
              Fig. 01 — Geneva atelier, 23:40
            </span>
          </motion.div>
          <motion.div style={{ y: y2 }} className="grid grid-cols-2 gap-8">
            {PRODUCTS.slice(1, 3).map((p, i) => (
              <div key={p.id} className="plate-dark border border-paper/15 p-6 group hover:border-brass/60 transition-colors duration-300">
                <img
                  src={p.img}
                  alt={p.name}
                  className="blend-lighten w-full h-36 object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="mt-4 font-mono text-[9px] tracking-[0.22em] uppercase text-paper/50">
                  Fig. 0{i + 2} — {p.name}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- house services ledger ---------- */

function ServicesLedger() {
  const rows = [
    { icon: <TruckIcon className="w-6 h-6" />, title: "White-glove delivery", note: "Insured, hand-carried, gloves on — complimentary above $500." },
    { icon: <ShieldIcon className="w-6 h-6" />, title: "Repair for life", note: "Every serial ever issued is serviced at the atelier, forever." },
    { icon: <TagIcon className="w-6 h-6" />, title: "30-day returns", note: "Change your mind; the serial is retired, never resold as new." },
    { icon: <GlobeIcon className="w-6 h-6" />, title: "Gold exchange", note: "Trade a retired objet toward the next run, at book value." },
  ];

  return (
    <section className="py-24 border-t-2 border-ink">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <SectionHead
          index="04"
          kicker="House Services"
          title={
            <>
              What the house <span className="italic font-medium text-gold">guarantees.</span>
            </>
          }
        />
        <div className="mt-12 border-t-2 border-ink">
          {rows.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05} y={20}>
              <div className="group relative grid grid-cols-[auto_auto_1fr] md:grid-cols-[80px_60px_1fr_auto] items-center gap-5 md:gap-8 border-b-2 border-ink py-6 px-2 overflow-hidden">
                <span className="absolute inset-0 bg-brass/15 translate-x-[-101%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                <span className="relative font-mono text-sm text-gold">0{i + 1}</span>
                <span className="relative text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">{r.icon}</span>
                <span className="relative flex flex-col md:flex-row md:items-baseline md:gap-6">
                  <span className="font-display font-bold text-xl md:text-2xl">{r.title}</span>
                  <span className="text-sm text-mist">{r.note}</span>
                </span>
                <DiamondIcon className="relative hidden md:block w-2.5 h-2.5 text-brass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- stats band ---------- */

const STATS = [
  { value: 38, suffix: "", decimals: 0, label: "Countries served" },
  { value: 120, suffix: "K", decimals: 0, label: "Objets in the wild" },
  { value: 4.9, suffix: "", decimals: 1, label: "Owner rating" },
  { value: 24, suffix: "mo", decimals: 0, label: "Global warranty" },
];

function StatsBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="plate-pine text-paper border-y-2 border-ink">
      <div ref={ref} className="mx-auto max-w-[88rem] px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatCell key={s.label} {...s} active={inView} delay={i * 0.1} last={i === STATS.length - 1} />
        ))}
      </div>
    </section>
  );
}

function StatCell({
  value,
  suffix,
  decimals,
  label,
  active,
  delay,
  last,
}: (typeof STATS)[0] & { active: boolean; delay: number; last: boolean }) {
  const v = useCountUp(value, active, 1800, decimals);
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={`py-12 px-6 text-center lg:text-left border-paper/15 ${last ? "" : "lg:border-r"} border-b lg:border-b-0`}
    >
      <div className="font-display font-extrabold text-4xl md:text-5xl text-goldlight tabular-nums">
        {decimals ? v.toFixed(decimals) : Math.round(v)}
        <span className="text-brass text-2xl md:text-3xl ml-1">{suffix}</span>
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.24em] uppercase text-paper/50">{label}</div>
    </motion.div>
  );
}

/* ---------- testimonials ---------- */

function Voices() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => window.clearInterval(t);
  }, [reduce]);

  const t = TESTIMONIALS[i];

  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-4">
          <SectionHead
            index="05"
            kicker="Voices"
            title={
              <>
                Owners, <span className="italic font-medium text-gold">quoted.</span>
              </>
            }
          />
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center gap-3">
              <button
                data-cursor
                onClick={() => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                aria-label="Previous quote"
                className="w-12 h-12 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                data-cursor
                onClick={() => setI((i + 1) % TESTIMONIALS.length)}
                aria-label="Next quote"
                className="w-12 h-12 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="ml-2 font-mono text-[11px] tracking-[0.24em] text-mist tabular-nums">
                0{i + 1} / 0{TESTIMONIALS.length}
              </span>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8 relative">
          <span className="absolute -top-14 -left-2 font-display font-extrabold text-[10rem] leading-none text-outline-ink select-none" aria-hidden>
            “
          </span>
          <div className="relative min-h-[220px] md:min-h-[190px]">
            <AnimateQuote key={i} quote={t.quote} name={t.name} role={t.role} />
          </div>
          <div className="mt-6 flex gap-2">
            {TESTIMONIALS.map((_, d) => (
              <button
                key={d}
                data-cursor
                onClick={() => setI(d)}
                aria-label={`Quote ${d + 1}`}
                className={`h-1.5 transition-all duration-400 ${d === i ? "w-10 bg-brass" : "w-4 bg-sand hover:bg-gold/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimateQuote({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <blockquote className="font-display font-bold text-2xl md:text-4xl leading-snug tracking-tight text-ink">
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <span className="w-10 h-px bg-brass" />
        <span className="font-medium">{name}</span>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist">{role}</span>
      </figcaption>
    </motion.figure>
  );
}

/* ---------- private list ---------- */

function PrivateList() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-brass border-2 border-ink px-6 md:px-14 py-14 md:py-16 overflow-hidden"
        >
          <span className="absolute -right-10 -top-16 font-display font-extrabold text-[16rem] leading-none text-ink/8 select-none" aria-hidden>
            07
          </span>
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-ink/70">The Private List</div>
              <h2 className="mt-4 font-display font-extrabold text-4xl md:text-5xl tracking-tight text-ink leading-[0.95]">
                First word on <span className="italic font-medium">Run 08.</span>
              </h2>
              <p className="mt-4 max-w-md text-ink/70 leading-relaxed">
                One letter per season — first access, atelier invitations and the
                occasional one-of-one auction. No noise.
              </p>
            </div>
            <div>
              {state === "done" ? (
                <div className="border-2 border-ink bg-paper px-8 py-6">
                  <span className="font-display font-bold text-xl text-ink flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-gold" /> Welcome to the list.
                  </span>
                  <p className="mt-1.5 text-sm text-mist">Your first letter ships with the next run — at golden hour.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className={`flex flex-col sm:flex-row border-2 bg-paper transition-colors ${state === "error" ? "border-rust" : "border-ink"}`}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="your@correspondence.com"
                      className="flex-1 bg-transparent px-6 py-4 text-ink placeholder:text-mist/70 focus:outline-none"
                      aria-label="Email address"
                    />
                    <button
                      data-cursor
                      type="submit"
                      className="btn-sheen group bg-ink text-paper px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center justify-center gap-3"
                    >
                      Request entry
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </div>
                  {state === "error" && (
                    <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-rust">Please present a valid address</p>
                  )}
                </form>
              )}
              <p className="mt-4 font-mono text-[10px] tracking-[0.22em] uppercase text-ink/50">4,208 members · unsubscribe in one click</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <PromoCarousel />
      <PromoCountdown />
      <CouponWall />
      <ProductRail />
      <FlashDeals />
      <Spotlight />
      <Disciplines />
      <DealGrid />
      <BundlePromo />
      <SpinWheel />
      <Craft />
      <ServicesLedger />
      <StatsBand />
      <Voices />
      <PrivateList />
    </motion.div>
  );
}
