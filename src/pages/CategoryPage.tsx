import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../data/products";
import { useSite } from "../store/site";
import { useCart } from "../store/CartContext";
import { ArrowRight, ArrowUpRight, DiamondIcon, PlusIcon } from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";
import ProductCardGrid from "../components/ProductCardGrid";

export default function CategoryPage() {
  const { name = "" } = useParams();
  const decoded = decodeURIComponent(name);
  const { site, products } = useSite();

  const meta = site.categories.find((c) => c.name.toLowerCase() === decoded.toLowerCase());
  if (!meta) return <Navigate to="/shop" replace />;

  const items = products.filter((p) => p.category === meta.name);
  const others = site.categories.filter((c) => c.name !== meta.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-mist">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-brass">/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="text-brass">/</span>
            <span className="text-ink">{meta.name}</span>
          </div>
        </Reveal>

        {/* hero plate */}
        <div className="mt-8 grid lg:grid-cols-12 border-2 border-ink overflow-hidden">
          <div className="lg:col-span-7 relative plate-dark p-8 md:p-14 flex flex-col justify-end min-h-[320px]">
            <div className="absolute top-6 right-6">
              <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-goldlight border border-brass/40 bg-ink/60 px-3 py-1.5">
                {String(items.length).padStart(2, "0")} objets in run
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass"
            >
              <DiamondIcon className="w-2 h-2" /> Discipline
            </motion.div>
            <LineMaskReveal
              className="mt-4 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.6rem,6vw,5.5rem)] text-paper"
              lines={[
                <>
                  {meta.name}
                  <span className="text-brass">.</span>
                </>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-lg text-paper/55 leading-relaxed">{meta.description}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {others.map((c) => (
                  <Link
                    key={c.name}
                    to={`/category/${encodeURIComponent(c.name)}`}
                    data-cursor
                    className="border border-paper/25 px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/60 hover:border-brass hover:text-brass transition-all duration-300"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  to="/shop"
                  data-cursor
                  className="group bg-brass text-ink px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-goldlight transition-colors flex items-center gap-2"
                >
                  All disciplines <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 relative overflow-hidden border-t-2 lg:border-t-0 lg:border-l-2 border-ink plate-dark">
            <img
              src={meta.image}
              alt={meta.name}
              className="absolute inset-0 w-full h-full object-contain p-10 animate-kenburns"
            />
            <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2.5 py-1.5">
              Fig. — {meta.name} shelf
            </span>
          </div>
        </div>

        {/* shelf */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2 className="font-display font-extrabold tracking-tight text-3xl md:text-5xl">
                On this <span className="italic font-medium text-gold">shelf.</span>
              </h2>
              <Link
                to="/shop"
                state={{ cat: meta.name }}
                data-cursor
                className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-ink hover:text-gold transition-colors"
              >
                Filter in the shop <ArrowUpRight className="w-4 h-4 text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </Reveal>

          {items.length > 0 ? (
            <ProductCardGrid items={items} />
          ) : (
            <Reveal delay={0.1}>
              <div className="mt-10 border-2 border-dashed border-ink/25 p-14 text-center">
                <p className="font-display font-bold text-2xl">This shelf is being re-gilded.</p>
                <p className="mt-2 text-mist">No objets in Run 07 carry this discipline yet.</p>
                <Link
                  to="/shop"
                  data-cursor
                  className="mt-6 inline-flex items-center gap-3 bg-ink text-paper px-7 py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-coal transition-colors"
                >
                  Browse everything <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </motion.div>
  );
}
