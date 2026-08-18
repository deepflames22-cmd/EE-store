import { createElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  apiBrands,
  apiCategories,
  apiConfigured,
  apiDeleteBrand,
  apiDeleteCategory,
  apiDeleteProduct,
  apiProducts,
  apiSaveBrand,
  apiSaveCategory,
  apiSaveProduct,
} from "./api";
import {
  BUNDLE,
  IMG,
  LIFESTYLE_IMG,
  MARQUEE_ITEMS,
  PRODUCTS,
  TESTIMONIALS,
  type Category,
  type Product,
} from "../data/products";

/* ---------------- types ---------------- */

export type ShippingOption = { id: string; name: string; cost: number; eta: string; note: string };
export type FaqItem = { q: string; a: string };
export type QuoteItem = { quote: string; name: string; role: string };
export type ServiceItem = { icon: "truck" | "shield" | "tag" | "globe"; title: string; note: string };
export type StatItem = { value: number; suffix: string; decimals: number; label: string };
export type CraftPoint = { k: string; v: string };

export type BrandMeta = {
  id: string;
  name: string;
  tagline: string;
  est: string;
  story: string;
  image: string;
};

export type CategoryMeta = {
  name: Category;
  description: string;
  image: string;
};

export type SiteConfig = {
  brand: { name: string; tagline: string; est: string; footerNote: string; press: string[] };
  hero: { kicker: string; line1: string; line2: string; accent: string; sub: string; ctaShop: string; ctaView: string; badge: string; image?: string };
  marquee: string[];
  sections: {
    promoCountdown: boolean;
    rail: boolean;
    spotlight: boolean;
    disciplines: boolean;
    bundle: boolean;
    craft: boolean;
    services: boolean;
    stats: boolean;
    voices: boolean;
    privateList: boolean;
    ads: { takeover: boolean; peek: boolean; peekId: string };
  };
  rail: { kicker: string; title: string; accent: string };
  promo: { title: string; accent: string; sub: string; code: string; hours: number };
  spotlight: { productId: string; badge: string; note: string };
  disciplines: Record<Category, { blurb: string; note: string; feats: string[] }>;
  bundle: { save: number; note: string; title: string; accent: string; sub: string };
  craft: { kicker: string; title: string; accent: string; copy: string; points: CraftPoint[]; figLabel: string; image?: string };
  services: { title: string; accent: string; items: ServiceItem[] };
  stats: { items: StatItem[] };
  voices: { title: string; accent: string; quotes: QuoteItem[] };
  privateList: { title: string; accent: string; sub: string; members: string };
  shop: { headline: string; accent: string; sub: string };
  shipping: { flat: number; freeAt: number; options: ShippingOption[] };
  showroom: { address: string; hours: string; phone: string; email: string };
  faq: FaqItem[];
  ai: { persona: string; tone: string };
  maintenance: { enabled: boolean; title: string; note: string };
  productOverrides: Record<string, Partial<Product>>;
  catalog: Product[];
  brands: BrandMeta[];
  categories: CategoryMeta[];
};

/* ---------------- defaults ---------------- */

