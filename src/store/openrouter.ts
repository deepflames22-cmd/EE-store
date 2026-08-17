import { BUNDLE, PRODUCTS, PROMOS, formatPrice } from "../data/products";
import { getSettings } from "./coupons";

const KEY_KEY = "aurion-openrouter-key";
const MODEL_KEY = "aurion-openrouter-model";
const CHAT_KEY = "aurion-chat-v1";

export const OPENROUTER_MODELS = [
  { id: "openrouter/auto", label: "OpenRouter Auto — picks the best model per query" },
  { id: "openrouter/auto-beta", label: "OpenRouter Auto Beta — experimental routing" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B — free" },
  { id: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3 — free" },
  { id: "mistralai/mistral-small-3.2-24b-instruct:free", label: "Mistral Small 3.2 — free" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { id: "anthropic/claude-3.5-haiku", label: "Claude 3.5 Haiku" },
  { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
];

export const DEFAULT_MODEL = "openrouter/auto";

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
    return localStorage.getItem(MODEL_KEY) ?? DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
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

/* ---------- resilient chat ---------- */

const MAX_ATTEMPTS = 10;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const BUSY_MESSAGE = `The line to the atelier is busy right now — we tried ${MAX_ATTEMPTS} times without reaching the concierge. Please wait a moment and ask again.`;

/** Short, boilerplate "please retry" style replies are treated as failures, not answers. */
const RETRY_BOILERPLATE_RE =
  /\b(retry|try\s+again|try\s+later|temporarily\s+unavailable|service\s+(is\s+)?(busy|unavailable)|overloaded|rate[- ]?limit(ed)?|please\s+try|unable\s+to\s+process)\b/i;

function backoff(attempt: number): number {
  return Math.min(600 * 2 ** (attempt - 1), 3000) + Math.random() * 250;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => resolve(), ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

type Attempt =
  | { ok: true; text: string }
  | { ok: false; kind: "retry" | "fatal"; message: string };

async function attemptOnce(
  key: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<Attempt> {
  let res: Response;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin || "https://aurion.example",
        "X-Title": "AURION Concierge",
      },
      body: JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: 500 }),
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") return { ok: false, kind: "fatal", message: "aborted" };
    return { ok: false, kind: "retry", message: "network unreachable" };
  }

  if (!res.ok || !res.body) {
    let detail = "";
    try {
      const j = await res.json();
      detail = typeof j?.error === "string" ? j.error : j?.error?.message ?? "";
    } catch {
      /* unreadable body */
    }
    if (res.status === 401 || res.status === 403)
      return {
        ok: false,
        kind: "fatal",
        message: `OpenRouter refused the key (HTTP ${res.status}). Re-check it in Dashboard → Settings.`,
      };
    if (RETRYABLE_STATUS.has(res.status))
      return { ok: false, kind: "retry", message: `HTTP ${res.status}${detail ? ` — ${detail.slice(0, 120)}` : ""}` };
    return {
      ok: false,
      kind: "fatal",
      message: `OpenRouter error (HTTP ${res.status})${detail ? `: ${detail.slice(0, 160)}` : "."}`,
    };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let got = false;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const raw of lines) {
        const t = raw.trim();
        if (!t.startsWith("data:")) continue;
        const data = t.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          if (json?.error) {
            if (got) return { ok: true, text };
            return { ok: false, kind: "retry", message: String(json.error.message ?? "stream error").slice(0, 120) };
          }
          const delta: string =
            json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.message?.content ?? "";
          if (delta) {
            text += delta;
            got = true;
            onDelta(delta);
          }
        } catch {
          /* partial frame */
        }
      }
    }
  } catch (e) {
    if (got) return { ok: true, text };
    if ((e as Error).name === "AbortError") return { ok: false, kind: "fatal", message: "aborted" };
    return { ok: false, kind: "retry", message: "stream interrupted" };
  }

  if (!got) return { ok: false, kind: "retry", message: "empty reply" };
  return { ok: true, text };
}

export async function streamChat(
  history: ChatMsg[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
  onRetry?: (attempt: number, reason: string) => void
): Promise<void> {
  const key = getApiKey();
  if (!key) throw new Error("no-key");

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
  ];
  const model = getModel();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (signal?.aborted) return;

    const result = await attemptOnce(key, model, messages, onDelta, signal);

    if (result.ok) {
      const clean = result.text.trim();
      const isBoilerplate = clean.length < 240 && RETRY_BOILERPLATE_RE.test(clean);
      if (!isBoilerplate) return;
      if (attempt === MAX_ATTEMPTS) throw new Error(BUSY_MESSAGE);
      onRetry?.(attempt, "boilerplate reply");
    } else {
      if (result.kind === "fatal") {
        if (result.message === "aborted") return;
        throw new Error(result.message);
      }
      if (attempt === MAX_ATTEMPTS) throw new Error(BUSY_MESSAGE);
      onRetry?.(attempt, result.message);
    }

    await sleep(backoff(attempt), signal);
  }
  throw new Error(BUSY_MESSAGE);
}
