import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PRODUCTS, formatPrice, type Product } from "../data/products";
import { ArrowRight, RotateIcon } from "./Icons";
import { useInView } from "../hooks/useInView";

export default function Showcase({ onAdd }: { onAdd: (p: Product) => void }) {
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);
  const [angle, setAngle] = useState(-18);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  const active = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0];

  // idle auto-rotation
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const loop = () => {
      if (!dragging.current) setAngle((a) => a + 0.18);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setAngle((a) => a + dx * 0.55);
  };
  const stop = () => {
    dragging.current = false;
  };

  const shown = ((Math.round(angle) % 360) + 360) % 360;

  return (
    <section id="showcase" className="relative py-28 overflow-hidden scroll-mt-24 bg-coal/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] h-[52rem] rounded-full bg-gold/[0.07] blur-[130px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(201,162,75,0.14) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(60% 55% at 50% 50%, black, transparent)",
            WebkitMaskImage: "radial-gradient(60% 55% at 50% 50%, black, transparent)",
          }}
        />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-14 items-center">
        {/* copy column */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
          >
            <span className="w-10 h-px bg-gold/70" /> Chapter II
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 font-display text-4xl md:text-6xl text-ivory"
          >
            The 360° <span className="font-accent italic font-normal text-gold">Salon</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 max-w-md text-fog font-light leading-relaxed"
          >
            Turn the objet yourself. Drag across the pedestal to inspect every chamfer,
            grille and gold-plated seam before it ships to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 border border-gold/15 bg-ink/70 p-7"
          >
            <div key={active.id} className="animate-[badge-pop_0.5s_ease]">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl text-goldlight">{active.name}</h3>
                <span className="text-gold font-medium">{formatPrice(active.price)}</span>
              </div>
              <p className="mt-2 text-sm text-fog font-light leading-relaxed">{active.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.specs.map((s) => (
                  <span key={s} className="text-[10px] tracking-[0.16em] uppercase text-goldlight/80 border border-gold/20 px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>
              <button
                data-cursor
                onClick={() => onAdd(active)}
                className="btn-sheen group mt-6 w-full bg-gold text-ink py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-goldlight transition-colors duration-300 flex items-center justify-center gap-3"
              >
                Add to Cart — {formatPrice(active.price)}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </motion.div>

          {/* thumbnails */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                data-cursor
                onClick={() => setActiveId(p.id)}
                aria-label={`View ${p.name}`}
                className={`relative w-16 h-16 border p-1.5 transition-all duration-300 bg-ink ${
                  p.id === activeId
                    ? "border-gold shadow-[0_0_24px_rgba(201,162,75,0.35)] scale-105"
                    : "border-gold/15 opacity-60 hover:opacity-100 hover:border-gold/50"
                }`}
              >
                <img src={p.img} alt="" className="blend-lighten w-full h-full object-contain" draggable={false} />
              </button>
            ))}
          </motion.div>
        </div>

        {/* turntable column */}
        <div className="order-1 lg:order-2 relative">
          <div
            data-cursor
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stop}
            onPointerLeave={stop}
            className="relative mx-auto w-[min(86vw,500px)] aspect-square select-none touch-none cursor-grab active:cursor-grabbing"
            style={{ perspective: "1100px" }}
          >
            {/* rotating dashed ring */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow text-gold/40" aria-hidden>
              <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 6" />
            </svg>

            <div
              className="absolute inset-6 will-change-transform"
              style={{ transform: `rotateY(${angle}deg)`, transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-2/3 h-2/3 rounded-full bg-gold/15 blur-[70px]" />
                <img
                  key={active.id}
                  src={active.img}
                  alt={active.name}
                  draggable={false}
                  className="relative w-[88%] h-[88%] object-contain blend-lighten drop-shadow-[0_24px_50px_rgba(201,162,75,0.28)]"
                />
              </div>
            </div>

            {/* pedestal */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%]">
              <div className="mx-auto h-4 rounded-[100%] bg-gold/25 blur-md" />
              <div className="mx-auto -mt-3 h-8 rounded-[100%] border border-gold/30 bg-gradient-to-b from-gold/10 to-transparent" />
            </div>

            {/* reflection */}
            <div
              className="absolute inset-6 opacity-25 pointer-events-none"
              style={{
                transform: "scaleY(-1) translateY(72%)",
                maskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 40%)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 40%)",
              }}
            >
              <img src={active.img} alt="" className="w-full h-full object-contain blend-lighten blur-[2px]" draggable={false} />
            </div>

            {/* readout */}
            <div className="absolute top-2 right-2 text-right text-[10px] tracking-[0.3em] uppercase text-dim tabular-nums">
              <div className="text-gold">{shown}°</div>
              <div className="mt-1">Rotation</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2.5 text-[11px] tracking-[0.3em] uppercase text-fog">
            <RotateIcon className="w-4 h-4 text-gold" />
            Drag to rotate the objet
          </div>
        </div>
      </div>
    </section>
  );
}
