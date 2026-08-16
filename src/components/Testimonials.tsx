import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "../data/products";
import { StarIcon } from "./Icons";
import { useInView } from "../hooks/useInView";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, [paused, reduce]);

  const current = TESTIMONIALS[index];

  return (
    <section id="journal" className="relative py-28 overflow-hidden scroll-mt-24 bg-coal/40">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[50rem] h-[26rem] bg-gold/[0.05] blur-[130px] rounded-full pointer-events-none" />
      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-gold text-[11px] tracking-[0.42em] uppercase"
        >
          <span className="w-10 h-px bg-gold/70" /> Chapter V <span className="w-10 h-px bg-gold/70" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-5 font-display text-4xl md:text-6xl text-ivory"
        >
          Words From the <span className="font-accent italic font-normal text-gold">Owners</span>
        </motion.h2>

        <div className="relative mt-14 min-h-[260px] md:min-h-[220px]">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-accent italic text-8xl text-gold/25 select-none">“</span>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="flex justify-center gap-1.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
              <p className="mt-6 font-accent italic text-2xl md:text-[1.75rem] leading-snug text-ivory">
                {current.quote}
              </p>
              <footer className="mt-7 text-[11px] tracking-[0.3em] uppercase">
                <span className="text-goldlight">{current.name}</span>
                <span className="text-dim mx-3">—</span>
                <span className="text-fog">{current.role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-cursor
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-1 transition-all duration-400 ${
                i === index ? "w-10 bg-gold" : "w-5 bg-gold/25 hover:bg-gold/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
