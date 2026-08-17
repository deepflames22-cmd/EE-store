export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  was?: number;
  tag?: string;
  blurb: string;
  specs: string[];
  img: string;
};

export type Promo = {
  code: string;
  label: string;
  type: "pct" | "flat";
  value: number;
  min?: number;
};

export const PROMOS: Promo[] = [
  { code: "GILD10", label: "10% off the entire run", type: "pct", value: 10 },
  { code: "RUN07", label: "$75 off orders over $600", type: "flat", value: 75, min: 600 },
  { code: "MAISON", label: "$25 house welcome", type: "flat", value: 25 },
  { code: "WELCOME15", label: "15% off your first seal", type: "pct", value: 15 },
  { code: "SPIN20", label: "20% off — won at the wheel", type: "pct", value: 20 },
  { code: "FLASH25", label: "25% off the flash drop", type: "pct", value: 25, min: 400 },
];

export const COUPONS = [
  {
    code: "WELCOME15",
    pct: "15%",
    title: "First-seal welcome",
    note: "New members · any objet",
    expiry: "Ends Sunday",
  },
  {
    code: "RUN07",
    pct: "$75",
    title: "Run 07 ledger credit",
    note: "On orders over $600",
    expiry: "While Run 07 lasts",
  },
  {
    code: "FLASH25",
    pct: "25%",
    title: "Flash-drop cut",
    note: "On orders over $400",
    expiry: "48 hours only",
  },
  {
    code: "GILD10",
    pct: "10%",
    title: "The gilded hours",
    note: "Everything in the run",
    expiry: "Counter on the home",
  },
];

export const WHEEL_PRIZES: Array<{ label: string; sub: string; code: string | null }> = [
  { label: "20% OFF", sub: "code SPIN20", code: "SPIN20" },
  { label: "GILD10", sub: "10% off", code: "GILD10" },
  { label: "TRY AGAIN", sub: "the house smiles", code: null },
  { label: "15% OFF", sub: "code WELCOME15", code: "WELCOME15" },
  { label: "$25 CREDIT", sub: "code MAISON", code: "MAISON" },
  { label: "25% FLASH", sub: "code FLASH25", code: "FLASH25" },
];

export const BUNDLE = {
  id: "travel-set",
  name: "The Travel Set",
  itemIds: ["aurion-one", "halo-buds", "obelisk"],
  save: 140,
  note: "Only 120 sets numbered & sealed",
};

export const SHIPPING_FLAT = 25;
export const FREE_SHIP_AT = 500;

export function promoDiscount(subtotal: number, promo: Promo | null): number {
  if (!promo) return 0;
  if (promo.type === "pct") return Math.round(subtotal * (promo.value / 100));
  if (promo.min && subtotal < promo.min) return 0;
  return Math.min(promo.value, subtotal);
}

export type Category = "Audio" | "Wearables" | "Imaging" | "Desk";

export const CATEGORIES: Category[] = ["Audio", "Wearables", "Imaging", "Desk"];

const IMG = {
  headphones:
    "https://image.qwenlm.ai/generated-images/732616d9-4c04-40d9-a5e2-5106e049d87c/_result.png",
  watch: "https://image.qwenlm.ai/generated-images/1996bebb-d9a5-498f-ad49-3d44a5547442/_result.png",
  earbuds:
    "https://image.qwenlm.ai/generated-images/2feffadf-960a-4221-a9cc-47d2fdd71448/_result.png",
  speaker:
    "https://image.qwenlm.ai/generated-images/421cb2b4-770c-44d2-a8fb-39616ad261cb/_result.png",
  camera:
    "https://image.qwenlm.ai/generated-images/017aadec-a029-4a19-b475-b033597d6f59/_result.png",
  keyboard:
    "https://image.qwenlm.ai/generated-images/4f58a3d7-766f-4d3f-a0af-25e590d01e06/_result.png",
  drone: "https://image.qwenlm.ai/generated-images/2b8ce9aa-01a9-4cce-8153-67a5546ddffb/_result.png",
};