export const DEFAULT_SITE: SiteConfig = {
  brand: {
    name: "AURION",
    tagline: "Maison d'Électronique",
    est: "MMXIX",
    footerNote:
      "A maison of electronic objets, founded MMXIX. Numbered runs, hand-finished in champagne gold, nothing ever re-made.",
    press: ["Monocle", "Dezeen", "Wired", "Hypebeast"],
  },
  hero: {
    kicker: "Run 07 — Now boarding",
    line1: "Electronics,",
    line2: "dressed in",
    accent: "gold.",
    sub: "A maison of electronic objets — headphones, timepieces, drones — built in numbered runs and finished by hand in champagne gold.",
    ctaShop: "Enter the Shop",
    ctaView: "View in 360°",
    badge: "AD · Nº 07",
  },
  marquee: [...MARQUEE_ITEMS],
  sections: {
    promoCountdown: true,
    rail: true,
    spotlight: true,
    disciplines: true,
    bundle: true,
    craft: true,
    services: true,
    stats: true,
    voices: true,
    privateList: true,
    ads: { takeover: true, peek: true, peekId: "obelisk" },
  },
  rail: { kicker: "The Current Run", title: "Seven objets,", accent: "one metal." },
  promo: {
    title: "The gilded hours",
    accent: "are numbered.",
    sub: "Take ten percent off everything in Run 07 while the counter runs. One code, every objet, no asterisks.",
    code: "GILD10",
    hours: 127,
  },
  spotlight: { productId: "meridian-s", badge: "Objet of the season", note: "This week only" },
  disciplines: {
    Audio: {
      blurb: "Sound, dressed in gold — over-ears, earbuds and a 360° column for the room.",
      note: "The house rule: if it plays music, it wears the coat.",
      feats: ["Adaptive ANC", "24-bit / 192kHz", "360° radiators"],
    },
    Wearables: {
      blurb: "Timepieces that compute — sapphire, gold cases, ten-day reserves.",
      note: "Worn daily, charged weekly, noticed constantly.",
      feats: ["Sapphire crystal", "10-day battery", "5ATM sealed"],
    },
    Imaging: {
      blurb: "Cameras and drones with gold-anodised plates and steady gimbals.",
      note: "The footage comes out the colour of the drone.",
      feats: ["8K gimbal", "f/1.8 primes", "4K 120fps"],
    },
    Desk: {
      blurb: "Instruments for the working surface — brass cores, silent tactiles.",
      note: "Weight is a feature. 2.1kg of intent.",
      feats: ["Hot-swap", "Tri-mode link", "Brass core"],
    },
  },
  bundle: {
    save: BUNDLE.save,
    note: BUNDLE.note,
    title: "The Travel",
    accent: "Set.",
    sub: "Headphones, earbuds and the column of sound — sealed in one lacquered case, numbered as a set.",
  },
  craft: {
    kicker: "The Atelier",
    title: "Machines, finished like",
    accent: "jewellery.",
    copy: "Every objet passes through eleven hands before it is sealed. Billet aluminium is machined, bead-blasted, then dressed in a 24-karat PVD coat the colour of late afternoon.",
    points: [
      { k: "24K PVD coat", v: "applied in a single pass, never painted" },
      { k: "Sapphire & brass", v: "glass that outlives the battery inside" },
      { k: "Numbered for life", v: "each serial engraved, registered, repairable" },
    ],
    figLabel: "Fig. 01 — Geneva atelier, 23:40",
  },
  services: {
    title: "What the house",
    accent: "guarantees.",
    items: [
      { icon: "truck", title: "White-glove delivery", note: "Insured, hand-carried, gloves on — complimentary above the threshold." },
      { icon: "shield", title: "Repair for life", note: "Every serial ever issued is serviced at the atelier, forever." },
      { icon: "tag", title: "30-day returns", note: "Change your mind; the serial is retired, never resold as new." },
      { icon: "globe", title: "Gold exchange", note: "Trade a retired objet toward the next run, at book value." },
    ],
  },
  stats: {
    items: [
      { value: 38, suffix: "", decimals: 0, label: "Countries served" },
      { value: 120, suffix: "K", decimals: 0, label: "Objets in the wild" },
      { value: 4.9, suffix: "", decimals: 1, label: "Owner rating" },
      { value: 24, suffix: "mo", decimals: 0, label: "Global warranty" },
    ],
  },
  voices: { title: "Owners,", accent: "quoted.", quotes: [...TESTIMONIALS] },
  privateList: {
    title: "First word on",
    accent: "Run 08.",
    sub: "One letter per season — first access, atelier invitations and the occasional one-of-one auction. No noise.",
    members: "4,208 members · unsubscribe in one click",
  },
  shop: {
    headline: "Every objet,",
    accent: "numbered.",
    sub: "Seven instruments across four disciplines. When a run sells through, it is never re-made.",
  },
  shipping: {
    flat: 25,
    freeAt: 500,
    options: [
      { id: "standard", name: "Courier Standard", cost: 25, eta: "5–7 working days", note: "Insured, tracked to the door" },
      { id: "whiteglove", name: "White-Glove", cost: 60, eta: "2–3 working days", note: "Hand-carried, gloves on" },
      { id: "pickup", name: "Atelier Pickup", cost: 0, eta: "Same day, Geneva", note: "Rue du Rhône 12, with coffee" },
    ],
  },
  showroom: {
    address: "Rue du Rhône 12, Geneva",
    hours: "Tue — Sat, 10:00 to 18:30",
    phone: "+41 22 555 01 19",
    email: "concierge@aurion.example",
  },
  faq: [
    { q: "How does numbered-run shipping work?", a: "Orders are sealed against the register and dispatched within five working days. Above the complimentary threshold, delivery is white-glove: insured, signature on receipt, packaging reclaimed by the courier." },
    { q: "What is the return window?", a: "Thirty days, no questions. The objet returns to the register, your serial is retired, and the piece is re-finished before it may be sold again." },
    { q: "Is the gold finish real?", a: "It is a 24-karat PVD vapour coat over bead-blasted aluminium — microns thin, metallurgically bonded, and rated for decades of daily wear without flaking." },
    { q: "Can my objet be repaired after the warranty?", a: "Yes. The atelier services every serial ever issued, for life. Send the piece home and it returns with a service ledger entry and a fresh polish." },
    { q: "Do you offer engraving?", a: "Each certificate card is hand-lettered on request, and case-backs accept up to twenty characters in the maison's own cut." },
  ],
  ai: {
    persona: "You are the Concierge of AURION, a maison of numbered electronic objets finished in champagne gold.",
    tone: "Warm, precise, quietly luxurious — like a Geneva atelier. Keep answers short (under 120 words unless asked for detail).",
  },
  maintenance: {
    enabled: false,
    title: "Polishing the gold.",
    note: "The boutique is briefly closed while we polish Run 07. The console remains open for the maison.",
  },
  productOverrides: {},
  catalog: structuredClone(PRODUCTS),
  brands: [
    {
      id: "aurion",
      name: "Aurion",
      tagline: "The house label",
      est: "MMXIX",
      story:
        "The founding atelier. Aurion cuts every hero objet from billet aluminium, dresses it in the 24-karat coat, and numbers it for life. If it carries the house name, it set the standard the others follow.",
      image: LIFESTYLE_IMG,
    },
    {
      id: "or-fer",
      name: "Or & Fer",
      tagline: "Gold & iron — sound and desk hardware",
      est: "MMXXI",
      story:
        "A small Lyon workshop folded into the maison. Or & Fer builds the things you touch every day — earbuds, keyboards, desk instruments — where brass weight and silent tactiles matter more than anything.",
      image: IMG.earbuds,
    },
    {
      id: "kinetiq",
      name: "Kinetiq",
      tagline: "Motion, stabilised",
      est: "MMXXII",
      story:
        "The imaging division. Kinetiq's gimbals and primes are tuned so footage comes out graded — golden hour by default. Their drones land on a palm and their cameras fit a coat pocket.",
      image: IMG.drone,
    },
  ],
  categories: [
    {
      name: "Audio",
      description:
        "Sound, dressed in gold — over-ears, earbuds and 360° columns for the room. Adaptive ANC, hi-res codecs, radiators that fill a ballroom.",
      image: IMG.headphones,
    },
    {
      name: "Wearables",
      description:
        "Timepieces that compute. Sapphire crystal, gold cases, ten-day reserves — worn daily, charged weekly, noticed constantly.",
      image: IMG.watch,
    },
    {
      name: "Imaging",
      description:
        "Cameras and drones with gold-anodised plates and steady gimbals. Fixed primes, 8K capture, airframes under 250 grams.",
      image: IMG.camera,
    },
    {
      name: "Desk",
      description:
        "Instruments for the working surface — hot-swap tactiles, tri-mode links and 2.1kg brass cores. Weight is a feature.",
      image: IMG.keyboard,
    },
  ],
};

