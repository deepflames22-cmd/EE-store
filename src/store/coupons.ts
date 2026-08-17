import { PROMOS, FREE_SHIP_AT, type Promo } from "../data/products";

const CLAIMED_KEY = "aurion-claimed-v1";
const CUSTOM_KEY = "aurion-custom-promos-v1";
const SETTINGS_KEY = "aurion-dash-settings-v1";

export type CustomPromo = { code: string; label: string; type: "pct" | "flat"; value: number; min?: number };

export function getClaimedCodes(): string[] {
  try {
    const raw = localStorage.getItem(CLAIMED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function claimCode(code: string): string[] {
  const next = Array.from(new Set([...getClaimedCodes(), code.toUpperCase()]));
  try {
    localStorage.setItem(CLAIMED_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  return next;
}

export function getCustomPromos(): CustomPromo[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as CustomPromo[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomPromos(list: CustomPromo[]) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

/** Resolve a code against the house ledger plus anything minted in the dashboard. */
export function resolvePromo(code: string): Promo | null {
  const normalized = code.trim().toUpperCase();
  const house = PROMOS.find((p) => p.code === normalized);
  if (house) return house;
  const custom = getCustomPromos().find((p) => p.code === normalized);
  if (custom) return { ...custom };
  return null;
}

/* ---------- dashboard-controlled settings ---------- */

export type DashSettings = {
  freeShipAt: number;
  maintenance: boolean;
  newsletter: boolean;
  currency: "USD" | "EUR" | "CHF";
};

export function getSettings(): DashSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { freeShipAt: FREE_SHIP_AT, maintenance: false, newsletter: true, currency: "USD", ...JSON.parse(raw) };
  } catch {
    /* fall through */
  }
  return { freeShipAt: FREE_SHIP_AT, maintenance: false, newsletter: true, currency: "USD" };
}

export function saveSettings(s: DashSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable */
  }
}
