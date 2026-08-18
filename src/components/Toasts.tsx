import { AnimatePresence, motion } from "framer-motion";
import type { ToastItem } from "../store/CartContext";

export default function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 left-6 z-[88] flex flex-col gap-3 max-w-[330px]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-ink bg-paper px-5 py-4 shadow-[6px_6px_0_rgba(23,21,16,0.9)]"
          >
            <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase font-medium text-ink">
              <span className="w-2 h-2 bg-brass shrink-0" />
              {t.title}
            </div>
            {t.body && <p className="mt-1.5 pl-[18px] text-xs text-mist">{t.body}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
