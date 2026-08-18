import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "./Icons";

/* ---------- boot loader (first visit) ---------- */

export function BootLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[99] bg-ink text-paper flex flex-col"
      exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block"
          >
            <span className="absolute -inset-6 border border-brass/30 animate-spin-slow" style={{ borderRadius: "0" }} />
            <span className="absolute -inset-12 border border-brass/15 animate-spin-rev" />
            <LogoMark className="w-16 h-16 text-brass" />
          </motion.div>
          <div className="mt-10 font-display font-extrabold tracking-[0.42em] text-2xl md:text-3xl text-paper pl-[0.42em]">
            AURION
          </div>
          <div className="mt-3 font-mono text-[10px] tracking-[0.34em] uppercase text-brass">
            Gilding the run
          </div>
        </div>
      </div>
      <div className="px-8 pb-10 max-w-3xl mx-auto w-full">
        <div className="flex items-end justify-between font-mono text-[11px] tracking-[0.24em] uppercase text-paper/60">
          <span>Polishing — {progress}%</span>
          <span className="text-brass tabular-nums text-2xl">{String(progress).padStart(3, "0")}</span>
        </div>
        <div className="mt-3 h-px bg-paper/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-brass"
            style={{ width: `${progress}%`, transition: "width 0.12s linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- route veil (page-open animation) ---------- */

export function PageVeil({ routeKey }: { routeKey: number }) {
  const reduce = useReducedMotion();
  if (routeKey === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={routeKey}
        className="fixed inset-0 z-[84] pointer-events-none bg-ink flex items-center justify-center"
        initial={reduce ? { opacity: 0 } : { y: "-101%" }}
        animate={reduce ? { opacity: [0, 1, 1, 0] } : { y: ["-101%", "0%", "0%", "101%"] }}
        transition={{ duration: reduce ? 0.4 : 0.85, times: [0, 0.4, 0.62, 1], ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
          transition={{ duration: 0.85, times: [0, 0.4, 0.62, 1] }}
          className="flex items-center gap-3 text-brass"
        >
          <LogoMark className="w-8 h-8" />
          <span className="font-display font-bold tracking-[0.4em] text-paper text-xl pl-[0.4em]">AURION</span>
        </motion.span>
        <span className="absolute bottom-8 left-8 font-mono text-[10px] tracking-[0.3em] uppercase text-paper/40">
          Turning the page
        </span>
        <span className="absolute bottom-8 right-8 w-10 h-px bg-brass/60" />
      </motion.div>
    </AnimatePresence>
  );
}
