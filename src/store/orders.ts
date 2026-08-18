export type OrderItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  img: string;
};

export type Order = {
  id: string;
  email: string;
  name: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  shippingMethod: string;
  shippingCost: number;
  total: number;
  address: string;
  status: "sealed" | "in-transit" | "delivered";
};

const ORDERS_KEY = "aurion-orders-v1";

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable */
  }
}

export function addOrder(order: Order) {
  saveOrders([order, ...loadOrders()]);
}

export function getOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}

export function ordersFor(email: string): Order[] {
  return loadOrders().filter((o) => o.email === email.trim().toLowerCase());
}

export function makeOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `AU-${stamp}${rand}`;
}
