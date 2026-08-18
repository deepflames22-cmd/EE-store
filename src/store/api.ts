import type { Product } from "../data/products";
import type { BrandMeta, CategoryMeta } from "./site";

/**
 * Runtime database bridge.
 *
 * The API URL comes from (in order):
 *   1. a URL pasted under Dashboard → Settings → "Database connection" (localStorage)
 *   2. the VITE_API_URL build-time env var
 *
 * When no API is configured — or a call fails — the storefront silently
 * keeps using its local (browser) ledger, so nothing ever breaks.
 */

const API_KEY = "aurion-api-url";

export function getApiUrl(): string {
  try {
    const local = localStorage.getItem(API_KEY);
    if (local) return local.replace(/\/+$/, "");
  } catch {
    /* storage unavailable */
  }
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL;
  return (env ?? "").replace(/\/+$/, "");
}

export function setApiUrl(url: string) {
  try {
    if (url.trim()) localStorage.setItem(API_KEY, url.trim().replace(/\/+$/, ""));
    else localStorage.removeItem(API_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function apiConfigured(): boolean {
  return getApiUrl().length > 0;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiUrl();
  if (!base) throw new Error("no-api");
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

/* ---------------- health ---------------- */

export async function checkApi(url?: string): Promise<{ ok: boolean; error?: string }> {
  const base = (url ?? getApiUrl()).replace(/\/+$/, "");
  if (!base) return { ok: false, error: "No URL configured" };
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${base}/api/health`, { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const body = (await res.json()) as { ok?: boolean; db?: string };
    return body.ok ? { ok: true } : { ok: false, error: body.db ?? "Unhealthy" };
  } catch (e) {
    return { ok: false, error: e instanceof Error && e.name === "AbortError" ? "Timed out" : "Unreachable" };
  }
}

/* ---------------- reads ---------------- */

export async function apiProducts(): Promise<Product[]> {
  const rows = await request<
    Array<{ id: string; name: string; brand: string; category: string; price: number; was?: number; tag?: string; blurb: string; specs: string[]; img: string }>
  >("/api/products");
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    brand: r.brand,
    category: r.category,
    price: r.price,
    was: r.was,
    tag: r.tag,
    blurb: r.blurb,
    specs: r.specs,
    img: r.img,
  }));
}

export async function apiBrands(): Promise<BrandMeta[]> {
  return request<BrandMeta[]>("/api/brands");
}

export async function apiCategories(): Promise<CategoryMeta[]> {
  return request<CategoryMeta[]>("/api/categories");
}

/* ---------------- catalog writes ---------------- */

export async function apiSaveProduct(p: Product, isNew: boolean): Promise<void> {
  await request(`/api/products${isNew ? "" : `/${p.id}`}`, {
    method: isNew ? "POST" : "PUT",
    body: JSON.stringify(p),
  });
}

export async function apiDeleteProduct(id: string): Promise<void> {
  await request(`/api/products/${id}`, { method: "DELETE" });
}

export async function apiSaveBrand(b: BrandMeta, isNew: boolean): Promise<void> {
  await request(`/api/brands${isNew ? "" : `/${b.id}`}`, {
    method: isNew ? "POST" : "PUT",
    body: JSON.stringify(b),
  });
}

export async function apiDeleteBrand(id: string): Promise<void> {
  await request(`/api/brands/${id}`, { method: "DELETE" });
}

export async function apiSaveCategory(c: CategoryMeta, previousName: string | null): Promise<void> {
  if (previousName === null) {
    await request("/api/categories", { method: "POST", body: JSON.stringify(c) });
  } else {
    await request(`/api/categories/${encodeURIComponent(previousName)}`, {
      method: "PUT",
      body: JSON.stringify(c),
    });
  }
}

export async function apiDeleteCategory(name: string): Promise<void> {
  await request(`/api/categories/${encodeURIComponent(name)}`, { method: "DELETE" });
}

/* ---------------- orders ---------------- */

export type ApiOrder = {
  id: string;
  email: string;
  name: string;
  date: string;
  items: Array<{ id?: string; name: string; category?: string; price: number; qty: number; img?: string }>;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  shippingMethod: string;
  shippingCost: number;
  total: number;
  address: string;
  status: string;
};

export async function apiPlaceOrder(order: ApiOrder): Promise<void> {
  await request("/api/orders", { method: "POST", body: JSON.stringify(order) });
}

export async function apiOrders(email?: string): Promise<ApiOrder[]> {
  return request<ApiOrder[]>(`/api/orders${email ? `?email=${encodeURIComponent(email)}` : ""}`);
}