export const LIFESTYLE_IMG =
  "https://image.qwenlm.ai/generated-images/c36c471c-13f7-430e-b087-3b728f4be87b/_result.png";

export const PRODUCTS: Product[] = [
  {
    id: "aurion-one",
    name: "Aurion One",
    category: "Audio",
    price: 549,
    was: 649,
    tag: "Signature",
    blurb: "Over-ear headphones machined from a single billet, dressed in champagne gold.",
    specs: ["40h playback", "24-bit / 192kHz", "Adaptive ANC"],
    img: IMG.headphones,
  },
  {
    id: "meridian-s",
    name: "Meridian S",
    category: "Wearables",
    price: 799,
    was: 899,
    tag: "New",
    blurb: "A timepiece that happens to be a computer. Sapphire glass, gold case, ten-day reserve.",
    specs: ["Sapphire crystal", "10-day battery", "5ATM sealed"],
    img: IMG.watch,
  },
  {
    id: "halo-buds",
    name: "Halo Buds Pro",
    category: "Audio",
    price: 299,
    blurb: "True wireless earbuds in a gold-leafed case that charges in eleven minutes.",
    specs: ["11-min charge", "Spatial audio", "IPX5"],
    img: IMG.earbuds,
  },
  {
    id: "obelisk",
    name: "Obelisk",
    category: "Audio",
    price: 449,
    tag: "Best Seller",
    blurb: "A 360° column of sound behind a perforated gold grille. Fills a ballroom, fits a shelf.",
    specs: ["360° radiator", "26h reserve", "Pair-stereo link"],
    img: IMG.speaker,
  },
  {
    id: "lumen-q",
    name: "Lumen Q",
    category: "Imaging",
    price: 1199,
    blurb: "A pocket camera with a fixed 35mm-equivalent prime and a gold-anodised top plate.",
    specs: ["1\" sensor", "f/1.8 prime", "4K 120fps"],
    img: IMG.camera,
  },
  {
    id: "sovereign-kb",
    name: "Sovereign",
    category: "Desk",
    price: 349,
    tag: "Limited",
    blurb: "A low-profile mechanical instrument. Gold frame, silent tactiles, brass weight inside.",
    specs: ["Hot-swap tactiles", "Tri-mode link", "2.1kg brass core"],
    img: IMG.keyboard,
  },
  {
    id: "falcon-x",
    name: "Falcon X",
    category: "Imaging",
    price: 1499,
    was: 1699,
    tag: "New",
    blurb: "A folding drone with a stabilised gold gimbal. Forty minutes aloft, one palm to land.",
    specs: ["40-min flight", "8K gimbal", "249g airframe"],
    img: IMG.drone,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The Aurion One is the first object I own that sounds the way a watch looks. People ask about it before they ask the time.",
    name: "Isabelle Marchetti",
    role: "Creative Director, Milan",
  },
  {
    quote:
      "I flew the Falcon X over the Amalfi coast at golden hour. The footage needed no grade — it came out the colour of the drone.",
    name: "Daniel Okafor",
    role: "Filmmaker, Lagos",
  },
  {
    quote:
      "Unboxing felt like jewellery. The Meridian S arrived in a lacquered tray with a handwritten serial card. Extraordinary care.",
    name: "Yuna Park",
    role: "Architect, Seoul",
  },
  {
    quote:
      "Every gadget claims to be premium. AURION is the only one where the weight, the click and the silence all agree.",
    name: "Marcus Reinholt",
    role: "Collector, Vienna",
  },
];

export const MARQUEE_ITEMS = [
  "Complimentary Global Shipping",
  "24-Month Warranty",
  "30-Day Returns",
  "Hand-Finished Gold Detail",
  "Limited Quarterly Runs",
  "Carbon-Neutral Delivery",
];

export const formatPrice = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
