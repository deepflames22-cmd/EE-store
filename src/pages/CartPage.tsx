import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../store/CartContext";
import { SHIPPING_FLAT, formatPrice } from "../data/products";
import {
  ArrowRight,
  CartIcon,
  CloseIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  ShieldIcon,
  TagIcon,
  TruckIcon,
} from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";
import { getClaimedCodes } from "../store/coupons";

function ClaimedRow({ onApply }: { onApply: (code: string) => void }) {
  const claimed = getClaimedCodes();
  if (claimed.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-mist">Your clipped coupons</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {claimed.map((c) => (
          <button
            key={c}
            type="button"
            data-cursor
            onClick={() => onApply(c)}
            className="border-2 border-dashed border-gold/60 bg-brass/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gold hover:bg-brass hover:text-ink hover:border-brass transition-all duration-300"
          >
            {c} — apply
          </button>
        ))}
      </div>
    </div>
  );
}

function PromoBox() {
  const { promo, applyPromo, removePromo, pushToast } = useCart();
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const res = applyPromo(code);
    if (res.ok) {
      pushToast("Code accepted", `${res.message} — noted in the ledger.`);
      setErr(null);
      setCode("");
    } else {
      setErr(res.message);
    }
  };

  return (
    <div className="border-2 border-ink bg-paper p-5">
      <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-gold">
        <TagIcon className="w-4 h-4" /> Promotion code
      </div>
      {promo ? (
        <div className="mt-3 flex items-center justify-between gap-3 border-2 border-brass bg-brass/15 px-4 py-3">
          <div>
            <span className="font-display font-bold">{promo.code}</span>
            <span className="ml-3 text-sm text-mist">{promo.label}</span>
          </div>
          <button data-cursor onClick={removePromo} className="text-mist hover:text-rust transition-colors" aria-label="Remove code">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3">
          <ClaimedRow
            onApply={(c) => {
              const r = applyPromo(c);
              if (r.ok) pushToast("Coupon applied", `${c} — ${r.message}`);
              else setErr(r.message);
            }}
          />
          <div className={`flex border-2 transition-colors ${err ? "border-rust" : "border-ink/20 focus-within:border-ink"}`}>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErr(null);
              }}
              placeholder="GILD10"
              className="flex-1 min-w-0 bg-bone/50 px-4 py-3 font-mono tracking-[0.18em] uppercase focus:outline-none placeholder:text-mist/50 placeholder:normal-case"
              aria-label="Promotion code"
            />
            <button data-cursor type="submit" className="bg-ink text-paper px-5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-coal transition-colors">
              Apply
            </button>
          </div>
          {err && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{err}</p>}
          <p className="mt-2.5 text-[11px] text-mist">Try <button type="button" data-cursor onClick={() => setCode("GILD10")} className="font-mono text-gold hover:underline underline-offset-2">GILD10</button> — 10% off the run.</p>
        </form>
      )}
    </div>
  );
}

