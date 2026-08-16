import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { addOrder, makeOrderId } from "../store/orders";
import { FREE_SHIP_AT, SHIPPING_FLAT, formatPrice } from "../data/products";
import {
  ArrowRight,
  CardIcon,
  CheckIcon,
  LockIcon,
  PackageIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "../components/Icons";
import { LineMaskReveal, Reveal } from "../components/shared";

const STEPS = ["Details", "Delivery", "Payment"];

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Courier Standard", cost: SHIPPING_FLAT, eta: "5–7 working days", note: "Insured, tracked to the door" },
  { id: "whiteglove", name: "White-Glove", cost: 60, eta: "2–3 working days", note: "Hand-carried, gloves on" },
  { id: "pickup", name: "Atelier Pickup", cost: 0, eta: "Same day, Geneva", note: "Rue du Rhône 12, with coffee" },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export default function Checkout() {
  const { lines, subtotal, discount, promo, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [shippingId, setShippingId] = useState("standard");
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "Switzerland",
    cardName: user?.name ?? "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const afterDiscount = subtotal - discount;
  const shippingOpt = SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0];
  const shipping = shippingId === "standard" && afterDiscount >= FREE_SHIP_AT ? 0 : shippingOpt.cost;
  const total = afterDiscount + shipping;

  const itemCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  if (!user) return <Navigate to="/auth?next=/checkout" replace />;
  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (form.name.trim().length < 2) errs.name = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Valid email required";
      if (form.phone.replace(/\D/g, "").length < 7) errs.phone = "Valid phone required";
      if (form.address.trim().length < 5) errs.address = "Required";
      if (form.city.trim().length < 2) errs.city = "Required";
      if (form.zip.trim().length < 2) errs.zip = "Required";
    }
    if (step === 2) {
      if (form.cardName.trim().length < 2) errs.cardName = "Required";
      if (form.cardNumber.replace(/\s/g, "").length !== 16 || /\D/.test(form.cardNumber.replace(/\s/g, "")))
        errs.cardNumber = "16 digits required";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry.trim())) errs.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(form.cvc.trim())) errs.cvc = "3–4 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 2) go(step + 1);
    else placeOrder();
  };

  const placeOrder = () => {
    setPlacing(true);
    window.setTimeout(() => {
      const id = makeOrderId();
      addOrder({
        id,
        email: user.email,
        name: form.name,
        date: new Date().toISOString(),
        items: lines.map((l) => ({
          id: l.product.id,
          name: l.product.name,
          category: l.product.category,
          price: l.product.price,
          qty: l.qty,
          img: l.product.img,
        })),
        subtotal,
        discount,
        promoCode: promo?.code ?? null,
        shippingMethod: shippingOpt.name,
        shippingCost: shipping,
        total,
        address: `${form.address}, ${form.city} ${form.zip}, ${form.country}`,
        status: "sealed",
      });
      clear();
      navigate(`/order/${id}`, { replace: true });
    }, 1100);
  };

  const inputCls = (key: string) =>
    `mt-2 w-full bg-bone/50 border-2 px-4 py-3.5 focus:outline-none transition-colors ${
      errors[key] ? "border-rust" : "border-ink/20 focus:border-ink"
    }`;

  const labelCls = "font-mono text-[10px] tracking-[0.24em] uppercase text-mist";

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
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
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-gold">
            <span className="w-2 h-2 bg-brass" /> Concierge checkout
          </motion.div>
          <LineMaskReveal
            className="mt-5 font-display font-extrabold tracking-tight leading-[0.92] text-5xl md:text-6xl"
            lines={[
              <>
                Seal <span className="italic font-medium text-gold">the order.</span>
              </>,
            ]}
          />
        </div>

        {/* step rail */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  data-cursor
                  onClick={() => i < step && go(i)}
                  disabled={i > step}
                  className={`flex items-center gap-3 ${i > step ? "cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`w-10 h-10 border-2 flex items-center justify-center font-display font-bold transition-all duration-400 ${
                      i < step
                        ? "bg-pine text-paper border-pine"
                        : i === step
                        ? "bg-ink text-brass border-ink scale-110"
                        : "border-ink/20 text-mist"
                    }`}
                  >
                    {i < step ? <CheckIcon className="w-4 h-4" /> : i + 1}
                  </span>
                  <span className={`hidden sm:block font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${i === step ? "text-ink" : "text-mist"}`}>
                    {s}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="flex-1 mx-4 h-[2px] bg-ink/10 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-brass"
                      initial={false}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
          {/* step content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="border-2 border-ink bg-paper p-6 md:p-9"
              >
                {step === 0 && (
                  <>
                    <h2 className="flex items-center gap-3 font-display font-extrabold text-2xl">
                      <UserIcon className="w-5 h-5 text-gold" /> Who receives the seal?
                    </h2>
                    <div className="mt-7 grid md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Full name</label>
                        <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls("name")} placeholder="Élodie Vasseur" />
                        {errors.name && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls("email")} placeholder="you@correspondence.com" />
                        {errors.email && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.email}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls("phone")} placeholder="+41 79 000 00 00" />
                        {errors.phone && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Country</label>
                        <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls("country")}>
                          {["Switzerland", "France", "United Kingdom", "United States", "United Arab Emirates", "Japan", "Singapore", "Elsewhere on Earth"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Street address</label>
                        <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls("address")} placeholder="Quai du Mont-Blanc 7" />
                        {errors.address && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.address}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>City</label>
                        <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls("city")} placeholder="Geneva" />
                        {errors.city && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.city}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Postal code</label>
                        <input value={form.zip} onChange={(e) => set("zip", e.target.value)} className={inputCls("zip")} placeholder="1201" />
                        {errors.zip && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.zip}</p>}
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="flex items-center gap-3 font-display font-extrabold text-2xl">
                      <TruckIcon className="w-5 h-5 text-gold" /> How shall it travel?
                    </h2>
                    <div className="mt-7 space-y-4">
                      {SHIPPING_OPTIONS.map((o) => {
                        const cost = o.id === "standard" && afterDiscount >= FREE_SHIP_AT ? 0 : o.cost;
                        const active = shippingId === o.id;
                        return (
                          <button
                            key={o.id}
                            data-cursor
                            onClick={() => setShippingId(o.id)}
                            className={`w-full text-left border-2 p-5 md:p-6 flex items-center gap-5 transition-all duration-300 ${
                              active ? "border-ink bg-bone/70 shadow-[6px_6px_0_rgba(23,21,16,0.9)]" : "border-ink/20 hover:border-ink"
                            }`}
                          >
                            <span className={`w-5 h-5 border-2 shrink-0 flex items-center justify-center transition-colors ${active ? "border-ink bg-brass" : "border-ink/30"}`}>
                              {active && <span className="w-2 h-2 bg-ink" />}
                            </span>
                            <span className="flex-1">
                              <span className="flex flex-wrap items-baseline gap-x-4">
                                <span className="font-display font-bold text-lg">{o.name}</span>
                                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-mist">{o.eta}</span>
                              </span>
                              <span className="block mt-1 text-sm text-mist">{o.note}</span>
                            </span>
                            <span className={`font-display font-bold text-lg tabular-nums ${cost === 0 ? "text-pine" : ""}`}>
                              {cost === 0 ? "Free" : formatPrice(cost)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {afterDiscount >= FREE_SHIP_AT && (
                      <p className="mt-4 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-pine">
                        <TagIcon className="w-4 h-4" /> Standard delivery is complimentary above {formatPrice(FREE_SHIP_AT)}
                      </p>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="flex items-center gap-3 font-display font-extrabold text-2xl">
                      <CardIcon className="w-5 h-5 text-gold" /> The final stroke.
                    </h2>
                    <div className="mt-7 space-y-5">
                      <div>
                        <label className={labelCls}>Name on card</label>
                        <input value={form.cardName} onChange={(e) => set("cardName", e.target.value)} className={inputCls("cardName")} placeholder="ÉLODIE VASSEUR" />
                        {errors.cardName && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.cardName}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Card number</label>
                        <div className={`mt-2 flex items-center border-2 bg-bone/50 transition-colors ${errors.cardNumber ? "border-rust" : "border-ink/20 focus-within:border-ink"}`}>
                          <input
                            value={form.cardNumber}
                            onChange={(e) => set("cardNumber", formatCard(e.target.value))}
                            className="flex-1 min-w-0 bg-transparent px-4 py-3.5 font-mono tracking-[0.14em] focus:outline-none placeholder:text-mist/50"
                            placeholder="4242 4242 4242 4242"
                            inputMode="numeric"
                          />
                          <CardIcon className="w-5 h-5 mr-4 text-gold shrink-0" />
                        </div>
                        {errors.cardNumber && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Expiry</label>
                          <input value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} className={inputCls("expiry")} placeholder="12/29" inputMode="numeric" />
                          {errors.expiry && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className={labelCls}>CVC</label>
                          <input value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} className={inputCls("cvc")} placeholder="123" inputMode="numeric" />
                          {errors.cvc && <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-rust">{errors.cvc}</p>}
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 flex items-center gap-2.5 text-xs text-mist">
                      <LockIcon className="w-4 h-4 text-gold shrink-0" />
                      This is a concept boutique — nothing is charged, no numbers leave your browser.
                    </p>
                  </>
                )}

                {/* nav buttons */}
                <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      data-cursor
                      onClick={() => go(step - 1)}
                      className="group border-2 border-ink px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-paper transition-all duration-300 flex items-center gap-3"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                      Back
                    </button>
                  ) : (
                    <Link to="/cart" data-cursor className="group font-mono text-[11px] tracking-[0.24em] uppercase text-mist hover:text-ink transition-colors flex items-center gap-3">
                      <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                      Back to vault
                    </Link>
                  )}
                  <button
                    data-cursor
                    onClick={next}
                    disabled={placing}
                    className="btn-sheen group bg-ink text-paper px-9 py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center gap-3 disabled:opacity-70"
                  >
                    {placing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                        Sealing…
                      </>
                    ) : step === 2 ? (
                      <>
                        <LockIcon className="w-4 h-4 text-brass" />
                        Place order — {formatPrice(total)}
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* summary sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
            <Reveal delay={0.15}>
              <div className="border-2 border-ink bg-paper">
                <div className="px-6 py-5 border-b-2 border-ink flex items-center justify-between">
                  <span className="font-display font-extrabold text-xl flex items-center gap-2.5">
                    <PackageIcon className="w-5 h-5 text-gold" /> Summary
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-mist">{itemCount} objets</span>
                </div>
                <ul className="max-h-72 overflow-y-auto divide-y divide-ink/10">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex items-center gap-3.5 px-6 py-4">
                      <span className="relative w-14 h-14 plate-dark border border-ink/20 p-1 shrink-0">
                        <img src={product.img} alt={product.name} className="blend-lighten w-full h-full object-contain" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-brass text-ink text-[10px] font-bold rounded-full flex items-center justify-center border border-ink tabular-nums">
                          {qty}
                        </span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-medium text-sm truncate block">{product.name}</span>
                        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-mist">{product.category}</span>
                      </span>
                      <span className="text-sm tabular-nums">{formatPrice(product.price * qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="px-6 py-5 border-t-2 border-ink space-y-2.5 text-sm bg-bone/50">
                  <div className="flex justify-between"><span className="text-mist">Subtotal</span><span className="tabular-nums">{formatPrice(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gold font-medium">
                      <span className="flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" />{promo?.code}</span>
                      <span className="tabular-nums">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="text-mist">Delivery</span><span className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                  <div className="flex justify-between items-baseline border-t-2 border-ink pt-3">
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase">Total</span>
                    <span className="font-display font-extrabold text-3xl tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