/* ---------------- persistence ---------------- */

const SITE_KEY = "aurion-site-v1";
let cache: SiteConfig = load();

function load(): SiteConfig {
  try {
    const raw = localStorage.getItem(SITE_KEY);
    if (!raw) return structuredClone(DEFAULT_SITE);
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    // deep-merge over defaults so new fields never go missing
    const base = structuredClone(DEFAULT_SITE);
    return {
      ...base,
      ...parsed,
      brand: { ...base.brand, ...parsed.brand },
      hero: { ...base.hero, ...parsed.hero },
      sections: {
        ...base.sections,
        ...parsed.sections,
        ads: { ...base.sections.ads, ...parsed.sections?.ads },
      },
      rail: { ...base.rail, ...parsed.rail },
      promo: { ...base.promo, ...parsed.promo },
      spotlight: { ...base.spotlight, ...parsed.spotlight },
      disciplines: { ...base.disciplines, ...parsed.disciplines },
      bundle: { ...base.bundle, ...parsed.bundle },
      craft: { ...base.craft, ...parsed.craft },
      services: { ...base.services, ...parsed.services },
      stats: { ...base.stats, ...parsed.stats },
      voices: { ...base.voices, ...parsed.voices },
      privateList: { ...base.privateList, ...parsed.privateList },
      shop: { ...base.shop, ...parsed.shop },
      shipping: { ...base.shipping, ...parsed.shipping },
      showroom: { ...base.showroom, ...parsed.showroom },
      faq: parsed.faq ?? base.faq,
      ai: { ...base.ai, ...parsed.ai },
      maintenance: { ...base.maintenance, ...parsed.maintenance },
      marquee: parsed.marquee ?? base.marquee,
      productOverrides: { ...base.productOverrides, ...parsed.productOverrides },
      catalog:
        Array.isArray(parsed.catalog) && parsed.catalog.length
          ? (parsed.catalog as Product[]).map((p) => ({ ...p, brand: p.brand ?? "Aurion" }))
          : base.catalog,
      brands: Array.isArray(parsed.brands) && parsed.brands.length ? (parsed.brands as BrandMeta[]) : base.brands,
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length
          ? (parsed.categories as CategoryMeta[])
          : base.categories,
    };
  } catch {
    return structuredClone(DEFAULT_SITE);
  }
}

