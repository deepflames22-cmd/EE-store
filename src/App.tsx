import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee, { OutlineMarquee } from "./components/Marquee";
import Collection from "./components/Collection";
import Showcase from "./components/Showcase";
import Craft from "./components/Craft";
import Stats from "./components/Stats";
import Categories from "./components/Categories";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CartDrawer, { type CartLine } from "./components/CartDrawer";
import Toasts, { type ToastItem } from "./components/Toasts";
import { PRODUCTS, type Category, type Product } from "./data/products";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const toastId = useRef(0);

  const pushToast = useCallback((title: string, body?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  const addToCart = useCallback(
    (p: Product) => {
      setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
      pushToast("Reserved in your vault", `${p.name} — added to cart`);
    },
    [pushToast]
  );

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const removeLine = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }, []);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? { product, qty } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [cart]
  );

  const cartCount = useMemo(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart]);

  const selectCategory = useCallback((c: Category) => setFilter(c), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-ink text-ivory min-h-screen">
        <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>

        <Cursor />
        <div className="noise-overlay" aria-hidden />

        <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        <main>
          <Hero />
          <Marquee />
          <Collection filter={filter} onFilter={setFilter} onAdd={addToCart} />
          <Showcase onAdd={addToCart} />
          <Craft />
          <Stats />
          <Categories onSelect={selectCategory} />
          <Testimonials />
          <OutlineMarquee />
          <Newsletter />
        </main>

        <Footer
          onSelectCategory={selectCategory}
          onSocial={(name) => pushToast(`${name} — coming soon`, "The maison is polishing its profiles.")}
        />

        <CartDrawer
          open={cartOpen}
          lines={lines}
          onClose={() => setCartOpen(false)}
          onSetQty={setQty}
          onRemove={removeLine}
          onCheckout={() =>
            pushToast("Concierge notified", "Checkout is a private affair — our team will be in touch.")
          }
        />
        <Toasts toasts={toasts} />
      </div>
    </MotionConfig>
  );
}
