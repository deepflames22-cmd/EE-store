import { motion } from "framer-motion";
import { CATEGORIES, PRODUCTS, type Category } from "../data/products";
import { ArrowUpRight, BoltIcon, CameraIconFallback, GemIcon, GlobeIcon } from "./category-icons";
import { useInView } from "../hooks/useInView";
import { scrollToId } from "./Nav";

const META: Record<Category, { icon: React.ReactNode; note: string; span: string; big: boolean }> = {
  Audio: {
    icon: <BoltIcon className="w-9 h-9" />,
    note: "Headphones, earbuds & columns of sound",
    span: "md:col-span-7",
    big: true,
  },
  Imaging: {
    icon: <CameraIconFallback className="w-9 h-9" />,
    note: "Pocket cameras & folding drones",
    span: "md:col-span-5",
    big: false,
  },
  Wearables: {
    icon: <GemIcon className="w-9 h-9" />,
    note: "Timepieces that compute",
    span: "md:col-span-5",
    big: false,
  },
  Desk: {
    icon: <GlobeIcon className="w-9 h-9" />,
    note: "Instruments for the working surface",
    span: "md:col-span-7",
    big: true,
  },
};

export default function Categories({ onSelect }: { onSelect: (c: Category) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute left-0 top-1/3 w-[30rem] h-[30rem] rounded-full bg-gold/[0.06] blur-[120px] pointer-events-none" />
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
            >
              <span className="w-10 h-px bg-gold/70" /> Chapter IV
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-5 font-display text-4xl md:text-6xl text-ivory"
            >
              Four <span className="font-accent italic font-normal text-gold">Disciplines</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-sm text-fog font-light leading-relaxed"
          >
            Choose a discipline and the collection reshapes itself around it.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-5">
          {CATEGORIES.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c).length;
            const m = META[c];
            return (
              <motion.button
                key={c}
                data-cursor
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  onSelect(c);
                  setTimeout(() => scrollToId("collection"), 60);
                }}
                className={`group relative overflow-hidden text-left border border-gold/12 bg-coal/70 p-8 md:p-10 hover-lift hover:border-gold/50 col-span-1 ${m.span}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gold/12 to-transparent translate-x-[-101%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                <span className="absolute -right-6 -bottom-8 font-display text-[9rem] leading-none text-outline-faint group-hover:text-outline-gold transition-all duration-500 select-none">
                  {c.charAt(0)}
                </span>

                <div className="relative flex items-start justify-between">
                  <span className="text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    {m.icon}
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-dim">
                    {String(count).padStart(2, "0")} objets
                  </span>
                </div>
                <h3 className={`relative mt-8 font-display text-ivory group-hover:text-goldlight transition-colors duration-300 ${m.big ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
                  {c}
                </h3>
                <p className="relative mt-2 text-sm text-fog font-light">{m.note}</p>
                <span className="relative mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.26em] uppercase text-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                  Enter discipline <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