export default function CartPage() {
  const { lines, count, subtotal, discount, setQty, remove, pushToast, freeAt } = useCart();
  const navigate = useNavigate();

  const afterDiscount = subtotal - discount;
  const shipping = lines.length === 0 ? 0 : afterDiscount >= freeAt ? 0 : SHIPPING_FLAT;
  const total = afterDiscount + shipping;
  const progress = freeAt > 0 ? Math.min((afterDiscount / freeAt) * 100, 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24 min-h-[80vh]"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
              <span className="w-2 h-2 bg-brass" /> The Vault
            </motion.div>
            <LineMaskReveal
              className="mt-5 font-display font-extrabold tracking-tight leading-[0.9] text-5xl md:text-7xl"
              lines={[
                <>
                  {count} objet{count === 1 ? "" : "s"},
                </>,
                <>
                  <span className="italic font-medium text-gold">awaiting seal.</span>
                </>,
              ]}
            />
          </div>
          <Reveal delay={0.15}>
            <Link to="/shop" data-cursor className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase text-ink hover:text-gold transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1.5" />
              Continue browsing
            </Link>
          </Reveal>
        </div>

        {lines.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="mt-14 border-2 border-dashed border-ink/25 py-24 text-center">
              <span className="relative inline-block">
                <CartIcon className="w-14 h-14 text-gold" />
                <span className="absolute -inset-5 border border-brass/30 animate-spin-slow" />
              </span>
              <h2 className="mt-8 font-display font-extrabold text-4xl">The vault is empty.</h2>
              <p className="mt-3 text-mist max-w-sm mx-auto">Choose an objet from the run and it will be reserved here, serial and all.</p>
              <Link
                to="/shop"
                data-cursor
                className="group mt-9 inline-flex items-center gap-3 bg-ink text-paper px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors"
              >
                Enter the shop <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid lg:grid-cols-12 gap-8 items-start">
            {/* lines */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* delivery meter */}
              <Reveal>
                <div className="border-2 border-ink bg-bone/60 px-6 py-5">
                  <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-mist">
                    <TruckIcon className="w-5 h-5 text-gold" />
                    {shipping === 0
                      ? "White-glove delivery unlocked — complimentary"
                      : `${formatPrice(Math.max(0, freeAt - afterDiscount))} away from complimentary delivery`}
                  </div>
                  <div className="mt-3 h-1.5 bg-ink/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold to-brass"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </Reveal>

              <AnimatePresence initial={false}>
                {lines.map(({ product, qty }, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="border-2 border-ink bg-paper flex flex-col sm:flex-row group hover-lift"
                  >
                    <Link to={`/product/${product.id}`} data-cursor className="plate-dark sm:w-44 shrink-0 p-5 flex items-center justify-center border-b-2 sm:border-b-0 sm:border-r-2 border-ink" aria-label={product.name}>
                      <img src={product.img} alt={product.name} className="blend-lighten w-28 h-28 object-contain transition-transform duration-700 group-hover:scale-108" />
                    </Link>
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold">{product.category}</div>
                          <Link to={`/product/${product.id}`} data-cursor className="font-display font-bold text-xl hover:text-gold transition-colors">
                            {product.name}
                          </Link>
                          <div className="mt-1 text-sm text-mist tabular-nums">{formatPrice(product.price)} each</div>
                        </div>
                        <button
                          data-cursor
                          onClick={() => {
                            remove(product.id);
                            pushToast("Returned to the shelf", `${product.name} released from the vault.`);
                          }}
                          className="w-9 h-9 border-2 border-ink/20 flex items-center justify-center text-mist hover:border-rust hover:text-rust transition-all duration-300"
                          aria-label={`Remove ${product.name}`}
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center border-2 border-ink">
                          <button data-cursor onClick={() => setQty(product.id, qty - 1)} className="px-3.5 py-2 hover:bg-ink hover:text-paper transition-colors" aria-label="Decrease quantity">
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <motion.span key={qty} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="px-4 font-display font-bold tabular-nums">
                            {qty}
                          </motion.span>
                          <button data-cursor onClick={() => setQty(product.id, qty + 1)} className="px-3.5 py-2 hover:bg-ink hover:text-paper transition-colors" aria-label="Increase quantity">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-2xl tabular-nums">{formatPrice(product.price * qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* summary */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-5">
              <Reveal delay={0.1}>
                <div className="border-2 border-ink bg-paper">
                  <div className="px-6 py-5 border-b-2 border-ink flex items-center justify-between">
                    <span className="font-display font-extrabold text-xl">Ledger</span>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-mist">Run 07</span>
                  </div>
                  <div className="px-6 py-5 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-mist">Subtotal</span><span className="tabular-nums">{formatPrice(subtotal)}</span></div>
                    {discount > 0 && (
                      <div className="flex justify-between text-gold font-medium">
                        <span>Promotion</span><span className="tabular-nums">−{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-mist">Delivery</span>
                      <span className="tabular-nums">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t-2 border-ink pt-4">
                      <span className="font-mono text-[10px] tracking-[0.24em] uppercase">Total</span>
                      <motion.span key={total} initial={{ scale: 1.12 }} animate={{ scale: 1 }} className="font-display font-extrabold text-3xl tabular-nums">
                        {formatPrice(total)}
                      </motion.span>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <button
                      data-cursor
                      onClick={() => navigate("/checkout")}
                      className="btn-sheen group w-full bg-ink text-paper py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center justify-center gap-3"
                    >
                      Proceed to checkout <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                    <p className="mt-3 text-center font-mono text-[9px] tracking-[0.2em] uppercase text-mist">
                      Duties & engraving settled at checkout
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <PromoBox />
              </Reveal>

              <Reveal delay={0.24}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-ink/15 bg-bone/50 p-4 flex items-center gap-3">
                    <ShieldIcon className="w-5 h-5 text-gold shrink-0" />
                    <span className="text-xs text-mist">Repair for life, on every serial</span>
                  </div>
                  <div className="border border-ink/15 bg-bone/50 p-4 flex items-center gap-3">
                    <PackageIcon className="w-5 h-5 text-gold shrink-0" />
                    <span className="text-xs text-mist">30 days to change your mind</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
