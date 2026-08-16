import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES, PRODUCTS, formatPrice, type Product } from "../data/products";
import { ArrowUpRight, PlusIcon } from "./Icons";
import { useInView } from "../hooks/useInView";

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (py - 0.5) * -8, ry: (px - 0.5) * 10, gx: px * 100, gy: py * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0, gx: 50, gy: 50 })}
      className={className}
      style={{ perspective: "900px" }}
    >
      <div
        className="relative h-full will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: "transform 0.3s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
          style={{
            opacity: Math.abs(t.rx) + Math.abs(t.ry) > 0.5 ? 1 : 0,
            background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(236,217,160,0.14), transparent 55%)`,
          }}
        />
        {children}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
  onAdd,
  span,
}: {
  product: Product;
  index: number;
  onAdd: (p: Product) => void;
  span: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={span}
    >
      <TiltCard className="h-full">
        <div className="hover-lift group relative h-full flex flex-col border border-gold/12 bg-gradient-to-b from-coal to-ink hover:border-gold/40 hover:shadow-[0_24px_70px_-20px_rgba(201,162,75,0.25)]">
          {product.tag && (
            <span className="absolute top-4 left-4 z-20 bg-gold text-ink text-[9px] font-semibold tracking-[0.26em] uppercase px-2.5 py-1">
              {product.tag}
            </span>
          )}
          <span className="absolute top-4 right-4 z-20 text-[10px] tracking-[0.3em] text-dim font-display">
            №{String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative overflow-hidden px-6 pt-10 pb-2 flex-1">
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              draggable={false}
              className="blend-lighten relative mx-auto h-52 md:h-60 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-hover:-rotate-1"
            />
          </div>

          <div className="relative border-t border-gold/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1.5">{product.category}</div>
                <h3 className="font-display text-xl text-ivory group-hover:text-goldlight transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-fog font-light leading-relaxed line-clamp-2">{product.blurb}</p>
              </div>
              <button
                data-cursor
                onClick={() => onAdd(product)}
                aria-label={`Add ${product.name} to cart`}
                className="btn-sheen shrink-0 mt-1 w-11 h-11 border border-gold/40 text-gold flex items-center justify-center hover:bg-gold hover:text-ink transition-all duration-300 hover:rotate-90"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-goldlight font-medium tracking-wide">{formatPrice(product.price)}</span>
              <span className="flex flex-wrap gap-1.5">
                {product.specs.slice(0, 2).map((s) => (
                  <span key={s} className="text-[9px] tracking-[0.14em] uppercase text-dim border border-umber px-2 py-1">
                    {s}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

const SPANS = [
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-3",
  "col-span-6 sm:col-span-3 md:col-span-2",
  "col-span-6 sm:col-span-3 md:col-span-2",
  "col-span-6 sm:col-span-3 md:col-span-2",
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-3",
];

export default function Collection({
  filter,
  onFilter,
  onAdd,
}: {
  filter: string;
  onFilter: (c: string) => void;
  onAdd: (p: Product) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const tabs = ["All", ...CATEGORIES];
  const list = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="collection" className="relative py-28 scroll-mt-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-gold/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6">
        <div ref={ref} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
            >
              <span className="w-10 h-px bg-gold/70" /> Chapter I
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-5 font-display text-4xl md:text-6xl text-ivory"
            >
              The Gilded <span className="font-accent italic font-normal text-gold">Collection</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 max-w-lg text-fog font-light leading-relaxed"
            >
              Seven instruments, four disciplines, one metal. Each piece is numbered,
              lacquered and sealed by hand in our atelier.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap gap-2"
          >
            {tabs.map((t) => (
              <button
                key={t}
                data-cursor
                onClick={() => onFilter(t)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.24em] uppercase border transition-all duration-300 ${
                  filter === t
                    ? "bg-gold text-ink border-gold font-medium"
                    : "border-gold/20 text-fog hover:border-gold/60 hover:text-goldlight"
                }`}
              >
                {t}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div key={filter} className="mt-14 grid grid-cols-6 gap-5">
          {list.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onAdd={onAdd}
              span={filter === "All" ? SPANS[i % SPANS.length] : "col-span-6 sm:col-span-3 lg:col-span-2"}
            />
          ))}
        </motion.div>

        <div className="mt-12 flex items-center justify-between border-t border-gold/10 pt-6 text-[11px] tracking-[0.24em] uppercase text-dim">
          <span>{list.length} of {PRODUCTS.length} objets</span>
          <span className="flex items-center gap-2 text-fog">
            Concierge delivery worldwide <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
          </span>
        </div>
      </div>
    </section>
  );
}
