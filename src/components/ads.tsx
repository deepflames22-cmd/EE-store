import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, formatPrice } from "../data/products";
import { ArrowRight, CloseIcon, CopyIcon, CheckIcon, TagIcon, TimerIcon } from "./Icons";
import { OrbitBadge } from "./shared";
import { useCart } from "../store/CartContext";

const TAKEOVER_KEY = "aurion-takeover-v2";
const PEEK_KEY = "aurion-peek-v2";

function sessionHas(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return true;
  }
}
function markSession(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage unavailable */
  }
}

/* ---------- full ad takeover on home ---------- */

export function AdTakeover() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { pushToast } = useCart();
  const hero = PRODUCTS.find((p) => p.id === "meridian-s") ?? PRODUCTS[1];

  useEffect(() => {
    if (sessionHas(TAKEOVER_KEY)) return;
    const t = window.setTimeout(() => setShow(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    markSession(TAKEOVER_KEY);
    setShow(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("GILD10");
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    pushToast("Code copied — GILD10", "Paste it in the vault ledger.");
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[86] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 48, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl border-2 border-ink bg-paper shadow-[14px_14px_0_rgba(23,21,16,0.55)]"
            role="dialog"
            aria-modal="true"
            aria-label="Run 07 promotion"
          >
            <button
              data-cursor
              onClick={close}
              aria-label="Close advertisement"
              className="absolute -top-4 -right-4 z-10 w-11 h-11 bg-ink text-paper border-2 border-paper flex items-center justify-center hover:bg-rust hover:rotate-90 transition-all duration-300"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            {/* top ticker */}
            <div className="bg-ink text-brass overflow-hidden border-b-2 border-ink">
              <div className="flex w-max animate-marquee-fast py-2">
                {[0, 1].map((h) => (
                  <span key={h} className="flex shrink-0 font-mono text-[9px] tracking-[0.3em] uppercase whitespace-nowrap" aria-hidden={h === 1}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} className="pr-8">
                        House bulletin · Run 07 boarding · GILD10 = ten percent off · this week only ·
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-5">
              {/* image side */}
              <div className="relative plate-dark md:col-span-2 border-b-2 md:border-b-0 md:border-r-2 border-ink overflow-hidden">
                <img
                  src={hero.img}
                  alt={hero.name}
                  className="blend-lighten relative mx-auto w-[76%] my-8 animate-float drop-shadow-[0_26px_44px_rgba(201,162,75,0.3)]"
                />
                <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase text-goldlight bg-ink/70 border border-brass/40 px-2.5 py-1.5">
                  AD · Nº 07
                </span>
                <span className="absolute bottom-4 left-4 font-display font-bold text-paper">
                  {hero.name} <span className="text-paper/50 font-body font-normal text-sm">— {formatPrice(hero.price)}</span>
                </span>
                <div className="absolute -bottom-8 -right-8 opacity-50 pointer-events-none" aria-hidden>
                  <OrbitBadge light size={150} text="TEN PERCENT OFF • TEN PERCENT OFF • " />
                </div>
              </div>

              {/* copy side */}
              <div className="md:col-span-3 p-7 md:p-10">
                <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.28em] uppercase text-gold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                  </span>
                  This week only
                </div>
                <h2 className="mt-4 font-display font-extrabold tracking-tight leading-[0.95] text-3xl md:text-5xl">
                  Ten percent off the <span className="italic font-medium text-gold">golden run.</span>
                </h2>
                <p className="mt-4 text-mist leading-relaxed">
                  Every objet in Run 07 — headphones, timepieces, drones — dressed down by a
                  tenth while the house re-gilds the atelier. One code, no asterisks.
                </p>

                <div className="mt-6 flex items-stretch border-2 border-dashed border-gold bg-brass/10">
                  <div className="flex-1 px-5 py-3.5">
                    <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-mist">Promotion code</div>
                    <div className="font-display font-extrabold text-2xl tracking-[0.18em] text-gold">GILD10</div>
                  </div>
                  <button
                    data-cursor
                    onClick={copy}
                    className={`px-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase border-l-2 border-dashed border-gold transition-colors ${
                      copied ? "bg-pine text-paper" : "hover:bg-brass hover:text-ink"
                    }`}
                  >
                    {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="mt-7 flex flex-wrap gap-3.5">
                  <button
                    data-cursor
                    onClick={() => {
                      close();
                      navigate("/shop");
                    }}
                    className="btn-sheen group bg-ink text-paper px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-coal transition-colors flex items-center gap-3"
                  >
                    Enter the shop
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                  <button
                    data-cursor
                    onClick={close}
                    className="px-6 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase text-mist hover:text-ink transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- flash-drop peek ad on shop ---------- */

export function ShopPeekAd() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const deal = PRODUCTS.find((p) => p.id === "obelisk") ?? PRODUCTS[3];

  useEffect(() => {
    if (sessionHas(PEEK_KEY)) return;
    const t = window.setTimeout(() => setShow(true), 3600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setShow(false), 16000);
    return () => window.clearTimeout(t);
  }, [show]);

  const close = () => {
    markSession(PEEK_KEY);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-5 z-[84] w-[19rem] max-w-[calc(100vw-2.5rem)]"
          role="complementary"
          aria-label="Flash drop advertisement"
        >
          <div className="relative plate-dark border-2 border-brass shadow-[10px_10px_0_rgba(23,21,16,0.45)]">
            <button
              data-cursor
              onClick={close}
              aria-label="Dismiss flash drop"
              className="absolute top-2.5 right-2.5 text-paper/50 hover:text-brass hover:rotate-90 transition-all duration-300"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-5 pt-4 font-mono text-[9px] tracking-[0.26em] uppercase text-brass">
              <TimerIcon className="w-3.5 h-3.5" /> Flash drop · ends tonight
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-20 h-20 shrink-0 border border-brass/40 bg-ink p-1.5">
                <img src={deal.img} alt={deal.name} className="blend-lighten w-full h-full object-contain animate-float" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-paper text-lg leading-tight">{deal.name}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-goldlight font-medium tabular-nums">{formatPrice(deal.price)}</span>
                  {deal.was && <span className="text-paper/40 line-through text-xs tabular-nums">{formatPrice(deal.was)}</span>}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-brass">
                  <TagIcon className="w-3 h-3" /> +10% more with GILD10
                </div>
              </div>
            </div>
            <button
              data-cursor
              onClick={() => {
                close();
                navigate(`/product/${deal.id}`);
              }}
              className="btn-sheen group w-full bg-brass text-ink py-3 font-mono text-[10px] tracking-[0.26em] uppercase font-medium hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
            >
              Claim the drop <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
