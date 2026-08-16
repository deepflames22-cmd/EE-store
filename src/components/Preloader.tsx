import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./Icons";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(100);
      const t = setTimeout(onDone, 120);
      return () => clearTimeout(t);
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(onDone, 750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const letters = "AURION".split("");

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 plate-bg" />
      <div className="relative flex items-center gap-3 text-gold">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <LogoMark className="w-8 h-8" />
        </motion.span>
        <div className="flex overflow-hidden">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              className="font-display text-4xl md:text-6xl tracking-[0.35em] text-ivory"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="relative mt-10 w-56 h-px bg-umber overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="relative mt-4 font-body text-xs tracking-[0.5em] text-fog tabular-nums">
        {String(progress).padStart(3, "0")}
      </div>
      <div className="absolute bottom-8 text-[10px] tracking-[0.4em] uppercase text-dim">
        Electronics, Elevated
      </div>
    </motion.div>
  );
}
