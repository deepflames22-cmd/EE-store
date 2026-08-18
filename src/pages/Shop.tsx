import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice, type Product } from "../data/products";
import { useSite } from "../store/site";
import { CloseIcon, DiamondIcon, SearchIcon, TagIcon } from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";
import { ShopPeekAd } from "../components/ads";
import ProductCardGrid from "../components/ProductCardGrid";

type Sort = "featured" | "price-asc" | "price-desc" | "name" | "brand";

const SORTS: Array<{ id: Sort; label: string }> = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
  { id: "name", label: "A — Z" },
  { id: "brand", label: "Brand" },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      data-cursor
      type="button"
      onClick={() => onChange(!on)}
      className={`flex items-center gap-2.5 px-4 py-2.5 border-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-300 ${
        on ? "bg-ink text-brass border-ink" : "border-ink/25 text-mist hover:border-ink hover:text-ink"
      }`}
      aria-pressed={on}
    >
      <span className={`w-2 h-2 rounded-full transition-colors ${on ? "bg-brass" : "bg-ink/20"}`} />
      {label}
    </button>
  );
}

export default function Shop() {
  const location = useLocation();
  const { site, products } = useSite();
  const initialCat = (location.state as { cat?: string } | null)?.cat ?? "All";

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>(initialCat);
  const [brands, setBrands] = useState<string[]>([]);
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [dealsOnly, setDealsOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");

  const catNames = ["All", ...site.categories.map((c) => c.name)];
  const brandNames = useMemo(
    () => Array.from(new Set([...site.brands.map((b) => b.name), ...products.map((p) => p.brand)])),
    [site.brands, products]
  );
  const { minPrice, maxPrice } = useMemo(() => {
    if (!products.length) return { minPrice: 0, maxPrice: 0 };
    return {
      minPrice: Math.min(...products.map((p) => p.price)),
      maxPrice: Math.max(...products.map((p) => p.price)),
    };
  }, [products]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minP === "" ? -Infinity : Number(minP);
    const max = maxP === "" ? Infinity : Number(maxP);
    const filtered = products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (p.price < min || p.price > max) return false;
      if (dealsOnly && !p.was) return false;
      if (newOnly && p.tag !== "New") return false;
      if (q && !`${p.name} ${p.brand} ${p.category} ${p.blurb} ${p.specs.join(" ")}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "brand":
        sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.price - b.price);
        break;
      default:
        sorted.sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)));
    }
    return sorted;
  }, [products, search, cat, brands, minP, maxP, dealsOnly, newOnly, sort]);

  const toggleBrand = (b: string) =>
    setBrands((bs) => (bs.includes(b) ? bs.filter((x) => x !== b) : [...bs, b]));

  const activeCount =
    (cat !== "All" ? 1 : 0) +
    brands.length +
    (minP !== "" ? 1 : 0) +
    (maxP !== "" ? 1 : 0) +
    (dealsOnly ? 1 : 0) +
    (newOnly ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setCat("All");
    setBrands([]);
    setMinP("");
    setMaxP("");
    setDealsOnly(false);
    setNewOnly(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
                <span className="w-2 h-2 bg-brass" /> Run 07 — The Shop
              </div>
            </Reveal>
            <LineMaskReveal
              className="mt-4 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.8rem,7vw,6rem)]"
              lines={[
                <>
                  {site.shop.headline} <span className="italic font-medium text-gold">{site.shop.accent}</span>
                </>,
              ]}
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-mist leading-relaxed">{site.shop.sub}</p>
          </Reveal>
        </div>

        {/* filter deck */}
        <Reveal delay={0.2}>
          <div className="mt-12 border-2 border-ink bg-bone/60">
            {/* row 1: search + sort */}
            <div className="flex flex-col md:flex-row gap-3 p-4 border-b-2 border-ink">
              <div className="flex-1 flex items-center gap-3 border-2 border-ink/25 focus-within:border-ink bg-paper px-4 transition-colors">
                <SearchIcon className="w-4 h-4 text-gold shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the register — name, brand, spec…"
                  className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder:text-mist/60"
                  aria-label="Search products"
                />
                {search && (
                  <button data-cursor onClick={() => setSearch("")} aria-label="Clear search" className="text-mist hover:text-ink transition-colors">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <label className="relative md:w-52">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="w-full appearance-none bg-paper border-2 border-ink/25 pl-4 pr-9 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink focus:outline-none focus:border-ink cursor-pointer"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 12 8" className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m1 1.5 5 5 5-5" strokeLinecap="round" />
                </svg>
              </label>
            </div>

            {/* row 2: categories */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3.5 border-b border-ink/15">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-mist w-20 shrink-0">Discipline</span>
              {catNames.map((c) => (
                <button
                  key={c}
                  data-cursor
                  onClick={() => setCat(c)}
                  className={`px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase border-2 transition-all duration-300 ${
                    cat === c ? "bg-ink text-brass border-ink" : "border-ink/20 text-mist hover:border-ink hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* row 3: brands */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3.5 border-b border-ink/15">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-mist w-20 shrink-0">Brand</span>
              {brandNames.map((b) => (
                <button
                  key={b}
                  data-cursor
                  onClick={() => toggleBrand(b)}
                  className={`px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase border-2 transition-all duration-300 flex items-center gap-2 ${
                    brands.includes(b) ? "bg-brass text-ink border-brass" : "border-ink/20 text-mist hover:border-ink hover:text-ink"
                  }`}
                >
                  <DiamondIcon className="w-1.5 h-1.5" />
                  {b}
                </button>
              ))}
            </div>

            {/* row 4: price + toggles */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-mist w-20 shrink-0">Price</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minP}
                  onChange={(e) => setMinP(e.target.value)}
                  placeholder={String(minPrice)}
                  className="w-24 bg-paper border-2 border-ink/25 focus:border-ink px-3 py-2 font-mono text-xs tabular-nums focus:outline-none transition-colors"
                  aria-label="Minimum price"
                />
                <span className="text-mist">—</span>
                <input
                  type="number"
                  min={0}
                  value={maxP}
                  onChange={(e) => setMaxP(e.target.value)}
                  placeholder={String(maxPrice)}
                  className="w-24 bg-paper border-2 border-ink/25 focus:border-ink px-3 py-2 font-mono text-xs tabular-nums focus:outline-none transition-colors"
                  aria-label="Maximum price"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Toggle on={dealsOnly} onChange={setDealsOnly} label="On deal" />
                <Toggle on={newOnly} onChange={setNewOnly} label="New arrivals" />
              </div>
              <div className="ml-auto flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist tabular-nums">
                  {String(list.length).padStart(2, "0")} objets
                </span>
                {activeCount > 0 && (
                  <button
                    data-cursor
                    onClick={clearAll}
                    className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-rust hover:text-ink transition-colors"
                  >
                    <CloseIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
                    Clear ({activeCount})
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* active pills */}
        {activeCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cat !== "All" && (
              <FilterPill label={cat} onClear={() => setCat("All")} />
            )}
            {brands.map((b) => (
              <FilterPill key={b} label={b} onClear={() => toggleBrand(b)} />
            ))}
            {(minP !== "" || maxP !== "") && (
              <FilterPill
                label={`${minP || minPrice} — ${maxP || maxPrice}`}
                onClear={() => {
                  setMinP("");
                  setMaxP("");
                }}
              />
            )}
            {dealsOnly && <FilterPill label="On deal" onClear={() => setDealsOnly(false)} />}
            {newOnly && <FilterPill label="New arrivals" onClear={() => setNewOnly(false)} />}
            {search.trim() && <FilterPill label={`“${search.trim()}”`} onClear={() => setSearch("")} />}
          </div>
        )}

        {/* grid */}
        {list.length > 0 ? (
          <ProductCardGrid key={`${cat}-${sort}-${activeCount}`} items={list} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 border-2 border-dashed border-ink/25 p-14 text-center"
          >
            <TagIcon className="w-8 h-8 text-gold mx-auto" />
            <p className="mt-4 font-display font-bold text-2xl">Nothing in the register matches.</p>
            <p className="mt-2 text-mist">Loosen a filter or two — the run is wider than it looks.</p>
            <button
              data-cursor
              onClick={clearAll}
              className="mt-6 bg-ink text-paper px-7 py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase hover:bg-coal transition-colors"
            >
              Reset every filter
            </button>
          </motion.div>
        )}

        {/* footnote */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-mist">
            <span>{list.length} of {products.length} objets shown · {formatPrice(minPrice)} — {formatPrice(maxPrice)}</span>
            <span>Concierge delivery worldwide</span>
          </div>
        </Reveal>
      </div>
      <ShopPeekAd />
    </motion.div>
  );
}

function FilterPill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      data-cursor
      onClick={onClear}
      className="group flex items-center gap-2 bg-ink text-paper pl-3.5 pr-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase hover:bg-rust transition-colors duration-300"
    >
      {label}
      <CloseIcon className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" />
    </button>
  );
}

export type { Product as _ShopProduct };
