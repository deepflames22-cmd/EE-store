import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  LIFESTYLE_IMG,
  MARQUEE_ITEMS,
  PRODUCTS,
  CATEGORIES,
  TESTIMONIALS,
  formatPrice,
  type Product,
} from "../data/products";
import { ArrowRight, ArrowUpRight, PlayIcon, PlusIcon } from "../components/Icons";
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
        {/* left: type */}
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

        {/* right: object on dark plate */}
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
                  {/* floating spec chips */}
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

/* ---------- product rail ---------- */

function ProductRail() {
  const { add } = useCart();
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => railRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="py-24 border-t-2 border-ink bg-bone/50">
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
        {product.tag && (
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
          <div className="text-sm text-mist tabular-nums">{formatPrice(product.price)}</div>
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

/* ---------- disciplines index ---------- */

function Disciplines() {
  const navigate = useNavigate();
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
        />
        <div className="mt-12 border-t-2 border-ink">
          {CATEGORIES.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c).length;
            const first = PRODUCTS.find((p) => p.category === c);
            return (
              <Reveal key={c} delay={i * 0.06} y={24}>
                <button
                  data-cursor
                  onClick={() => navigate("/shop", { state: { cat: c } })}
                  className="group relative w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_auto_auto] items-center gap-5 md:gap-8 border-b-2 border-ink py-6 px-2 text-left overflow-hidden"
                >
                  <span className="absolute inset-0 bg-ink translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative font-mono text-sm text-gold transition-colors duration-300">0{i + 1}</span>
                  <span className="relative font-display font-extrabold text-3xl md:text-5xl tracking-tight text-ink transition-colors duration-300 group-hover:text-paper">
                    {c}
                  </span>
                  {first && (
                    <span className="relative hidden md:block w-16 h-16 plate-dark border border-ink/20 p-1.5 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400">
                      <img src={first.img} alt="" className="blend-lighten w-full h-full object-contain" />
                    </span>
                  )}
                  <span className="relative flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist transition-colors duration-300 group-hover:text-brass">
                      {count} objets
                    </span>
                    <ArrowUpRight className="w-6 h-6 text-ink transition-all duration-300 group-hover:text-brass group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
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
      className={`py-12 px-6 text-center lg:text-left border-paper/15 ${last ? "" : "lg:border-r"} ${
        STATS.indexOf(STATS.find((x) => x.label === label)!) % 2 === 0 ? "border-r" : ""
      } lg:border-b-0 border-b`}
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
            index="04"
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
                  <span className="font-display font-bold text-xl text-ink">Welcome to the list.</span>
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
      <ProductRail />
      <Disciplines />
      <Craft />
      <StatsBand />
      <Voices />
      <PrivateList />
    </motion.div>
  );
}
