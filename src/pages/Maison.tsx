import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LIFESTYLE_IMG, PRODUCTS } from "../data/products";
import { ArrowRight, DiamondIcon } from "../components/Icons";
import { LineMaskReveal, Reveal, SectionHead } from "../components/shared";

const VALUES: Array<[string, string]> = [
  ["Material honesty", "Billet aluminium, sapphire, brass. Nothing painted to look like something it is not."],
  ["Numbered runs", "Every objet carries a serial. When a run ends, the tooling is retired — never re-made."],
  ["Repair for life", "The atelier services every serial we have ever issued, decades after the warranty ends."],
  ["The gold standard", "A 24-karat PVD finish applied in a single pass — the colour of late afternoon, permanently."],
];

const TIMELINE: Array<[string, string, string]> = [
  ["MMXIX", "First run", "Fifty headphones, anodised by hand in a Lyon workshop. Sold in nine days."],
  ["MMXXI", "Run 03 sells through", "The Meridian timepiece forces a second atelier floor. The waitlist opens."],
  ["MMXXIII", "Geneva", "The maison moves to Rue du Rhône. Eleven artisans, one polishing bench."],
  ["MMXXV", "Run 07 — today", "Seven objets, four disciplines, one metal. You are looking at it."],
];

export default function Maison() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        {/* opening */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold"
            >
              <span className="w-2 h-2 bg-brass" /> The Maison — Est. MMXIX
            </motion.div>
            <LineMaskReveal
              className="mt-6 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.8rem,7.5vw,7rem)]"
              lines={[
                <>A maison of</>,
                <>
                  <span className="italic font-medium text-gold">machines,</span>
                </>,
                <>not a factory.</>,
              ]}
            />
            <Reveal delay={0.4}>
              <p className="mt-8 max-w-xl text-lg text-mist leading-relaxed">
                AURION was founded on a single irritation: that electronics were built to
                be forgotten. We build the opposite — instruments with serials, serviced
                for life, finished in a metal that remembers every hand it passes through.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.25} y={50}>
              <motion.div style={{ y }} className="relative border-2 border-ink overflow-hidden">
                <div className="overflow-hidden">
                  <img src={LIFESTYLE_IMG} alt="The AURION atelier" className="w-full aspect-[4/3] object-cover animate-kenburns" />
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-paper bg-ink/80 border border-brass/30 px-3 py-1.5">
                  Rue du Rhône 12 — the bench at closing
                </span>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* values */}
        <div className="mt-28">
          <SectionHead
            index="01"
            kicker="Principles"
            title={
              <>
                Four rules, <span className="italic font-medium text-gold">unbroken.</span>
              </>
            }
          />
          <div className="mt-12 grid md:grid-cols-2 border-t-2 border-l-2 border-ink">
            {VALUES.map(([k, v], i) => (
              <Reveal key={k} delay={(i % 2) * 0.1} y={30}>
                <div className="group border-b-2 border-r-2 border-ink p-8 md:p-10 bg-paper hover:bg-bone/70 transition-colors duration-400 h-full">
                  <div className="flex items-start justify-between">
                    <span className="font-display font-extrabold text-5xl text-outline-ink group-hover:text-gold transition-all duration-400" style={{ WebkitTextStroke: "1.5px rgba(23,21,16,0.28)" }}>
                      0{i + 1}
                    </span>
                    <DiamondIcon className="w-3 h-3 text-brass mt-3 group-hover:rotate-45 transition-transform duration-400" />
                  </div>
                  <h3 className="mt-6 font-display font-bold text-2xl">{k}</h3>
                  <p className="mt-3 text-mist leading-relaxed max-w-sm">{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* quote band */}
        <Reveal y={44}>
          <div className="mt-28 plate-pine text-paper border-2 border-ink px-6 md:px-16 py-16 relative overflow-hidden">
            <span className="absolute -left-6 -top-14 font-display font-extrabold text-[14rem] leading-none text-outline-paper select-none" aria-hidden>
              “
            </span>
            <blockquote className="relative font-display font-bold text-2xl md:text-4xl leading-snug tracking-tight max-w-3xl">
              We do not make gadgets. We make the objects your grandchildren will argue
              over — that happen to charge wirelessly.
            </blockquote>
            <figcaption className="relative mt-7 flex items-center gap-4">
              <span className="w-10 h-px bg-brass" />
              <span className="font-medium text-goldlight">Élodie Vasseur</span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">Founder & first polisher</span>
            </figcaption>
          </div>
        </Reveal>

        {/* timeline */}
        <div className="mt-28">
          <SectionHead
            index="02"
            kicker="The Ledger"
            title={
              <>
                Seven years, <span className="italic font-medium text-gold">seven runs.</span>
              </>
            }
          />
          <div className="mt-14 relative border-l-2 border-ink/20 ml-2 md:ml-4">
            {TIMELINE.map(([year, title, body], i) => (
              <Reveal key={year} delay={i * 0.08} y={28}>
                <div className="relative pl-8 md:pl-14 pb-12 last:pb-0 group">
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 bg-brass border-2 border-ink group-hover:scale-125 transition-transform duration-300" />
                  <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gold">{year}</div>
                  <h3 className="mt-2 font-display font-bold text-2xl md:text-3xl">{title}</h3>
                  <p className="mt-2 max-w-xl text-mist leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* closing CTA */}
        <Reveal y={40}>
          <div className="mt-24 bg-brass border-2 border-ink px-6 md:px-14 py-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-ink/70">Run 07 is live</div>
              <h2 className="mt-3 font-display font-extrabold text-4xl md:text-5xl tracking-tight text-ink">
                Own a numbered piece<span className="text-ink">.</span>
              </h2>
            </div>
            <Link
              to="/shop"
              data-cursor
              className="btn-sheen group shrink-0 bg-ink text-paper px-9 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center gap-3"
            >
              Enter the shop
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </Reveal>

        {/* small object strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5">
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07} y={30}>
              <Link to={`/product/${p.id}`} data-cursor className="group block plate-dark border-2 border-ink p-6">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="blend-lighten mx-auto h-28 object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="mt-4 text-center font-mono text-[9px] tracking-[0.22em] uppercase text-paper/60 group-hover:text-goldlight transition-colors">
                  {p.name}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
