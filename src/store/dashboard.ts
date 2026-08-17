import { PRODUCTS, PROMOS, type Category } from "../data/products";
import { loadOrders, type Order } from "./orders";

export type DashStatus = "placed" | "sealed" | "in-transit" | "delivered" | "cancelled";

export type DashOrder = {
  id: string;
  customer: string;
  email: string;
  date: string; // ISO
  items: number;
  total: number;
  status: DashStatus;
  method: string;
};

export type DashProduct = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  active: boolean;
  img: string;
};

export type DashPromo = {
  code: string;
  kind: "pct" | "flat";
  value: number;
  used: number;
  active: boolean;
  custom?: boolean;
};

export type DashState = {
  orders: DashOrder[];
  products: DashProduct[];
  promos: DashPromo[];
};

const KEY = "aurion-dash-state-v1";

const daysAgo = (n: number, h = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 24 - n, 0, 0);
  return d.toISOString();
};

const SEED_ORDERS: Array<Omit<DashOrder, "status"> & { status: DashStatus }> = [
  { id: "AU-K2M4Q8", customer: "Isabelle Marchetti", email: "isabelle@marchetti.it", date: daysAgo(0, 9), items: 2, total: 848, status: "placed", method: "White-Glove" },
  { id: "AU-P7X1ZB", customer: "Daniel Okafor", email: "daniel@okafor.film", date: daysAgo(0, 7), items: 1, total: 1499, status: "placed", method: "Courier Standard" },
  { id: "AU-H9D3LN", customer: "Yuna Park", email: "yuna@park.studio", date: daysAgo(1, 16), items: 3, total: 1297, status: "sealed", method: "White-Glove" },
  { id: "AU-B4T8RC", customer: "Marcus Reinholt", email: "marcus@reinholt.at", date: daysAgo(2, 11), items: 1, total: 549, status: "sealed", method: "Atelier Pickup" },
  { id: "AU-W1N6KE", customer: "Amara Diallo", email: "amara@diallo.sn", date: daysAgo(3, 14), items: 2, total: 748, status: "in-transit", method: "Courier Standard" },
  { id: "AU-J5F2MQ", customer: "Tomás Rivera", email: "tomas@rivera.mx", date: daysAgo(4, 10), items: 1, total: 349, status: "in-transit", method: "Courier Standard" },
  { id: "AU-V8C4XD", customer: "Sofia Lindqvist", email: "sofia@lindqvist.se", date: daysAgo(6, 15), items: 4, total: 2146, status: "delivered", method: "White-Glove" },
  { id: "AU-R3G7WA", customer: "Kenji Morita", email: "kenji@morita.jp", date: daysAgo(8, 13), items: 1, total: 799, status: "delivered", method: "White-Glove" },
  { id: "AU-L6S9PF", customer: "Claire Fontaine", email: "claire@fontaine.fr", date: daysAgo(10, 12), items: 2, total: 998, status: "delivered", method: "Courier Standard" },
  { id: "AU-N2H5TV", customer: "Omar Haddad", email: "omar@haddad.ae", date: daysAgo(12, 17), items: 1, total: 449, status: "cancelled", method: "Courier Standard" },
];

function mapRealOrders(orders: Order[]): DashOrder[] {
  const statusMap: Record<Order["status"], DashStatus> = {
    sealed: "sealed",
    "in-transit": "in-transit",
    delivered: "delivered",
  };
  return orders.map((o) => ({
    id: o.id,
    customer: o.name,
    email: o.email,
    date: o.date,
    items: o.items.reduce((s, i) => s + i.qty, 0),
    total: o.total,
    status: statusMap[o.status],
    method: o.shippingMethod,
  }));
}

function seed(): DashState {
  const real = mapRealOrders(loadOrders());
  const seen = new Set(SEED_ORDERS.map((o) => o.id));
  const merged = [...real.filter((o) => !seen.has(o.id)), ...SEED_ORDERS].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  const stocks: Record<string, number> = {
    "aurion-one": 34,
    "meridian-s": 12,
    "halo-buds": 58,
    obelisk: 21,
    "lumen-q": 8,
    "sovereign-kb": 4,
    "falcon-x": 15,
  };

  return {
    orders: merged,
    products: PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: stocks[p.id] ?? 20,
      active: true,
      img: p.img,
    })),
    promos: PROMOS.map((p, i) => ({
      code: p.code,
      kind: p.type,
      value: p.value,
      used: [212, 64, 388, 91, 27, 45][i] ?? 12,
      active: true,
    })),
  };
}

export function loadDash(): DashState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DashState;
      if (parsed.orders && parsed.products && parsed.promos) return parsed;
    }
  } catch {
    /* fall through to seed */
  }
  const s = seed();
  saveDash(s);
  return s;
}

export function saveDash(state: DashState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

/* ---------- derived series ---------- */

export const REVENUE_WEEKS = [
  { w: "W1", revenue: 8400, orders: 22 },
  { w: "W2", revenue: 9100, orders: 25 },
  { w: "W3", revenue: 7600, orders: 19 },
  { w: "W4", revenue: 11200, orders: 31 },
  { w: "W5", revenue: 10400, orders: 27 },
  { w: "W6", revenue: 12900, orders: 34 },
  { w: "W7", revenue: 12100, orders: 30 },
  { w: "W8", revenue: 14600, orders: 38 },
  { w: "W9", revenue: 13800, orders: 35 },
  { w: "W10", revenue: 16200, orders: 41 },
  { w: "W11", revenue: 15400, orders: 39 },
  { w: "W12", revenue: 18900, orders: 47 },
];

export const SPARKS = {
  revenue: [42, 48, 45, 56, 61, 58, 70, 74, 71, 82, 86, 95],
  orders: [22, 25, 19, 31, 27, 34, 30, 38, 35, 41, 39, 47],
  aov: [380, 364, 400, 361, 385, 379, 403, 384, 394, 395, 395, 402],
  conversion: [2.1, 2.3, 2.2, 2.6, 2.5, 2.8, 2.7, 3.0, 2.9, 3.2, 3.1, 3.4],
};
