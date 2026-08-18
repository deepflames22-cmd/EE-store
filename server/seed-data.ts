const IMG = {
  headphones: "https://image.qwenlm.ai/generated-images/732616d9-4c04-40d9-a5e2-5106e049d87c/_result.png",
  watch: "https://image.qwenlm.ai/generated-images/1996bebb-d9a5-498f-ad49-3d44a5547442/_result.png",
  earbuds: "https://image.qwenlm.ai/generated-images/2feffadf-960a-4221-a9cc-47d2fdd71448/_result.png",
  speaker: "https://image.qwenlm.ai/generated-images/421cb2b4-770c-44d2-a8fb-39616ad261cb/_result.png",
  camera: "https://image.qwenlm.ai/generated-images/017aadec-a029-4a19-b475-b033597d6f59/_result.png",
  keyboard: "https://image.qwenlm.ai/generated-images/4f58a3d7-766f-4d3f-a0af-25e590d01e06/_result.png",
  drone: "https://image.qwenlm.ai/generated-images/2b8ce9aa-01a9-4cce-8153-67a5546ddffb/_result.png",
};

export const BRANDS_SEED = [
  {
    slug: "aurion",
    name: "Aurion",
    tagline: "The house label",
    est: "MMXIX",
    story: "The founding atelier. Aurion cuts every hero objet from billet aluminium, dresses it in the 24-karat coat, and numbers it for life.",
    image: "https://image.qwenlm.ai/generated-images/c36c471c-13f7-430e-b087-3b728f4be87b/_result.png",
  },
  {
    slug: "or-fer",
    name: "Or & Fer",
    tagline: "Gold & iron — sound and desk hardware",
    est: "MMXXI",
    story: "A small Lyon workshop folded into the maison. Or & Fer builds the things you touch every day.",
    image: IMG.earbuds,
  },
  {
    slug: "kinetiq",
    name: "Kinetiq",
    tagline: "Motion, stabilised",
    est: "MMXXII",
    story: "The imaging division. Gimbals and primes tuned so footage comes out graded — golden hour by default.",
    image: IMG.drone,
  },
];

export const CATEGORIES_SEED = [
  { name: "Audio", description: "Sound, dressed in gold — over-ears, earbuds and 360° columns for the room.", image: IMG.headphones },
  { name: "Wearables", description: "Timepieces that compute. Sapphire crystal, gold cases, ten-day reserves.", image: IMG.watch },
  { name: "Imaging", description: "Cameras and drones with gold-anodised plates and steady gimbals.", image: IMG.camera },
  { name: "Desk", description: "Instruments for the working surface — hot-swap tactiles and brass cores.", image: IMG.keyboard },
];

type SeedProduct = {
  slug: string;
  name: string;
  brandSlug: string;
  categoryName: string;
  price: number;
  was?: number | null;
  tag?: string | null;
  blurb: string;
  specs: string[];
  img: string;
};

export const PRODUCTS_SEED: SeedProduct[] = [
  {
    slug: "aurion-one",
    name: "Aurion One",
    brandSlug: "aurion",
    categoryName: "Audio",
    price: 549,
    was: 649,
    tag: "Signature",
    blurb: "Over-ear headphones machined from a single billet, dressed in champagne gold.",
    specs: ["40h playback", "24-bit / 192kHz", "Adaptive ANC"],
    img: IMG.headphones,
  },
  {
    slug: "meridian-s",
    name: "Meridian S",
    brandSlug: "aurion",
    categoryName: "Wearables",
    price: 799,
    was: 899,
    tag: "New",
    blurb: "A timepiece that happens to be a computer. Sapphire glass, gold case, ten-day reserve.",
    specs: ["Sapphire crystal", "10-day battery", "5ATM sealed"],
    img: IMG.watch,
  },
  {
    slug: "halo-buds",
    name: "Halo Buds Pro",
    brandSlug: "or-fer",
    categoryName: "Audio",
    price: 299,
    was: null,
    tag: null,
    blurb: "True wireless earbuds in a gold-leafed case that charges in eleven minutes.",
    specs: ["11-min charge", "Spatial audio", "IPX5"],
    img: IMG.earbuds,
  },
  {
    slug: "obelisk",
    name: "Obelisk",
    brandSlug: "aurion",
    categoryName: "Audio",
    price: 449,
    was: null,
    tag: "Best Seller",
    blurb: "A 360° column of sound behind a perforated gold grille. Fills a ballroom, fits a shelf.",
    specs: ["360° radiator", "26h reserve", "Pair-stereo link"],
    img: IMG.speaker,
  },
  {
    slug: "lumen-q",
    name: "Lumen Q",
    brandSlug: "kinetiq",
    categoryName: "Imaging",
    price: 1199,
    was: null,
    tag: null,
    blurb: "A pocket camera with a fixed 35mm-equivalent prime and a gold-anodised top plate.",
    specs: ['1" sensor', "f/1.8 prime", "4K 120fps"],
    img: IMG.camera,
  },
  {
    slug: "sovereign-kb",
    name: "Sovereign",
    brandSlug: "or-fer",
    categoryName: "Desk",
    price: 349,
    was: null,
    tag: "Limited",
    blurb: "A low-profile mechanical instrument. Gold frame, silent tactiles, brass weight inside.",
    specs: ["Hot-swap tactiles", "Tri-mode link", "2.1kg brass core"],
    img: IMG.keyboard,
  },
  {
    slug: "falcon-x",
    name: "Falcon X",
    brandSlug: "kinetiq",
    categoryName: "Imaging",
    price: 1499,
    was: 1699,
    tag: "New",
    blurb: "A folding drone with a stabilised gold gimbal. Forty minutes aloft, one palm to land.",
    specs: ["40-min flight", "8K gimbal", "249g airframe"],
    img: IMG.drone,
  },
];

export const PROMOS_SEED = [
  { code: "GILD10", label: "10% off the entire run", type: "pct", value: 10, min: null, active: true, custom: false },
  { code: "RUN07", label: "$75 off orders over $600", type: "flat", value: 75, min: 600, active: true, custom: false },
  { code: "MAISON", label: "$25 house welcome", type: "flat", value: 25, min: null, active: true, custom: false },
  { code: "WELCOME15", label: "15% off your first seal", type: "pct", value: 15, min: null, active: true, custom: false },
  { code: "SPIN20", label: "20% off — won at the wheel", type: "pct", value: 20, min: null, active: true, custom: false },
  { code: "FLASH25", label: "25% off the flash drop", type: "pct", value: 25, min: 400, active: true, custom: false },
];
