import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  clearChat,
  getApiKey,
  loadChat,
  saveChat,
  streamChat,
  type ChatMsg,
} from "../store/openrouter";
import { ChatIcon, CloseIcon, DiamondIcon, KeyIcon, SendIcon, SparkIcon } from "./Icons";

const WELCOME: ChatMsg = {
  role: "assistant",
  content:
    "Bonsoir — the Concierge of AURION, at your service. Ask me about any objet in Run 07, a promotion code, delivery, or a serial in need of care.",
};

const CHIPS = [
  "What is in Run 07?",
  "Which codes work today?",
  "Recommend a gift under $500",
  "How do returns work?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasKey, setHasKey] = useState(() => Boolean(getApiKey()));
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    const saved = loadChat();
    return saved.length ? saved : [WELCOME];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [retryNote, setRetryNote] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setHasKey(Boolean(getApiKey()));
      window.setTimeout(() => inputRef.current?.focus(), 350);
    }
    return () => abortRef.current?.abort();
  }, [open]);

  useEffect(() => {
    saveChat(msgs);
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");

    if (!hasKey) {
      setMsgs((m) => [
        ...m,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content:
            "The line to the atelier is not connected yet. Add your OpenRouter key under Dashboard → Settings, and I will be back within the minute.",
        },
      ]);
      return;
    }

    const nextHistory = [...msgs, { role: "user" as const, content: trimmed }];
    setMsgs([...nextHistory, { role: "assistant", content: "" }]);
    setBusy(true);
    setRetryNote(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let acc = "";
      await streamChat(
        nextHistory,
        (delta) => {
          acc += delta;
          const snapshot = acc;
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: snapshot };
            return copy;
          });
        },
        controller.signal,
        (attempt) =>
          setRetryNote(`The line is busy — redialing the atelier (attempt ${attempt + 1} of 10)`)
      );
      if (!acc) {
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "The atelier answered in silence — perhaps try once more?",
          };
          return copy;
        });
      }
    } catch (e) {
      const raw = e instanceof Error ? e.message : "unknown";
      const msg =
        raw === "no-key"
          ? "The key has gone missing — re-add it under Dashboard → Settings."
          : raw === "aborted"
          ? "Set down mid-sentence — ask again whenever you like."
          : raw;
      setMsgs((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          copy[copy.length - 1] = { role: "assistant", content: msg };
        } else {
          copy.push({ role: "assistant", content: msg });
        }
        return copy;
      });
    } finally {
      setBusy(false);
      setRetryNote(null);
      abortRef.current = null;
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    clearChat();
    setMsgs([WELCOME]);
    setBusy(false);
  };

  return (
    <>
      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 md:right-6 z-[83] w-[min(24.5rem,calc(100vw-2rem))] flex flex-col border-2 border-ink bg-paper shadow-[12px_12px_0_rgba(23,21,16,0.4)]"
            style={{ height: "min(36rem, calc(100dvh - 8rem))" }}
            role="dialog"
            aria-label="AURION Concierge chat"
          >
            {/* header */}
            <div className="plate-dark text-paper px-5 py-4 flex items-center justify-between border-b-2 border-ink">
              <div className="flex items-center gap-3">
                <span className="relative w-10 h-10 border border-brass/50 flex items-center justify-center text-brass">
                  <DiamondIcon className="w-3.5 h-3.5" />
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-ink ${hasKey ? "bg-[#9fc4ab]" : "bg-rust"}`} />
                </span>
                <div>
                  <div className="font-display font-bold leading-tight">The Concierge</div>
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-paper/50">
                    {hasKey ? "Online · replies in seconds" : "Offline · no key set"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  data-cursor
                  onClick={reset}
                  className="p-2 text-paper/50 hover:text-brass transition-colors"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <SparkIcon className="w-4 h-4" />
                </button>
                <button
                  data-cursor
                  onClick={() => setOpen(false)}
                  className="p-2 text-paper/50 hover:text-brass hover:rotate-90 transition-all duration-300"
                  aria-label="Close chat"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!hasKey && (
              <div className="bg-brass/20 border-b-2 border-ink px-5 py-3 flex items-center justify-between gap-3">
                <p className="text-xs text-ink/75 leading-snug">
                  Connect the atelier — add your OpenRouter key once, in the dashboard.
                </p>
                <Link
                  to="/dashboard"
                  data-cursor
                  onClick={() => setOpen(false)}
                  className="shrink-0 flex items-center gap-2 bg-ink text-paper px-3 py-2 font-mono text-[9px] tracking-[0.18em] uppercase hover:bg-coal transition-colors"
                >
                  <KeyIcon className="w-3.5 h-3.5 text-brass" /> Settings
                </Link>
              </div>
            )}

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-bone/40">
              {msgs.map((m, i) =>
                m.role === "assistant" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-end gap-2.5 max-w-[88%]"
                  >
                    <span className="w-7 h-7 shrink-0 bg-ink text-brass flex items-center justify-center">
                      <DiamondIcon className="w-2.5 h-2.5" />
                    </span>
                    <div className="border-2 border-ink bg-paper px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content || (i === msgs.length - 1 && busy ? <TypingDots /> : "")}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex justify-end"
                  >
                    <div className="bg-ink text-paper px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* chips */}
            {msgs.length <= 2 && !busy && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    data-cursor
                    onClick={() => send(c)}
                    className="border-2 border-ink/20 bg-paper px-3 py-1.5 text-[11px] text-mist hover:border-gold hover:text-gold hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* retry status */}
            <AnimatePresence>
              {retryNote && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-3"
                >
                  <div className="flex items-center gap-2.5 border-2 border-gold/50 bg-gold/10 px-3 py-2">
                    <span className="w-3.5 h-3.5 border-2 border-gold/30 border-t-gold rounded-full animate-spin shrink-0" />
                    <span className="text-[11px] text-gold font-mono tracking-wide">{retryNote}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* input */}
            <div className="border-t-2 border-ink p-3.5 bg-paper">
              <div className="flex items-end gap-2.5 border-2 border-ink/20 focus-within:border-ink bg-bone/50 transition-colors px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder={hasKey ? "Ask the maison anything…" : "The line is offline — set a key in the dashboard"}
                  className="flex-1 resize-none bg-transparent text-sm focus:outline-none placeholder:text-mist/60 max-h-24 py-1.5"
                  aria-label="Message the concierge"
                />
                <button
                  data-cursor
                  onClick={() => send(input)}
                  disabled={busy || !input.trim()}
                  className="shrink-0 w-10 h-10 bg-ink text-brass flex items-center justify-center hover:bg-gold hover:text-ink transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Send message"
                >
                  {busy ? (
                    <span className="w-4 h-4 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
                  ) : (
                    <SendIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[8px] tracking-[0.22em] uppercase text-mist/70">
                Powered by OpenRouter · answers are guidance, the ledger is truth
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating button */}
      <motion.button
        data-cursor
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-4 md:right-6 z-[84] w-14 h-14 md:w-16 md:h-16 bg-ink text-brass border-2 border-ink shadow-[6px_6px_0_rgba(151,114,29,0.5)] flex items-center justify-center hover:bg-coal hover:-translate-y-1 transition-all duration-300"
        aria-label={open ? "Close concierge chat" : "Open concierge chat"}
      >
        <span className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "chat"}
              initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="block"
            >
              {open ? <CloseIcon className="w-6 h-6" /> : <ChatIcon className="w-6 h-6" />}
            </motion.span>
          </AnimatePresence>
          {!open && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-70" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brass border border-ink" />
            </span>
          )}
        </span>
      </motion.button>
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" aria-label="Concierge is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
