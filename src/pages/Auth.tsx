import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { ArrowRight, EyeIcon, EyeOffIcon, LockIcon, LogoMark, UserIcon } from "../components/Icons";
import { OrbitBadge } from "../components/shared";

type Mode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const { login, signup } = useAuth();
  const { pushToast } = useCart();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") ?? "/profile";

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setFieldErr({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2) errs.name = "Your name, please";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = "A valid address, please";
    if (pass.length < 6) errs.pass = "At least six characters";
    setFieldErr(errs);
    setError(null);
    if (Object.keys(errs).length) return;

    setBusy(true);
    window.setTimeout(() => {
      const err = mode === "login" ? login(email, pass) : signup(name, email, pass);
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      pushToast(mode === "login" ? "Welcome back" : "Welcome to the register", "Your member number is being engraved.");
      navigate(next, { replace: true });
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pt-24 md:pt-28 min-h-screen grid lg:grid-cols-2"
    >
      {/* left: dark panel */}
      <div className="relative hidden lg:flex flex-col justify-between plate-dark text-paper border-b-2 lg:border-b-0 lg:border-r-2 border-ink p-12 overflow-hidden">
        <span className="absolute -right-16 top-10 font-display font-extrabold text-[16rem] leading-none text-outline-paper select-none" aria-hidden>
          A.
        </span>
        <div className="relative">
          <div className="flex items-center gap-3">
            <LogoMark className="w-7 h-7 text-brass" />
            <span className="font-display font-extrabold tracking-[0.28em] text-xl">AURION</span>
          </div>
          <h1 className="mt-14 font-display font-extrabold tracking-tight leading-[0.92] text-5xl xl:text-6xl">
            One key to the <span className="italic font-medium text-brass">maison.</span>
          </h1>
          <p className="mt-6 max-w-sm text-paper/55 leading-relaxed">
            Members follow every run from billet to seal — first access, service ledgers,
            and the private list. Your serial history lives here.
          </p>
        </div>
        <div className="relative flex items-end justify-between">
          <ul className="space-y-3">
            {["Track every order & serial", "Atelier invitations", "Member-only runs"].map((b, i) => (
              <li key={b} className="flex items-center gap-3 text-sm text-paper/70">
                <span className="font-mono text-[10px] text-brass">0{i + 1}</span>
                <span className="w-6 h-px bg-brass/60" />
                {b}
              </li>
            ))}
          </ul>
          <OrbitBadge light size={104} />
        </div>
      </div>

      {/* right: form */}
      <div className="flex items-center justify-center px-5 md:px-12 py-16">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gold flex items-center gap-3">
              <span className="w-2 h-2 bg-brass" /> Member entrance
            </div>
            <h2 className="mt-5 font-display font-extrabold tracking-tight text-4xl md:text-5xl">
              {mode === "login" ? (
                <>
                  Return to <span className="italic font-medium text-gold">the house.</span>
                </>
              ) : (
                <>
                  Join <span className="italic font-medium text-gold">the register.</span>
                </>
              )}
            </h2>
          </motion.div>

          {/* mode switch */}
          <div className="mt-8 grid grid-cols-2 border-2 border-ink relative">
            <motion.span
              layout
              className="absolute inset-y-0 w-1/2 bg-ink"
              animate={{ left: mode === "login" ? "0%" : "50%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                data-cursor
                onClick={() => switchMode(m)}
                className={`relative z-10 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                  mode === m ? "text-paper" : "text-mist hover:text-ink"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            onSubmit={submit}
            className="mt-8 space-y-5"
            noValidate
          >
            {mode === "signup" && (
              <div>
                <label htmlFor="a-name" className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Full name</label>
                <div className={`mt-2 flex items-center border-2 bg-bone/50 transition-colors ${fieldErr.name ? "border-rust" : "border-ink/20 focus-within:border-ink"}`}>
                  <UserIcon className="w-4 h-4 ml-4 text-gold shrink-0" />
                  <input
                    id="a-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErr((f) => ({ ...f, name: "" }));
                    }}
                    className="w-full bg-transparent px-3.5 py-3.5 focus:outline-none placeholder:text-mist/60"
                    placeholder="Élodie Vasseur"
                  />
                </div>
                {fieldErr.name && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{fieldErr.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="a-email" className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Email</label>
              <div className={`mt-2 flex items-center border-2 bg-bone/50 transition-colors ${fieldErr.email ? "border-rust" : "border-ink/20 focus-within:border-ink"}`}>
                <LogoMark className="w-3.5 h-3.5 ml-4 text-gold shrink-0" />
                <input
                  id="a-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErr((f) => ({ ...f, email: "" }));
                  }}
                  className="w-full bg-transparent px-3.5 py-3.5 focus:outline-none placeholder:text-mist/60"
                  placeholder="you@correspondence.com"
                />
              </div>
              {fieldErr.email && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{fieldErr.email}</p>}
            </div>

            <div>
              <label htmlFor="a-pass" className="font-mono text-[10px] tracking-[0.24em] uppercase text-mist">Pass-phrase</label>
              <div className={`mt-2 flex items-center border-2 bg-bone/50 transition-colors ${fieldErr.pass ? "border-rust" : "border-ink/20 focus-within:border-ink"}`}>
                <LockIcon className="w-4 h-4 ml-4 text-gold shrink-0" />
                <input
                  id="a-pass"
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    setFieldErr((f) => ({ ...f, pass: "" }));
                  }}
                  className="w-full bg-transparent px-3.5 py-3.5 focus:outline-none placeholder:text-mist/60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  data-cursor
                  onClick={() => setShowPass((s) => !s)}
                  className="px-4 text-mist hover:text-ink transition-colors"
                  aria-label={showPass ? "Hide pass-phrase" : "Show pass-phrase"}
                >
                  {showPass ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {fieldErr.pass && <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-rust">{fieldErr.pass}</p>}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-rust bg-rust/10 px-4 py-3 text-sm text-rust"
              >
                {error}
              </motion.p>
            )}

            <button
              data-cursor
              type="submit"
              disabled={busy}
              className="btn-sheen group w-full bg-ink text-paper py-4 font-mono text-[11px] tracking-[0.26em] uppercase hover:bg-coal transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Unlock the door" : "Take the key"}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </>
              )}
            </button>
          </motion.form>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex-1 h-px bg-ink/15" />
            <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-mist">or</span>
            <span className="flex-1 h-px bg-ink/15" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((p) => (
              <button
                key={p}
                data-cursor
                onClick={() => pushToast(`${p} entry is by invitation`, "The maison keeps its circles small.")}
                className="border-2 border-ink/20 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-mist hover:border-ink hover:text-ink transition-all duration-300"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-mist">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button data-cursor onClick={() => switchMode("signup")} className="font-medium text-gold hover:underline underline-offset-4">
                  Join the register
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button data-cursor onClick={() => switchMode("login")} className="font-medium text-gold hover:underline underline-offset-4">
                  Sign in
                </button>
              </>
            )}{" "}
            — or <Link to="/" className="underline underline-offset-4 hover:text-gold">browse as a guest</Link>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
