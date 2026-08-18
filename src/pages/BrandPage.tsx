import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "../store/site";
import { ArrowRight, DiamondIcon } from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";
import ProductCardGrid from "../components/ProductCardGrid";

export default function BrandPage() {
  const { id = "" } = useParams();
  const decoded = decodeURIComponent(id);
  const { site, products } = useSite();

  const brand =
    site.brands.find((b) => b.id === decoded) ??
    site.brands.find((b) => b.name.toLowerCase() === decoded.toLowerCase());
  if (!brand) return <Navigate to="/shop" replace />;

  const items = products.filter((p) => p.brand === brand.name);
  const others = site.brands.filter((b) => b.id !== brand.id);

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
            <span>Brands</span>
            <span className="text-brass">/</span>
            <span className="text-ink">{brand.name}</span>
          </div>
        </Reveal>

        {/* masthead */}
        <div className="mt-8 grid lg:grid-cols-12 border-2 border-ink overflow-hidden">
          <div className="lg:col-span-5 relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-ink plate-dark min-h-[300px]">
            <img
              src={brand.image}
              alt={brand.name}
              className="absolute inset-0 w-full h-full object-cover animate-kenburns"
            />
            <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2.5 py-1.5">
              Est. {brand.est}
            </span>
          </div>
          <div className="lg:col-span-7 relative plate-dark p-8 md:p-14 flex flex-col justify-center">
            <span className="absolute -right-8 -top-14 font-display font-extrabold text-[11rem] leading-none text-outline-paper select-none" aria-hidden>
              {brand.name.charAt(0)}
            </span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-brass"
            >
              <DiamondIcon className="w-2 h-2" /> {brand.tagline}
            </motion.div>
            <LineMaskReveal
              className="mt-4 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.8rem,6vw,5.5rem)] text-paper"
              lines={[
                <>
                  {brand.name}
                  <span className="text-brass">.</span>
                </>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-paper/55 text-lg leading-relaxed">{brand.story}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-goldlight border border-brass/40 px-4 py-2">
                  {String(items.length).padStart(2, "0")} objets in Run 07
                </span>
                {others.map((b) => (
                  <Link
                    key={b.id}
                    to={`/brand/${b.id}`}
                    data-cursor
                    className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/50 hover:text-brass transition-colors"
                  >
                    <span className="w-4 h-px bg-brass/50 group-hover:w-6 transition-all duration-300" />
                    {b.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* the line */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2 className="font-display font-extrabold tracking-tight text-3xl md:text-5xl">
                The {brand.name} <span className="italic font-medium text-gold">line.</span>
              </h2>
              <Link
                to="/shop"
                data-cursor
                className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-ink hover:text-gold transition-colors"
              >
                The whole shop <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>

          {items.length > 0 ? (
            <ProductCardGrid items={items} />
          ) : (
            <Reveal delay={0.1}>
              <div className="mt-10 border-2 border-dashed border-ink/25 p-14 text-center">
                <p className="font-display font-bold text-2xl">The line is in the workshop.</p>
                <p className="mt-2 text-mist">{brand.name} has no sealed objets in this run yet.</p>
                <Link
                  to="/shop"
                  data-cursor
                  className="mt-6 inline-flex items-center gap-3 bg-ink text-paper px-7 py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-coal transition-colors"
                >
                  Browse the maison <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </motion.div>
  );
}
