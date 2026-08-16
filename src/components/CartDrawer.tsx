import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, type Product } from "../data/products";
import { ArrowRight, CartIcon, CloseIcon, MinusIcon, PlusIcon, TruckIcon } from "./Icons";

export type CartLine = { product: Product; qty: number };

const FREE_SHIP = 500;

export default function CartDrawer({
  open,
  lines,
  onClose,
  onSetQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const progress = Math.min((subtotal / FREE_SHIP) * 100, 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[85] bg-ink/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[86] w-full max-w-md bg-coal border-l border-gold/20 flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-7 py-6 border-b border-gold/12">
              <h3 className="font-display text-xl text-ivory flex items-center gap-3">
                <CartIcon className="w-5 h-5 text-gold" />
                Your Vault
                <span className="text-xs text-dim tracking-[0.2em] uppercase">
                  {lines.reduce((s, l) => s + l.qty, 0)} items
                </span>
              </h3>
              <button
                data-cursor
                onClick={onClose}
                className="p-2 text-fog hover:text-gold hover:rotate-90 transition-all duration-300"
                aria-label="Close cart"
              >
                <CloseIcon />
              </button>
            </div>

            {/* shipping meter */}
            <div className="px-7 py-4 border-b border-gold/12">
              <div className="flex items-center gap-2.5 text-[10px] tracking-[0.22em] uppercase text-fog">
                <TruckIcon className="w-4 h-4 text-gold" />
                {subtotal >= FREE_SHIP
                  ? "Complimentary white-glove delivery unlocked"
                  : `${formatPrice(FREE_SHIP - subtotal)} from white-glove delivery`}
              </div>
              <div className="mt-2.5 h-1 bg-umber overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-golddeep to-goldlight"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="w-20 h-20 border border-gold/20 rounded-full flex items-center justify-center text-gold/60">
                    <CartIcon className="w-8 h-8" />
                  </span>
                  <p className="mt-6 font-display text-xl text-ivory">The vault is empty</p>
                  <p className="mt-2 text-sm text-fog font-light max-w-[240px]">
                    Choose an objet from the collection and it will be reserved here.
                  </p>
                  <button
                    data-cursor
                    onClick={onClose}
                    className="mt-7 border border-gold/40 text-gold px-6 py-3 text-[11px] tracking-[0.26em] uppercase hover:bg-gold hover:text-ink transition-all duration-300"
                  >
                    Browse the Collection
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence initial={false}>
                    {lines.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex gap-4 border border-gold/10 bg-ink/60 p-4"
                      >
                        <div className="w-20 h-20 shrink-0 bg-coal border border-gold/10 flex items-center justify-center">
                          <img src={product.img} alt={product.name} className="blend-lighten w-full h-full object-contain p-1.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[9px] tracking-[0.26em] uppercase text-gold">{product.category}</div>
                              <h4 className="font-display text-ivory mt-0.5">{product.name}</h4>
                            </div>
                            <button
                              data-cursor
                              onClick={() => onRemove(product.id)}
                              className="text-dim hover:text-[#d97b63] transition-colors"
                              aria-label={`Remove ${product.name}`}
                            >
                              <CloseIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-gold/20">
                              <button
                                data-cursor
                                onClick={() => onSetQty(product.id, qty - 1)}
                                className="px-2.5 py-1.5 text-fog hover:text-gold hover:bg-gold/10 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-sm text-ivory tabular-nums">{qty}</span>
                              <button
                                data-cursor
                                onClick={() => onSetQty(product.id, qty + 1)}
                                className="px-2.5 py-1.5 text-fog hover:text-gold hover:bg-gold/10 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-goldlight text-sm tabular-nums">{formatPrice(product.price * qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-gold/15 px-7 py-6 bg-ink/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="tracking-[0.24em] uppercase text-[11px] text-fog">Subtotal</span>
                  <span className="font-display text-2xl text-goldlight tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1.5 text-[10px] tracking-[0.18em] uppercase text-dim">
                  Duties & engraving settled at concierge checkout
                </p>
                <button
                  data-cursor
                  onClick={onCheckout}
                  className="btn-sheen group mt-5 w-full bg-gold text-ink py-4 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-goldlight transition-colors duration-300 flex items-center justify-center gap-3"
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
