import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart, type ToastItem } from "../store/CartContext";
import { formatPrice } from "../data/products";
import {
  ArrowRight,
  CartIcon,
  CloseIcon,
  DiamondIcon,
  LogoMark,
  MinusIcon,
  PlusIcon,
  TruckIcon,
  InstagramIcon,
  XSocialIcon,
  YoutubeIcon,
} from "./Icons";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/maison", label: "Maison" },
  { to: "/contact", label: "Contact" },
];

const FREE_SHIP = 500;

/* ---------------- cursor ---------------- */

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement;
      targetScale = t.closest("a, button, [data-cursor]") ? 2 : 1;
    };
    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      scale += (targetScale - scale) * 0.14;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px,${ring.y}px) translate(-50%,-50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="fixed top-0 left-0 z-[95] w-9 h-9 rounded-full border border-brass/70 pointer-events-none" />
      <div ref={dotRef} className="fixed top-0 left-0 z-[96] w-1.5 h-1.5 rounded-full bg-brass pointer-events-none" />
    </>
  );
}

/* ---------------- nav ---------------- */

function Nav() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

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
          scrolled ? "bg-paper/92 backdrop-blur-md border-b border-ink/15 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[88rem] px-5 md:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="AURION home">
            <LogoMark className="w-6 h-6 text-gold transition-transform duration-500 group-hover:rotate-[360deg]" />
            <span className="font-display font-extrabold text-xl tracking-tight text-ink">
              AURION<span className="text-brass">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `link-rule text-[12px] font-medium tracking-[0.22em] uppercase transition-colors duration-300 ${
                    isActive ? "text-ink active" : "text-mist hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline font-mono text-[10px] tracking-[0.3em] uppercase text-mist border border-ink/20 px-3 py-1.5">
              Run 07 — Live
            </span>
            <button
              data-cursor
              onClick={() => setOpen(true)}
              className="relative p-3 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-300"
              aria-label="Open cart"
            >
              <CartIcon className="w-5 h-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2.5 -right-2.5 min-w-5 h-5 px-1 bg-brass text-ink text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums animate-badge-pop"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              data-cursor
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2.5 border-2 border-ink"
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-ink" />
              <span className="block w-3.5 h-0.5 bg-ink ml-auto" />
              <span className="block w-5 h-0.5 bg-ink" />
            </button>
          </div>
        </div>
        <div
          className="absolute bottom-[-1px] left-0 h-[2px] bg-brass transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink text-paper flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-display font-extrabold text-xl tracking-tight flex items-center gap-2.5">
                <LogoMark className="w-5 h-5 text-brass" /> AURION<span className="text-brass">.</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-paper hover:text-brass transition-colors" aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                  className="overflow-hidden"
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `flex items-baseline gap-4 font-display font-extrabold text-5xl py-2.5 tracking-tight transition-all duration-300 hover:translate-x-4 hover:text-brass ${
                        isActive ? "text-brass" : "text-paper"
                      }`
                    }
                  >
                    <span className="font-mono text-xs text-brass/70">0{i + 1}</span>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 pb-8 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-paper/50">
              <span>Electronics, dressed in gold</span>
              <span>Est. MMXIX</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- cart drawer ---------------- */

function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, subtotal, count, clear, pushToast } = useCart();
  const progress = Math.min((subtotal / FREE_SHIP) * 100, 100);

  const checkout = () => {
    pushToast("Concierge notified", "A specialist will write to you within the hour.");
    clear();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[85] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[86] w-full max-w-md bg-paper text-ink border-l-2 border-ink flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-ink">
              <h3 className="font-display font-bold text-xl flex items-center gap-3">
                Your Vault
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">{count} items</span>
              </h3>
              <button
                data-cursor
                onClick={() => setOpen(false)}
                className="p-2 hover:text-gold hover:rotate-90 transition-all duration-300"
                aria-label="Close cart"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-ink/15">
              <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-mist">
                <TruckIcon className="w-4 h-4 text-gold" />
                {subtotal >= FREE_SHIP
                  ? "White-glove delivery unlocked"
                  : `${formatPrice(FREE_SHIP - subtotal)} from white-glove delivery`}
              </div>
              <div className="mt-2.5 h-1.5 bg-sand overflow-hidden">
                <motion.div
                  className="h-full bg-brass"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="w-20 h-20 border-2 border-ink/20 rounded-full flex items-center justify-center text-ink/40">
                    <CartIcon className="w-8 h-8" />
                  </span>
                  <p className="mt-6 font-display font-bold text-xl">The vault is empty</p>
                  <p className="mt-2 text-sm text-mist max-w-[250px]">
                    Choose an objet from the run and it will be reserved here.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-7 border-2 border-ink px-6 py-3 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-paper transition-all duration-300"
                  >
                    Browse the Shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {lines.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 border border-ink/15 bg-bone/60 p-3.5"
                      >
                        <div className="w-20 h-20 shrink-0 plate-dark flex items-center justify-center">
                          <img src={product.img} alt={product.name} className="blend-lighten w-full h-full object-contain p-1.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold">{product.category}</div>
                              <h4 className="font-display font-bold mt-0.5">{product.name}</h4>
                            </div>
                            <button
                              data-cursor
                              onClick={() => remove(product.id)}
                              className="text-mist hover:text-rust transition-colors"
                              aria-label={`Remove ${product.name}`}
                            >
                              <CloseIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-ink/25">
                              <button
                                data-cursor
                                onClick={() => setQty(product.id, qty - 1)}
                                className="px-2.5 py-1.5 hover:bg-ink hover:text-paper transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-sm tabular-nums font-medium">{qty}</span>
                              <button
                                data-cursor
                                onClick={() => setQty(product.id, qty + 1)}
                                className="px-2.5 py-1.5 hover:bg-ink hover:text-paper transition-colors"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="font-display font-bold tabular-nums">{formatPrice(product.price * qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t-2 border-ink px-6 py-5 bg-bone/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-mist">Subtotal</span>
                  <span className="font-display font-extrabold text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <button
                  data-cursor
                  onClick={checkout}
                  className="btn-sheen group mt-4 w-full bg-ink text-paper py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  Proceed to Concierge
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- toasts ---------------- */

function Toasts() {
  const { toasts } = useCart();
  return (
    <div className="fixed bottom-6 left-6 z-[88] flex flex-col gap-3 max-w-[330px]">
      <AnimatePresence>
        {(toasts as ToastItem[]).map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-brass bg-ink text-paper px-5 py-4 shadow-[0_12px_40px_rgba(23,21,16,0.4)]"
          >
            <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase text-goldlight font-medium">
              <DiamondIcon className="w-2 h-2 text-brass" />
              {t.title}
            </div>
            {t.body && <p className="mt-1.5 pl-[18px] text-xs text-paper/70">{t.body}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- footer ---------------- */

function Footer() {
  const { pushToast } = useCart();
  const giant = Array.from({ length: 6 }, () => "AURION");
  return (
    <footer className="relative bg-ink text-paper overflow-hidden">
      <div className="overflow-hidden border-b border-paper/10 py-4">
        <div className="flex w-max animate-marquee-slow">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
              {giant.map((w, i) => (
                <span key={`${half}-${i}`} className="flex items-center">
                  <span className="font-display font-extrabold text-7xl md:text-9xl text-outline-paper whitespace-nowrap px-8 tracking-tight">
                    {w}
                  </span>
                  <DiamondIcon className="w-4 h-4 text-brass" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[88rem] px-5 md:px-8 py-16 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="w-7 h-7 text-brass" />
            <span className="font-display font-extrabold text-2xl tracking-tight">
              AURION<span className="text-brass">.</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-paper/60 leading-relaxed text-sm">
            A maison of electronic objets, founded MMXIX. Numbered runs, champagne-gold
            finishes, and nothing ever re-made.
          </p>
          <div className="mt-7 flex items-center gap-3">
            {[
              { name: "Instagram", icon: <InstagramIcon className="w-4 h-4" /> },
              { name: "X", icon: <XSocialIcon className="w-4 h-4" /> },
              { name: "YouTube", icon: <YoutubeIcon className="w-4 h-4" /> },
            ].map((s) => (
              <button
                key={s.name}
                data-cursor
                onClick={() => pushToast(`${s.name} — coming soon`, "Our channels open with Run 08.")}
                aria-label={s.name}
                className="w-10 h-10 border border-paper/25 text-paper/70 flex items-center justify-center hover:text-ink hover:bg-brass hover:border-brass transition-all duration-300 hover:-translate-y-1"
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-brass">Boutique</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {["Audio", "Wearables", "Imaging", "Desk"].map((c) => (
              <li key={c}>
                <Link
                  to="/shop"
                  state={{ cat: c }}
                  className="group text-paper/60 hover:text-goldlight transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-brass transition-all duration-300" />
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="group text-paper/60 hover:text-goldlight transition-colors duration-300 flex items-center gap-2">
                <span className="w-0 group-hover:w-3 h-px bg-brass transition-all duration-300" />
                All Objets
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-brass">Maison</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { label: "Our Story", to: "/maison" },
              { label: "The Shop", to: "/shop" },
              { label: "Contact", to: "/contact" },
              { label: "FAQ", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="group text-paper/60 hover:text-goldlight transition-colors duration-300 flex items-center gap-2">
                  <span className="w-0 group-hover:w-3 h-px bg-brass transition-all duration-300" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-brass">Concierge</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/60">
            <li>concierge@aurion.example</li>
            <li>+41 22 555 01 19</li>
            <li className="text-paper/40 text-xs leading-relaxed">
              Rue du Rhône 12<br />Geneva, Switzerland
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-[88rem] px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-paper/40">
          <span>© {new Date().getFullYear()} AURION Maison d'Électronique</span>
          <span className="text-brass">Gold Standard — Run 07</span>
          <span>Concept boutique</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- layout ---------------- */

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Cursor />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Toasts />
      <div className="noise-overlay" aria-hidden />
    </div>
  );
}
