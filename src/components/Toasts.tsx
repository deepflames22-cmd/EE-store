import { AnimatePresence, motion } from "framer-motion";
import { DiamondIcon } from "./Icons";

export type ToastItem = { id: number; title: string; body?: string };

export default function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 left-6 z-[88] flex flex-col gap-3 max-w-[320px]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border border-gold/40 bg-coal/95 backdrop-blur px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2.5 text-goldlight text-[11px] tracking-[0.22em] uppercase font-medium">
              <DiamondIcon className="w-2 h-2 text-gold" />
              {t.title}
            </div>
            {t.body && <p className="mt-1.5 pl-[18px] text-xs text-fog font-light">{t.body}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
