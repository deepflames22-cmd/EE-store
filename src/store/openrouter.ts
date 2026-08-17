import { BUNDLE, PRODUCTS, PROMOS, formatPrice } from "../data/products";
import { getSettings } from "./coupons";

const KEY_KEY = "aurion-openrouter-key";
const MODEL_KEY = "aurion-openrouter-model";
const CHAT_KEY = "aurion-chat-v1";

export const OPENROUTER_MODELS = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B — free" },
  { id: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3 — free" },
  { id: "mistralai/mistral-small-3.2-24b-instruct:free", label: "Mistral Small 3.2 — free" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { id: "anthropic/claude-3.5-haiku", label: "Claude 3.5 Haiku" },
  { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
];

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveApiKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_KEY, key.trim());
    else localStorage.removeItem(KEY_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getModel(): string {
  try {
    return localStorage.getItem(MODEL_KEY) ?? OPENROUTER_MODELS[0].id;
  } catch {
    return OPENROUTER_MODELS[0].id;
  }
}

export function saveModel(id: string) {
  try {
    localStorage.setItem(MODEL_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

/* ---------- chat history ---------- */

export type ChatMsg = { role: "user" | "assistant"; content: string };

export function loadChat(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? (JSON.parse(raw) as ChatMsg[]) : [];
  } catch {
    return [];
  }
}

export function saveChat(msgs: ChatMsg[]) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(msgs.slice(-40)));
  } catch {
    /* storage unavailable */
  }
}

export function clearChat() {
  try {
    localStorage.removeItem(CHAT_KEY);
  } catch {
    /* storage unavailable */
  }
}

/* ---------- context ---------- */

export function buildSystemPrompt(): string {
  const s = getSettings();
  const catalog = PRODUCTS.map(
    (p) =>
      `- ${p.name} (${p.category}): ${formatPrice(p.price)}${p.was ? ` — was ${formatPrice(p.was)}` : ""}. ${p.specs.join(", ")}. ${p.blurb}`
  ).join("\n");
  const promos = PROMOS.map((p) => `- ${p.code}: ${p.label}`).join("\n");
  const bundle = PRODUCTS.filter((p) => BUNDLE.itemIds.includes(p.id))
    .map((p) => p.name)
    .join(" + ");

  return [
    "You are the Concierge of AURION, a maison of numbered electronic objets finished in champagne gold (headphones, earbuds, speakers, a smartwatch, a pocket camera, a keyboard, a drone).",
    "Tone: warm, precise, quietly luxurious — like a Geneva atelier. Keep answers short (under 120 words unless asked for detail). Never invent products, prices or codes beyond what is listed below. Format prices with $.",
    "",
    "CATALOG (Run 07):",
    catalog,
    "",
    "ACTIVE CODES:",
    promos,
    `- BUNDLE: The Travel Set (${bundle}) saves ${formatPrice(BUNDLE.save)}.`,
    "",
    "HOUSE POLICIES:",
    `- Orders above ${formatPrice(s.freeShipAt)} ship complimentary (white-glove above that, hand-carried).`,
    "- 30-day returns; every serial is repairable for life at the atelier.",
    "- 24-month warranty; numbered runs are never re-made.",
    "- Showroom: Rue du Rhône 12, Geneva · Tue–Sat 10:00–18:30 · concierge@aurion.example.",
    "If asked about an order, tell them order ids look like AU-XXXX and appear under Profile → Orders. If you do not know something, say the concierge desk will follow up by letter.",
  ].join("\n");
}

/* ---------- API ---------- */

export async function testKey(key: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key.trim()}` },
    });
    if (res.ok) return { ok: true, message: "Key accepted by OpenRouter." };
    return { ok: false, message: `OpenRouter refused the key (HTTP ${res.status}).` };
  } catch {
    return { ok: false, message: "Could not reach OpenRouter — check the connection." };
  }
}

export async function streamChat(
  history: ChatMsg[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const key = getApiKey();
  if (!key) throw new Error("no-key");

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin || "https://aurion.example",
      "X-Title": "AURION Concierge",
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!res.ok || !res.body) {
    let detail = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error?.message) detail = j.error.message;
    } catch {
      /* no body */
    }
    throw new Error(detail);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const data = t.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta: string =
          json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.message?.content ?? "";
        if (delta) onDelta(delta);
      } catch {
        /* partial frame */
      }
    }
  }
}
