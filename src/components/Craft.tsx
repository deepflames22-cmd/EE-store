import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LIFESTYLE_IMG, PRODUCTS } from "../data/products";
import { useInView } from "../hooks/useInView";

const PILLARS = [
  {
    n: "01",
    title: "Anodised Aluminium",
    body: "Every chassis begins as a single billet, milled for nine hours before a drop of gold touches it.",
  },
  {
    n: "02",
    title: "Sapphire & Steel",
    body: "Crystal faces rated 9 on the Mohs scale; hinges tested to two hundred thousand folds.",
  },
  {
    n: "03",
    title: "24-Karat Detailing",
    body: "Rings, grilles and crowns are plated in three passes of gold, then lacquered by hand.",
  },
];

export default function Craft() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -90]);

  const watches = PRODUCTS[1];
  const speaker = PRODUCTS[3];

  return (
    <section id="atelier" ref={sectionRef} className="relative py-28 scroll-mt-24 overflow-hidden">
      <div className="absolute right-0 top-24 w-[36rem] h-[36rem] rounded-full bg-golddeep/10 blur-[120px] pointer-events-none" />

      <div ref={ref} className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16">
        {/* sticky narrative */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
          >
            <span className="w-10 h-px bg-gold/70" /> Chapter III
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 font-display text-4xl md:text-6xl text-ivory leading-[1.08]"
          >
            Built Like <span className="font-accent italic font-normal text-gold">Couture,</span>
            <br /> Not Consumer Goods
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-md text-fog font-light leading-relaxed"
          >
            We release four small runs a year. When a run sells through, the serial closes
            forever — your piece will never be re-made.
          </motion.p>

          <div className="mt-12 space-y-9">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                className="group flex gap-6 border-l border-gold/15 pl-6 hover:border-gold transition-colors duration-400"
              >
                <span className="font-display text-gold/70 text-lg pt-0.5 group-hover:text-gold transition-colors">{p.n}</span>
                <div>
                  <h3 className="font-display text-xl text-ivory group-hover:text-goldlight transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-fog font-light leading-relaxed max-w-sm">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 inline-flex items-baseline gap-4 border border-gold/20 px-6 py-4"
          >
            <span className="font-display text-3xl text-gold">312</span>
            <span className="text-[11px] tracking-[0.24em] uppercase text-fog max-w-[180px] leading-relaxed">
              hours of handwork in every serial
            </span>
          </motion.div>
        </div>

        {/* parallax imagery */}
        <div className="relative flex flex-col gap-10">
          <motion.figure style={reduce ? undefined : { y: y1 }} className="relative">
            <div className="relative overflow-hidden border border-gold/15">
              <img
                src={LIFESTYLE_IMG}
                alt="AURION objets arranged on a walnut desk in candlelight"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-[1.6s] ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-5 text-[10px] tracking-[0.3em] uppercase text-goldlight">
                The atelier, after hours
              </figcaption>
            </div>
            <span className="absolute -top-4 -left-4 w-10 h-10 border-t border-l border-gold/60" />
            <span className="absolute -bottom-4 -right-4 w-10 h-10 border-b border-r border-gold/60" />
          </motion.figure>

          <div className="grid grid-cols-2 gap-6">
            <motion.figure style={reduce ? undefined : { y: y2 }} className="relative mt-10">
              <div className="relative overflow-hidden border border-gold/15 bg-coal">
                <img
                  src={watches.img}
                  alt={watches.name}
                  loading="lazy"
                  className="blend-lighten w-full aspect-square object-contain p-6 transition-transform duration-700 hover:scale-110 hover:-rotate-2"
                />
              </div>
              <figcaption className="mt-3 text-[10px] tracking-[0.3em] uppercase text-dim text-center">
                {watches.name} — gold case
              </figcaption>
            </motion.figure>
            <motion.figure style={reduce ? undefined : { y: y3 }} className="relative">
              <div className="relative overflow-hidden border border-gold/15 bg-coal">
                <img
                  src={speaker.img}
                  alt={speaker.name}
                  loading="lazy"
                  className="blend-lighten w-full aspect-square object-contain p-6 transition-transform duration-700 hover:scale-110 hover:rotate-2"
                />
              </div>
              <figcaption className="mt-3 text-[10px] tracking-[0.3em] uppercase text-dim text-center">
                {speaker.name} — grille detail
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}
