import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../data/products";

export type CartLine = { product: Product; qty: number };
export type ToastItem = { id: number; title: string; body?: string };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toasts: ToastItem[];
  pushToast: (title: string, body?: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = "aurion-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const pushToast = useCallback((title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
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

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    return { lines, count, subtotal, open, setOpen, add, remove, setQty, clear, toasts, pushToast };
  }, [lines, open, add, remove, setQty, clear, toasts, pushToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
