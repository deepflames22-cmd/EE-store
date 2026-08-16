import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS } from "../data/products";
import { ArrowRight, BoltIcon, GemIcon, PlayIcon, ShieldIcon, TruckIcon } from "./Icons";
import { scrollToId } from "./Nav";

const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 61) % 100}%`,
  top: `${28 + ((i * 37) % 62)}%`,
  delay: `${(i * 0.9) % 11}s`,
  dur: `${9 + (i % 5) * 2}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

const lineMask = {
  hidden: { y: "112%" },
  show: (i: number) => ({
    y: 0,
    transition: { delay: 0.25 + i * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const hero = PRODUCTS[0];

  const onMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -11, y: px * 15 });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden plate-bg"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* ambient layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[8%] w-[46rem] h-[46rem] rounded-full bg-gold/10 blur-[130px] animate-glow" />
        <div className="absolute -left-40 bottom-0 w-[30rem] h-[30rem] rounded-full bg-golddeep/15 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,162,75,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,75,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(70% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, black, transparent)",
          }}
        />
        {DUST.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-goldlight/80 animate-dust"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
              animationDuration: d.dur,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      <div className="relative flex-1 mx-auto max-w-7xl w-full px-6 grid lg:grid-cols-12 gap-10 items-center pt-32 lg:pt-24 pb-16">
        {/* copy */}
        <div className="lg:col-span-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex items-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
          >
            <span className="w-10 h-px bg-gold/70" />
            The Gilded Run — MMXXVI
          </motion.div>

          <h1 className="mt-6 font-display font-medium text-ivory leading-[1.02] text-[clamp(2.7rem,7vw,5.6rem)]">
            <span className="block overflow-hidden">
              <motion.span className="block" custom={0} variants={lineMask} initial="hidden" animate="show">
                ELECTRONICS,
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" custom={1} variants={lineMask} initial="hidden" animate="show">
                ELEVATED <span className="font-accent italic font-normal text-gold lowercase tracking-normal">to</span>
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block gold-shimmer" custom={2} variants={lineMask} initial="hidden" animate="show">
                OBJETS D'ART
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-7 max-w-md text-fog font-light text-lg leading-relaxed"
          >
            A maison of electronic instruments — headphones, timepieces and imaging tools
            machined in small runs and finished in champagne gold.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <button
              data-cursor
              onClick={() => scrollToId("collection")}
              className="btn-sheen group bg-gold text-ink px-8 py-4 text-[12px] tracking-[0.28em] uppercase font-medium hover:bg-goldlight transition-colors duration-300 flex items-center gap-3"
            >
              Explore the Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <button
              data-cursor
              onClick={() => scrollToId("showcase")}
              className="group flex items-center gap-3 text-ivory text-[12px] tracking-[0.28em] uppercase"
            >
              <span className="w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-all duration-300 group-hover:scale-105">
                <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
              </span>
              The 360° Salon
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.24em] uppercase text-fog"
          >
            <span className="flex items-center gap-2.5"><TruckIcon className="w-4 h-4 text-gold" /> Global delivery</span>
            <span className="flex items-center gap-2.5"><ShieldIcon className="w-4 h-4 text-gold" /> 24-month warranty</span>
            <span className="flex items-center gap-2.5"><GemIcon className="w-4 h-4 text-gold" /> 24k detailing</span>
          </motion.div>
        </div>

        {/* 3D product stage */}
        <div ref={stageRef} className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] lg:min-h-[620px]" style={{ perspective: "1200px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[min(78vw,460px)] aspect-square"
          >
            {/* orbiting text ring */}
            <svg viewBox="0 0 220 220" className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] animate-spin-slow text-gold/80" aria-hidden>
              <defs>
                <path id="orbit" d="M110,110 m-96,0 a96,96 0 1,1 192,0 a96,96 0 1,1 -192,0" />
              </defs>
              <text fontSize="10.5" letterSpacing="4.5" fill="currentColor" fontFamily="Jost, sans-serif">
                <textPath href="#orbit">
                  AURION · MAISON D'ÉLECTRONIQUE · EST. MMXIX · HAND-FINISHED ·
                </textPath>
              </text>
            </svg>
            <svg viewBox="0 0 220 220" className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] animate-spin-rev" aria-hidden>
              <circle cx="110" cy="110" r="104" fill="none" stroke="rgba(201,162,75,0.28)" strokeWidth="0.6" strokeDasharray="2 7" />
            </svg>

            {/* glow + product with tilt */}
            <div
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.25s ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute w-3/4 h-3/4 rounded-full bg-gold/20 blur-[80px] animate-glow" />
              <div className="animate-float relative w-full h-full">
                <img
                  src={hero.img}
                  alt={hero.name}
                  className="w-full h-full object-contain blend-lighten drop-shadow-[0_30px_60px_rgba(201,162,75,0.25)]"
                  style={{ transform: "translateZ(40px)" }}
                  draggable={false}
                />
              </div>
              {/* floating spec chips */}
              <div
                className="absolute top-[12%] -left-4 md:left-0 border border-gold/30 bg-ink/80 backdrop-blur px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase text-goldlight"
                style={{ transform: `translate3d(${tilt.y * 1.4}px, ${tilt.x * -1.2}px, 70px)` }}
              >
                <span className="text-gold mr-2">◆</span> 40h Reserve
              </div>
              <div
                className="absolute bottom-[20%] -right-2 md:right-0 border border-gold/30 bg-ink/80 backdrop-blur px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase text-goldlight flex items-center gap-2"
                style={{ transform: `translate3d(${tilt.y * -1.6}px, ${tilt.x * 1.4}px, 70px)` }}
              >
                <BoltIcon className="w-3.5 h-3.5 text-gold" /> Hi-Res 24/192
              </div>
              <div
                className="absolute top-[46%] -right-3 md:-right-8 border border-gold/30 bg-ink/80 backdrop-blur px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase text-goldlight"
                style={{ transform: `translate3d(${tilt.y * 1.1}px, ${tilt.x * 1.8}px, 90px)` }}
              >
                <span className="text-gold mr-2">◆</span> Adaptive ANC
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="relative mx-auto max-w-7xl w-full px-6 pb-8 flex items-end justify-between">
        <motion.button
          data-cursor
          onClick={() => scrollToId("collection")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-fog hover:text-goldlight transition-colors"
        >
          <span className="relative block w-px h-14 bg-gold/25 overflow-hidden">
            <motion.span
              className="absolute left-0 top-0 w-px h-5 bg-gold"
              animate={{ y: ["-1.25rem", "3.5rem"] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            />
          </span>
          Descend
        </motion.button>
        <div className="hidden md:block text-right text-[10px] tracking-[0.35em] uppercase text-dim">
          № 001 — Aurion One
          <div className="text-fog mt-1">$549 · Champagne Gold</div>
        </div>
      </div>
    </section>
  );
}
