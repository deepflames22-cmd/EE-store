import { motion } from "framer-motion";
import { useCountUp, useInView } from "../hooks/useInView";

const STATS = [
  { value: 38, suffix: "", decimals: 0, label: "Countries served by concierge" },
  { value: 120, suffix: "K", decimals: 0, label: "Numbered objets in the wild" },
  { value: 4.9, suffix: "", decimals: 1, label: "Average owner rating" },
  { value: 24, suffix: " mo", decimals: 0, label: "Warranty, honoured worldwide" },
];

function Stat({ value, suffix, decimals, label, active, delay }: (typeof STATS)[0] & { active: boolean; delay: number }) {
  const v = useCountUp(value, active, 1900, decimals);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="relative py-10 px-6 text-center group"
    >
      <div className="font-display text-4xl md:text-5xl text-gold tabular-nums">
        {decimals ? v.toFixed(decimals) : Math.round(v)}
        <span className="text-goldlight">{suffix}</span>
      </div>
      <div className="mt-3 text-[10px] tracking-[0.26em] uppercase text-fog leading-relaxed">{label}</div>
      <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-3/4" />
    </motion.div>
  );
}

export default function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="relative border-y border-gold/10 bg-gradient-to-b from-coal/70 to-ink">
      <div ref={ref} className="mx-auto max-w-6xl px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/10">
        {STATS.map((s, i) => (
          <Stat key={s.label} {...s} active={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
