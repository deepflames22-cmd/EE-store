import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartIcon, CloseIcon, LogoMark } from "./Icons";

const LINKS = [
  { label: "Collection", id: "collection" },
  { label: "Showcase", id: "showcase" },
  { label: "Atelier", id: "atelier" },
  { label: "Journal", id: "journal" },
  { label: "Contact", id: "contact" },
];

export const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Nav({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 ${
          scrolled
            ? "bg-ink/85 backdrop-blur-md border-b border-gold/15 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <button
            data-cursor
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-gold group"
            aria-label="AURION home"
          >
            <LogoMark className="w-6 h-6 transition-transform duration-500 group-hover:rotate-[360deg]" />
            <span className="font-display text-lg tracking-[0.32em] text-ivory">AURION</span>
          </button>

          <nav className="hidden lg:flex items-center gap-9">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-cursor
                onClick={() => scrollToId(l.id)}
                className="relative text-[13px] tracking-[0.22em] uppercase text-fog hover:text-goldlight transition-colors duration-300 group"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-400 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              data-cursor
              onClick={onCartOpen}
              className="relative p-2.5 border border-gold/25 text-goldlight hover:border-gold hover:bg-gold/10 transition-all duration-300"
              aria-label="Open cart"
            >
              <CartIcon className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-gold text-ink text-[10px] font-semibold rounded-full flex items-center justify-center tabular-nums animate-badge-pop"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              data-cursor
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex flex-col gap-1.5 p-2 text-goldlight"
              aria-label="Open menu"
            >
              <span className="block w-6 h-px bg-current" />
              <span className="block w-4 h-px bg-current ml-auto" />
              <span className="block w-6 h-px bg-current" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-px bg-gold/80 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/97 backdrop-blur-lg flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display tracking-[0.32em] text-ivory flex items-center gap-2.5">
                <LogoMark className="w-5 h-5 text-gold" /> AURION
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-goldlight" aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-10 gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => scrollToId(l.id), 80);
                  }}
                  className="text-left font-display text-4xl py-3 text-ivory hover:text-gold hover:translate-x-3 transition-all duration-300"
                >
                  <span className="text-xs text-gold align-top mr-4">0{i + 1}</span>
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <div className="px-10 pb-10 text-xs tracking-[0.3em] uppercase text-dim">
              Electronics, Elevated — Est. MMXIX
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
