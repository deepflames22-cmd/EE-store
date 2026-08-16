import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { DiamondIcon } from "./Icons";

export function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function LineMaskReveal({
  lines,
  className = "",
  lineClassName = "",
  stagger = 0.09,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: reduce ? 0 : "112%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  dark = false,
  right,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  dark?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Reveal>
          <div className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase ${dark ? "text-goldlight" : "text-gold"}`}>
            <span className={dark ? "text-outline-paper font-display text-sm" : "text-outline-ink font-display text-sm"}>{index}</span>
            <span className="w-8 h-px bg-brass" />
            {kicker}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className={`mt-4 font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight ${dark ? "text-paper" : "text-ink"}`}>
            {title}
          </h2>
        </Reveal>
      </div>
      {right && <Reveal delay={0.15}>{right}</Reveal>}
    </div>
  );
}

export function Marquee({
  items,
  dark = true,
  reverse = false,
  className = "",
}: {
  items: string[];
  dark?: boolean;
  reverse?: boolean;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`overflow-hidden ${
        dark ? "bg-ink text-paper border-y border-ink" : "bg-brass text-ink"
      } ${className}`}
    >
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-6 pr-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase whitespace-nowrap"
              >
                {item}
                <DiamondIcon className={`w-2 h-2 ${dark ? "text-brass" : "text-ink/60"}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrbitBadge({
  text = "AURION • RUN 07 • GOLD STANDARD • ",
  size = 120,
  light = false,
}: {
  text?: string;
  size?: number;
  light?: boolean;
}) {
  return (
    <div className="relative animate-spin-slow" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id="orbit-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text
          className={light ? "fill-goldlight" : "fill-ink"}
          style={{ fontSize: "8.2px", letterSpacing: "2.4px", fontFamily: "IBM Plex Mono, monospace" }}
        >
          <textPath href="#orbit-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <DiamondIcon className={`w-3 h-3 ${light ? "text-brass" : "text-gold"}`} />
      </span>
    </div>
  );
}

export function TiltFrame({
  children,
  max = 7,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [t, setT] = useState({ rx: 0, ry: 0 });

  return (
    <div
      className={className}
      style={{ perspective: "1000px" }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ rx: py * -max, ry: px * max });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
    >
      <div
        className="h-full will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: "transform 0.35s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}