function persist(cfg: SiteConfig) {
  try {
    localStorage.setItem(SITE_KEY, JSON.stringify(cfg));
  } catch {
    /* storage unavailable */
  }
}

/* ---------------- non-React access ---------------- */

export function getSiteConfig(): SiteConfig {
  return cache;
}

export function getProducts(): Product[] {
  return cache.catalog.map((p) => ({ ...p, brand: p.brand ?? "Aurion", ...cache.productOverrides[p.id] }));
}

export function resetSite() {
  cache = structuredClone(DEFAULT_SITE);
  persist(cache);
}

/* ---------------- React context ---------------- */

type SiteCtx = {
  site: SiteConfig;
  products: Product[];
  saveSite: (next: SiteConfig) => void;
  patchSite: (patch: Partial<SiteConfig>) => void;
  saveCatalog: (list: Product[]) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<SiteConfig>(cache);

  const saveSite = useCallback((next: SiteConfig) => {
    cache = next;
    persist(next);
    setSite(next);
  }, []);

  const patchSite = useCallback((patch: Partial<SiteConfig>) => {
    const prev = cache;
    const next = { ...cache, ...patch };
    cache = next;
    persist(next);
    setSite(next);
    if (apiConfigured()) {
      if (patch.brands) {
        const oldIds = new Set(prev.brands.map((b) => b.id));
        const newIds = new Set(next.brands.map((b) => b.id));
        next.brands.forEach((b) => apiSaveBrand(b, !oldIds.has(b.id)).catch(() => undefined));
        prev.brands.filter((b) => !newIds.has(b.id)).forEach((b) => apiDeleteBrand(b.id).catch(() => undefined));
      }
      if (patch.categories) {
        const oldNames = new Set(prev.categories.map((c) => c.name));
        const newNames = new Set(next.categories.map((c) => c.name));
        next.categories.forEach((c) =>
          apiSaveCategory(c, oldNames.has(c.name) ? c.name : null).catch(() => undefined)
        );
        prev.categories
          .filter((c) => !newNames.has(c.name))
          .forEach((c) => apiDeleteCategory(c.name).catch(() => undefined));
      }
    }
  }, []);

  /* hydrate from Postgres when an API is configured */
  useEffect(() => {
    if (!apiConfigured()) return;
    let alive = true;
    Promise.allSettled([apiProducts(), apiBrands(), apiCategories()]).then(([p, b, c]) => {
      if (!alive) return;
      const next = { ...cache };
      let changed = false;
      if (p.status === "fulfilled" && p.value.length) {
        next.catalog = p.value;
        changed = true;
      }
      if (b.status === "fulfilled" && b.value.length) {
        next.brands = b.value;
        changed = true;
      }
      if (c.status === "fulfilled" && c.value.length) {
        next.categories = c.value;
        changed = true;
      }
      if (changed) {
        cache = next;
        persist(next);
        setSite(next);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const saveCatalog = useCallback((list: Product[]) => {
    const prev = cache.catalog;
    const next = { ...cache, catalog: list };
    cache = next;
    persist(next);
    setSite(next);
    if (apiConfigured()) {
      const prevIds = new Set(prev.map((p) => p.id));
      const currIds = new Set(list.map((p) => p.id));
      list.forEach((p) => apiSaveProduct(p, !prevIds.has(p.id)).catch(() => undefined));
      prev.filter((p) => !currIds.has(p.id)).forEach((p) => apiDeleteProduct(p.id).catch(() => undefined));
    }
  }, []);

  const products = useMemo(
    () => site.catalog.map((p) => ({ ...p, brand: p.brand ?? "Aurion", ...site.productOverrides[p.id] })),
    [site.catalog, site.productOverrides]
  );

  const value = useMemo(
    () => ({ site, products, saveSite, patchSite, saveCatalog }),
    [site, products, saveSite, patchSite, saveCatalog]
  );

  return createElement(Ctx.Provider, { value }, children);
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
