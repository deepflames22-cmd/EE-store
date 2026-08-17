import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CATEGORIES, PRODUCTS, formatPrice, type Category, type Product } from "../data/products";
import { ArrowUpRight, PlusIcon } from "../components/Icons";
import { Reveal } from "../components/shared";
import { ShopPeekAd } from "../components/ads";
import { useCart } from "../store/CartContext";
import { useInView } from "../hooks/useInView";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

function ShopCard({ product, index, onAdd }: { product: Product; index: number; onAdd: (p: Product) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.08);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative hover-lift hover:shadow-[0_22px_50px_-18px_rgba(23,21,16,0.35)]"
    >
      <div className="relative plate-dark border-2 border-ink overflow-hidden">
        <div className="px-8 pt-12 pb-6">
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className="blend-lighten mx-auto h-52 md:h-56 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-107 group-hover:-rotate-1"
          />
        </div>
        <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2 py-1">
          №{String(PRODUCTS.findIndex((p) => p.id === product.id) + 1).padStart(2, "0")}
        </span>
        {product.tag && (
          <span className="absolute top-4 right-4 bg-brass text-ink font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium">
            {product.tag}
          </span>
        )}
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-goldlight flex items-center gap-1.5">
            Open the objet <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      <div className="border-2 border-t-0 border-ink bg-paper px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold">{product.category}</div>
          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-gold transition-colors truncate">
            {product.name}
          </h3>
          <div className="text-sm text-mist tabular-nums mt-0.5">{formatPrice(product.price)}</div>
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

      <Link
        to={`/product/${product.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
      />
      <div className="relative z-20 pointer-events-none absolute -bottom-0 right-14 w-11 h-11" aria-hidden />
    </motion.div>
  );
}

export default function Shop() {
  const location = useLocation();
  const initialCat = (location.state as { cat?: Category } | null)?.cat ?? "All";
  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<Sort>("featured");
  const { add } = useCart();

  const list = useMemo(() => {
    const base = cat === "All" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === cat);
    switch (sort) {
      case "price-asc":
        return base.sort((a, b) => a.price - b.price);
      case "price-desc":
        return base.sort((a, b) => b.price - a.price);
      case "name":
        return base.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return base;
    }
  }, [cat, sort]);

  const tabs = ["All", ...CATEGORIES];

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
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
                <span className="w-2 h-2 bg-brass" /> Run 07 — The Shop
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-4 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.8rem,7vw,6rem)]">
                Every objet, <span className="italic font-medium text-gold">numbered.</span>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-mist leading-relaxed">
              Seven instruments across four disciplines. When a run sells through, it is
              never re-made.
            </p>
          </Reveal>
        </div>

        {/* toolbar */}
        <Reveal delay={0.2}>
          <div className="mt-12 border-y-2 border-ink py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  data-cursor
                  onClick={() => setCat(t)}
                  className={`px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase border-2 transition-all duration-300 ${
                    cat === t
                      ? "bg-ink text-paper border-ink"
                      : "border-ink/25 text-mist hover:border-ink hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist tabular-nums">
                {String(list.length).padStart(2, "0")} objets
              </span>
              <label className="relative">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none bg-paper border-2 border-ink/25 pl-4 pr-9 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-ink focus:outline-none focus:border-ink cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="name">A — Z</option>
                </select>
                <svg viewBox="0 0 12 8" className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m1 1.5 5 5 5-5" strokeLinecap="round" />
                </svg>
              </label>
            </div>
          </div>
        </Reveal>

        {/* grid */}
        <motion.div key={`${cat}-${sort}`} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {list.map((p, i) => (
            <ShopCard key={p.id} product={p} index={i} onAdd={add} />
          ))}
        </motion.div>

        {/* footnote */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-mist">
            <span>{list.length} of {PRODUCTS.length} objets shown</span>
            <span className="flex items-center gap-2">
              Concierge delivery worldwide <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
            </span>
          </div>
        </Reveal>
      </div>
      <ShopPeekAd />
    </motion.div>
  );
}
