import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { promoDiscount, type Product, type Promo } from "../data/products";
import { getSettings, resolvePromo } from "./coupons";

export type CartLine = { product: Product; qty: number };
export type ToastItem = { id: number; title: string; body?: string };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  freeAt: number;
  promo: Promo | null;
  discount: number;
  add: (p: Product, qty?: number) => void;
  addMany: (products: Product[]) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  toasts: ToastItem[];
  pushToast: (title: string, body?: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = "aurion-cart-v3";
const PROMO_KEY = "aurion-promo-v3";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });
  const [promo, setPromo] = useState<Promo | null>(() => {
    try {
      const code = localStorage.getItem(PROMO_KEY);
      return code ? resolvePromo(code) : null;
    } catch {
      return null;
    }
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      if (promo) localStorage.setItem(PROMO_KEY, promo.code);
      else localStorage.removeItem(PROMO_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [lines, promo]);

  const pushToast = useCallback((title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const add = useCallback(
    (p: Product, qty = 1) => {
      setLines((ls) => {
        const found = ls.find((l) => l.product.id === p.id);
        if (found)
          return ls.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + qty } : l));
        return [...ls, { product: p, qty }];
      });
      pushToast("Added to your vault", `${p.name} — reserved in Run 07`);
    },
    [pushToast]
  );

  const addMany = useCallback(
    (products: Product[]) => {
      setLines((ls) => {
        let next = [...ls];
        for (const p of products) {
          const found = next.find((l) => l.product.id === p.id);
          next = found
            ? next.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l))
            : [...next, { product: p, qty: 1 }];
        }
        return next;
      });
      pushToast("The set is yours", "All three objets reserved — one seal, one box.");
    },
    [pushToast]
  );

  const remove = useCallback((id: string) => {
    setLines((ls) => ls.filter((l) => l.product.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((ls) =>
      qty <= 0
        ? ls.filter((l) => l.product.id !== id)
        : ls.map((l) => (l.product.id === id ? { ...l, qty } : l))
    );
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPromo(null);
  }, []);

  const applyPromo = useCallback(
    (code: string): { ok: boolean; message: string } => {
      const found = resolvePromo(code);
      if (!found) return { ok: false, message: "That code is not in the ledger." };
      setPromo(found);
      return { ok: true, message: found.label };
    },
    []
  );

  const removePromo = useCallback(() => setPromo(null), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const discount = promoDiscount(subtotal, promo);
    return {
      lines,
      count,
      subtotal,
      freeAt: getSettings().freeShipAt,
      promo,
      discount,
      add,
      addMany,
      remove,
      setQty,
      clear,
      applyPromo,
      removePromo,
      toasts,
      pushToast,
    };
  }, [lines, promo, add, addMany, remove, setQty, clear, applyPromo, removePromo, toasts, pushToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
