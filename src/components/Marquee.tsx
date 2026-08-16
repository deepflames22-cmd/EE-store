import { MARQUEE_ITEMS } from "../data/products";
import { DiamondIcon } from "./Icons";

export default function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative z-10 bg-gold text-ink overflow-hidden border-y border-golddeep/50">
      <div className="flex w-max animate-marquee py-3.5">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-6 pr-6 text-[12px] font-medium tracking-[0.3em] uppercase whitespace-nowrap"
              >
                {item}
                <DiamondIcon className="w-2 h-2 text-ink/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OutlineMarquee() {
  const words = Array.from({ length: 8 }, () => "AURION");
  return (
    <div className="relative overflow-hidden py-10 border-y border-gold/10 bg-coal/60">
      <div className="flex w-max animate-marquee-rev items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {words.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display text-6xl md:text-8xl text-outline-faint whitespace-nowrap px-6">
                  {w}
                </span>
                <DiamondIcon className="w-3 h-3 text-gold/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
