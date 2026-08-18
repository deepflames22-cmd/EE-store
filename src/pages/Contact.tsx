import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CloseIcon, GlobeIcon, PlusIcon, ShieldIcon, TruckIcon } from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";
import { useCart } from "../store/CartContext";

const FAQS: Array<[string, string]> = [
  ["How does numbered-run shipping work?", "Orders are sealed against the register and dispatched within five working days. Over $500, delivery is white-glove: insured, signature on receipt, packaging reclaimed by the courier."],
  ["What is the return window?", "Thirty days, no questions. The objet returns to the register, your serial is retired, and the piece is re-finished before it may be sold again."],
  ["Is the gold finish real?", "It is a 24-karat PVD vapour coat over bead-blasted aluminium — microns thin, metallurgically bonded, and rated for decades of daily wear without flaking."],
  ["Can my objet be repaired after the warranty?", "Yes. The atelier services every serial ever issued, for life. Send the piece home and it returns with a service ledger entry and a fresh polish."],
  ["Do you offer engraving?", "Each certificate card is hand-lettered on request, and case-backs accept up to twenty characters in the maison's own cut."],
];

const TOPICS = ["A specific objet", "Run 08 waitlist", "Atelier visit", "Service & repair", "Something else"];

export default function Contact() {
  const { pushToast } = useCart();
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Your name, please";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "A valid address, please";
    if (form.message.trim().length < 10) errs.message = "A few more words, please";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      pushToast("Letter received", "The concierge replies within one working day.");
    }
  };

  const field = (key: "name" | "email" | "message", value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-28 md:pt-36 pb-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold"
          >
            <span className="w-2 h-2 bg-brass" /> Concierge — replies within a day
          </motion.div>
          <LineMaskReveal
            className="mt-6 font-display font-extrabold tracking-tight leading-[0.9] text-[clamp(2.8rem,7vw,6.5rem)]"
            lines={[
              <>Write to the</>,
              <>
                <span className="italic font-medium text-gold">maison.</span>
              </>,
            ]}
          />
        </div>

        <div className="mt-14 grid lg:grid-cols-12 gap-12">
          {/* form */}
          <div className="lg:col-span-7">
            <Reveal>
              {sent ? (
                <div className="border-2 border-ink bg-bone/70 p-10 md:p-14 text-center">
                  <span className="inline-block w-16 h-16 bg-brass border-2 border-ink rounded-full items-center justify-center flex">
                    <ArrowRight className="w-6 h-6 text-ink -rotate-45" />
                  </span>
                  <h2 className="mt-6 font-display font-extrabold text-3xl md:text-4xl">Your letter is on its way.</h2>
                  <p className="mt-3 text-mist max-w-md mx-auto">
                    The concierge reads everything personally. Expect a reply at{" "}
                    <span className="text-ink font-medium">{form.email}</span> within one working day.
                  </p>
                  <button
                    data-cursor
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
                    }}
                    className="mt-8 border-2 border-ink px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-paper transition-all duration-300"
                  >
                    Write another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="border-2 border-ink bg-paper p-7 md:p-10" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="c-name" className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist">Name</label>
                      <input
                        id="c-name"
                        value={form.name}
                        onChange={(e) => field("name", e.target.value)}
                        className={`mt-2 w-full bg-bone/50 border-2 px-4 py-3.5 focus:outline-none transition-colors ${errors.name ? "border-rust" : "border-ink/20 focus:border-ink"}`}
                        placeholder="Élodie Vasseur"
                      />
                      {errors.name && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist">Email</label>
                      <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => field("email", e.target.value)}
                        className={`mt-2 w-full bg-bone/50 border-2 px-4 py-3.5 focus:outline-none transition-colors ${errors.email ? "border-rust" : "border-ink/20 focus:border-ink"}`}
                        placeholder="you@correspondence.com"
                      />
                      {errors.email && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist">Subject</span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          data-cursor
                          onClick={() => setForm((f) => ({ ...f, topic: t }))}
                          className={`px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase border-2 transition-all duration-300 ${
                            form.topic === t ? "bg-ink text-paper border-ink" : "border-ink/20 text-mist hover:border-ink hover:text-ink"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="c-msg" className="font-mono text-[10px] tracking-[0.26em] uppercase text-mist">Your letter</label>
                    <textarea
                      id="c-msg"
                      rows={5}
                      value={form.message}
                      onChange={(e) => field("message", e.target.value)}
                      className={`mt-2 w-full bg-bone/50 border-2 px-4 py-3.5 focus:outline-none transition-colors resize-none ${errors.message ? "border-rust" : "border-ink/20 focus:border-ink"}`}
                      placeholder="Tell us about the objet, the serial, or the occasion…"
                    />
                    {errors.message && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{errors.message}</p>}
                  </div>

                  <button
                    data-cursor
                    type="submit"
                    className="btn-sheen group mt-8 w-full md:w-auto bg-ink text-paper px-10 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center justify-center gap-3"
                  >
                    Send the letter
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                </form>
              )}
            </Reveal>
          </div>

          {/* aside */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={0.1}>
              <div className="bg-ink text-paper border-2 border-ink p-8">
                <h3 className="font-display font-bold text-2xl">
                  The Showroom<span className="text-brass">.</span>
                </h3>
                <ul className="mt-6 space-y-4 text-sm text-paper/70">
                  <li className="flex justify-between gap-6 border-b border-paper/10 pb-4">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass shrink-0">Address</span>
                    <span className="text-right">Rue du Rhône 12, Geneva</span>
                  </li>
                  <li className="flex justify-between gap-6 border-b border-paper/10 pb-4">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass shrink-0">Hours</span>
                    <span className="text-right">Tue — Sat, 10:00 to 18:30</span>
                  </li>
                  <li className="flex justify-between gap-6 border-b border-paper/10 pb-4">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass shrink-0">Line</span>
                    <span className="text-right">+41 22 555 01 19</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass shrink-0">Write</span>
                    <span className="text-right">concierge@aurion.example</span>
                  </li>
                </ul>
                <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: <TruckIcon className="w-5 h-5" />, label: "Insured ship" },
                    { icon: <ShieldIcon className="w-5 h-5" />, label: "Life service" },
                    { icon: <GlobeIcon className="w-5 h-5" />, label: "38 countries" },
                  ].map((x) => (
                    <div key={x.label} className="border border-paper/15 py-4 text-brass">
                      <span className="flex justify-center">{x.icon}</span>
                      <span className="mt-2 block font-mono text-[9px] tracking-[0.18em] uppercase text-paper/60">{x.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="border-2 border-ink bg-paper">
                <h3 className="font-display font-bold text-2xl px-8 pt-8">
                  Questions, <span className="italic font-medium text-gold">answered.</span>
                </h3>
                <div className="mt-4 px-4 pb-4">
                  {FAQS.map(([q, a], i) => {
                    const open = faqOpen === i;
                    return (
                      <div key={q} className="border-b border-ink/15 last:border-b-0">
                        <button
                          data-cursor
                          onClick={() => setFaqOpen(open ? null : i)}
                          className="w-full flex items-center justify-between gap-4 px-4 py-5 text-left group"
                          aria-expanded={open}
                        >
                          <span className={`font-medium transition-colors ${open ? "text-gold" : "group-hover:text-gold"}`}>{q}</span>
                          <span className={`shrink-0 w-8 h-8 border-2 flex items-center justify-center transition-all duration-300 ${open ? "bg-ink text-paper border-ink rotate-45" : "border-ink/25 group-hover:border-ink"}`}>
                            {open ? <CloseIcon className="w-3.5 h-3.5 -rotate-45" /> : <PlusIcon className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-6 text-sm text-mist leading-relaxed max-w-md">{a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
