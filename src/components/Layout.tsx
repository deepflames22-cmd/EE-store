import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import Toasts from "./Toasts";
import Cursor from "./Cursor";
import ChatWidget from "./ChatWidget";
import { PageVeil } from "./Loader";
import { ArrowRight, ArrowUpRight, CartIcon, CloseIcon, LogoMark, UserIcon } from "./Icons";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/maison", label: "Maison" },
  { to: "/contact", label: "Contact" },
  { to: "/dashboard", label: "Dashboard" },
];

function Nav() {
  const { count } = useCart();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => setMenu(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 ${
          scrolled ? "bg-paper/90 backdrop-blur-md border-b-2 border-ink py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[88rem] px-5 md:px-8 flex items-center justify-between gap-6">
          <Link to="/" data-cursor className="flex items-center gap-2.5 group" aria-label="AURION home">
            <LogoMark className="w-6 h-6 text-gold transition-transform duration-700 group-hover:rotate-[360deg]" />
            <span className="font-display font-extrabold tracking-[0.28em] text-lg">AURION</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-cursor
                className={({ isActive }) =>
                  `link-rule font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                    isActive ? "active text-ink" : "text-mist hover:text-ink"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              data-cursor
              onClick={() => navigate(user ? "/profile" : "/auth")}
              aria-label={user ? "Your profile" : "Sign in"}
              className="hidden sm:flex items-center gap-2 border-2 border-ink px-3.5 py-2 hover:bg-ink hover:text-paper transition-all duration-300"
            >
              <UserIcon className="w-4 h-4" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase max-w-[90px] truncate">
                {user ? user.name.split(" ")[0] : "Sign in"}
              </span>
            </button>
            <Link
              to="/cart"
              data-cursor
              className="relative bg-ink text-paper p-2.5 hover:bg-coal transition-colors duration-300"
              aria-label={`Cart, ${count} items`}
            >
              <CartIcon className="w-5 h-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-brass text-ink text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums animate-badge-pop border-2 border-paper"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              data-cursor
              onClick={() => setMenu(true)}
              className="md:hidden flex flex-col gap-1.5 p-2.5"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-ink" />
              <span className="block w-4 h-0.5 bg-gold ml-auto" />
              <span className="block w-6 h-0.5 bg-ink" />
            </button>
          </div>
        </div>
        <div
          className="absolute bottom-[-2px] left-0 h-[2px] bg-brass transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink text-paper flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="flex items-center gap-2.5 font-display font-extrabold tracking-[0.28em]">
                <LogoMark className="w-5 h-5 text-brass" /> AURION
              </span>
              <button onClick={() => setMenu(false)} className="p-2 text-brass" aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {[
                { to: "/", label: "Home" },
                ...NAV,
                { to: "/cart", label: "Cart" },
                { to: user ? "/profile" : "/auth", label: user ? "Profile" : "Sign in" },
              ].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    data-cursor
                    className="group flex items-baseline gap-5 py-3 border-b border-paper/10"
                  >
                    <span className="font-mono text-[10px] tracking-[0.24em] text-brass">0{i + 1}</span>
                    <span className="font-display font-extrabold text-4xl tracking-tight group-hover:text-brass group-hover:translate-x-2 transition-all duration-300">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 pb-8 font-mono text-[10px] tracking-[0.3em] uppercase text-paper/40">
              Electronics, elevated — Run 07
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  const { pushToast } = useCart();
  const year = new Date().getFullYear();

  const social = (name: string) => pushToast(`${name} is by invitation`, "The maison keeps its circles small.");

  const { site } = useSite();

  const cols: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
    {
      title: "Disciplines",
      links: [
        { label: "All objets", to: "/shop" },
        ...site.categories.map((c) => ({ label: c.name, to: `/category/${encodeURIComponent(c.name)}` })),
      ],
    },
    {
      title: "Labels",
      links: site.brands.map((b) => ({ label: b.name, to: `/brand/${b.id}` })),
    },
    {
      title: "Maison",
      links: [
        { label: "Our story", to: "/maison" },
        { label: "Concierge", to: "/contact" },
        { label: "The console", to: "/dashboard" },
      ],
    },
    {
      title: "Client",
      links: [
        { label: "Cart", to: "/cart" },
        { label: "Profile", to: "/profile" },
        { label: "Sign in", to: "/auth" },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-paper overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-5 md:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="w-7 h-7 text-brass" />
              <span className="font-display font-extrabold tracking-[0.28em] text-xl">AURION</span>
            </div>
            <p className="mt-5 max-w-sm text-paper/50 leading-relaxed text-sm">
              A maison of electronic objets, founded MMXIX. Numbered runs, hand-finished
              in champagne gold, nothing ever re-made.
            </p>
            <div className="mt-7 flex gap-2.5">
              {["Instagram", "X", "YouTube"].map((s) => (
                <button
                  key={s}
                  data-cursor
                  onClick={() => social(s)}
                  className="border border-paper/20 px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-paper/60 hover:bg-brass hover:text-ink hover:border-brass transition-all duration-300 hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-brass">{c.title}</h4>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      data-cursor
                      className="group inline-flex items-center gap-0 text-paper/60 hover:text-brass transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-brass transition-all duration-300 mr-0 group-hover:mr-2" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-1 flex md:flex-col items-center md:items-end justify-between gap-4">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-paper/30 [writing-mode:vertical-rl] hidden md:block">
              Rue du Rhône 12, Geneva
            </span>
            <Link
              to="/"
              data-cursor
              aria-label="Back to top"
              className="w-12 h-12 border border-paper/25 flex items-center justify-center text-brass hover:bg-brass hover:text-ink hover:border-brass transition-all duration-300"
            >
              <ArrowUpRight className="w-5 h-5 -rotate-45" />
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[9px] tracking-[0.24em] uppercase text-paper/35">
          <span>© {year} AURION Maison d'Électronique</span>
          <span className="flex gap-6">
            <span>Visa</span>
            <span>Amex</span>
            <span>Wire</span>
            <span className="text-brass">Gold Standard</span>
          </span>
          <span>Concept boutique — every serial a promise</span>
        </div>
      </div>

      {/* giant outline wordmark */}
      <div className="overflow-hidden select-none pointer-events-none" aria-hidden>
        <div className="flex w-max animate-marquee-slow">
          {[0, 1].map((half) => (
            <span key={half} className="flex shrink-0 items-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="font-display font-extrabold text-[22vw] leading-[0.8] text-outline-paper pr-10">
                  AURION
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { toasts } = useCart();
  const first = useRef(true);
  const [veilKey, setVeilKey] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVeilKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const isConsole = location.pathname.startsWith("/dashboard");

  return (
    <div className={`min-h-screen text-ink selection:bg-brass ${isConsole ? "bg-ink" : "bg-paper"}`}>
      <Cursor />
      <div className="noise-overlay" aria-hidden />
      <PageVeil routeKey={veilKey} />
      {!isConsole && <Nav />}
      <main>{children}</main>
      {!isConsole && <Footer />}
      {!isConsole && <ChatWidget />}
      <Toasts toasts={toasts} />
    </div>
  );
}

export { ArrowRight };
