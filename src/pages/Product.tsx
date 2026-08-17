import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice, type Product } from "../data/products";
import { ArrowRight, CartIcon, DiamondIcon, MinusIcon, PlusIcon, RotateIcon, ShieldIcon, StarIcon, TruckIcon } from "../components/Icons";
import { Reveal } from "../components/shared";
import { useCart } from "../store/CartContext";
import { useSite } from "../store/site";

function Viewer({ product }: { product: Product }) {
  const [angle, setAngle] = useState(-16);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const loop = () => {
      if (!dragging.current) setAngle((a) => a + 0.16);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const shown = ((Math.round(angle) % 360) + 360) % 360;

  return (
    <div
      data-cursor
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        setAngle((a) => a + dx * 0.55);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
      className="relative plate-dark border-2 border-ink overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1100px" }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-4 animate-spin-slow text-brass/40 pointer-events-none" aria-hidden>
        <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 6" />
      </svg>

      <div className="relative aspect-square flex items-center justify-center">
        <div
          className="absolute inset-8 will-change-transform"
          style={{ transform: `rotateY(${angle}deg)`, transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-2/3 h-2/3 rounded-full bg-brass/15 blur-[70px]" />
            <img
              src={product.img}
              alt={product.name}
              draggable={false}
              className="relative w-[86%] h-[86%] object-contain blend-lighten drop-shadow-[0_24px_50px_rgba(201,162,75,0.3)]"
            />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[64%] pointer-events-none">
          <div className="mx-auto h-4 rounded-[100%] bg-brass/25 blur-md" />
          <div className="mx-auto -mt-3 h-7 rounded-[100%] border border-brass/30 bg-gradient-to-b from-brass/10 to-transparent" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-paper/15 px-5 py-3.5">
        <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-paper/60">
          <RotateIcon className="w-4 h-4 text-brass" /> Drag to rotate
        </span>
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-brass tabular-nums">{shown}°</span>
      </div>
    </div>
  );
}

const BOX_ITEMS = ["The objet, serial-engraved", "Lacquered travel case", "Braided gold-tone cable", "Numbered certificate card", "Microfibre, monogrammed"];

export default function ProductPage() {
  const { id } = useParams();
  const { products } = useSite();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => setQty(1), [id]);

  if (!product) return <Navigate to="/shop" replace />;

  const related = [...products.filter((p) => p.id !== product.id)]
    .sort(
      (a, b) =>
        Number(b.category === product.category) - Number(a.category === product.category) ||
        Number(b.brand === product.brand) - Number(a.brand === product.brand)
    )
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        {/* breadcrumb */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-mist">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-brass">/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="text-brass">/</span>
            <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
            <span className="text-brass">/</span>
            <span className="text-ink">{product.name}</span>
          </div>
        </Reveal>

        <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal y={40}>
            <Viewer product={product} />
          </Reveal>

          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                {product.tag && (
                  <span className="bg-brass text-ink font-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium">{product.tag}</span>
                )}
                <Link
                  to={`/brand/${encodeURIComponent(product.brand)}`}
                  data-cursor
                  className="border border-gold/50 text-gold font-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 hover:bg-brass hover:text-ink hover:border-brass transition-all duration-300"
                >
                  {product.brand}
                </Link>
                <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-gold">Run 07 — {product.category}</span>
              </div>
              <h1 className="mt-4 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-7xl">
                {product.name}
                <span className="text-brass">.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <span className="font-display font-bold text-3xl tabular-nums">{formatPrice(product.price)}</span>
                <span className="flex items-center gap-1 text-brass">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4" />
                  ))}
                  <span className="ml-2 font-mono text-[10px] tracking-[0.2em] uppercase text-mist">4.9 — 128 owners</span>
                </span>
              </div>
              <p className="mt-5 max-w-lg text-lg text-mist leading-relaxed">{product.blurb}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-7 border-t-2 border-ink">
                {product.specs.map((s, i) => (
                  <li key={s} className="flex items-center justify-between border-b border-ink/15 py-3.5">
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Spec 0{i + 1}</span>
                    <span className="font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap items-stretch gap-4">
                <div className="flex items-center border-2 border-ink">
                  <button
                    data-cursor
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-4 hover:bg-ink hover:text-paper transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-display font-bold text-xl tabular-nums">{qty}</span>
                  <button
                    data-cursor
                    onClick={() => setQty((q) => Math.min(9, q + 1))}
                    className="px-4 py-4 hover:bg-ink hover:text-paper transition-colors"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <button
                  data-cursor
                  onClick={() => add(product, qty)}
                  className="btn-sheen group flex-1 min-w-[240px] bg-ink text-paper px-8 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <CartIcon className="w-4 h-4 text-brass group-hover:text-paper transition-colors" />
                  Add to vault — {formatPrice(product.price * qty)}
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="border border-ink/15 bg-bone/60 p-5 flex gap-4">
                  <TruckIcon className="w-6 h-6 text-gold shrink-0" />
                  <div>
                    <div className="font-medium text-sm">White-glove delivery</div>
                    <div className="text-xs text-mist mt-1">Insured, hand-carried over $500</div>
                  </div>
                </div>
                <div className="border border-ink/15 bg-bone/60 p-5 flex gap-4">
                  <ShieldIcon className="w-6 h-6 text-gold shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Repair for life</div>
                    <div className="text-xs text-mist mt-1">24-month warranty, then atelier care</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-8">
                <h3 className="font-mono text-[11px] tracking-[0.28em] uppercase text-gold">In the box</h3>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {BOX_ITEMS.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-mist">
                      <span className="w-1.5 h-1.5 bg-brass shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* related */}
        <div className="mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2 className="font-display font-extrabold tracking-tight text-4xl md:text-5xl">
                Pairs well <span className="italic font-medium text-gold">with.</span>
              </h2>
              <Link
                to="/shop"
                data-cursor
                className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-ink hover:text-gold transition-colors"
              >
                The whole run <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/product/${p.id}`} data-cursor className="group block">
                  <div className="plate-dark border-2 border-ink overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="blend-lighten mx-auto h-48 object-contain px-8 py-8 transition-transform duration-700 group-hover:scale-107 group-hover:-rotate-1"
                    />
                  </div>
                  <div className="border-2 border-t-0 border-ink bg-paper px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold">{p.category}</div>
                      <div className="font-display font-bold text-lg group-hover:text-gold transition-colors">{p.name}</div>
                    </div>
                    <span className="font-medium tabular-nums text-mist">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
