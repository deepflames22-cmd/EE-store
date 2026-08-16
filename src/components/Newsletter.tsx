import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GemIcon } from "./Icons";
import { useInView } from "../hooks/useInView";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <section id="contact" className="relative py-28 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 plate-bg" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[24rem] bg-gold/[0.08] blur-[120px] rounded-full pointer-events-none" />

      <div ref={ref} className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-block text-gold"
        >
          <GemIcon className="w-8 h-8" />
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 font-display text-4xl md:text-6xl text-ivory"
        >
          The Private <span className="font-accent italic font-normal text-gold">List</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 max-w-xl mx-auto text-fog font-light leading-relaxed"
        >
          First access to each quarterly run, atelier invitations, and the occasional
          one-of-one auction. No noise — one letter per season.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto"
        >
          {state === "done" ? (
            <div className="border border-gold/40 bg-gold/10 px-8 py-6 text-goldlight tracking-wide">
              <span className="font-display text-lg">Welcome to the list.</span>
              <p className="mt-1.5 text-sm text-fog font-light">
                Your first letter ships with the next run — Friday, at golden hour.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="relative">
              <div className={`flex flex-col sm:flex-row border transition-colors duration-300 ${state === "error" ? "border-[#b3543f]" : "border-gold/30 focus-within:border-gold bg-ink/70"}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="your@correspondence.com"
                  className="flex-1 bg-transparent px-6 py-4 text-ivory placeholder:text-dim focus:outline-none tracking-wide"
                  aria-label="Email address"
                />
                <button
                  data-cursor
                  type="submit"
                  className="btn-sheen group bg-gold text-ink px-8 py-4 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-goldlight transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  Request Entry
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
              {state === "error" && (
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[#d97b63]">
                  Please present a valid address
                </p>
              )}
            </form>
          )}
          <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-dim">
            4,208 members · Unsubscribe in one click
          </p>
        </motion.div>
      </div>
    </section>
  );
}
