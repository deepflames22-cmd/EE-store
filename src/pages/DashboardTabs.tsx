import { useState } from "react";
import { CATEGORIES, formatPrice, type Category, type Product } from "../data/products";
import { useSite, type SiteConfig } from "../store/site";
import { useCart } from "../store/CartContext";
import { CheckIcon, CloseIcon, PlusIcon } from "../components/Icons";

/* ---------------- primitives ---------------- */

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45 mb-2">{children}</label>;
}

const inputCls = "w-full bg-ink border border-paper/15 px-3.5 py-2.5 text-sm text-paper focus:outline-none focus:border-brass transition-colors";

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}

function AreaInput({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputCls} resize-none`} />;
}

function NumInput({ value, onChange, step = 1, min = 0 }: { value: number; onChange: (v: number) => void; step?: number; min?: number }) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={min}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`${inputCls} tabular-nums`}
    />
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      data-cursor
      onClick={() => onChange(!on)}
      className={`relative w-12 h-6 border transition-colors duration-300 ${on ? "bg-brass border-brass" : "bg-ink border-paper/25"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-4.5 h-4.5 w-4 h-4 transition-all duration-300 ${on ? "left-6 bg-ink" : "left-1 bg-paper/50"}`}
      />
    </button>
  );
}

function SaveBar({ onSave, label = "Save to the storefront" }: { onSave: () => void; label?: string }) {
  return (
    <button
      data-cursor
      onClick={onSave}
      className="btn-sheen w-full bg-brass text-ink py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase font-medium hover:bg-goldlight transition-colors flex items-center justify-center gap-2.5"
    >
      <CheckIcon className="w-4 h-4" /> {label}
    </button>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="border border-paper/12 bg-coal/70 p-6">
      <h3 className="font-display font-bold text-lg text-paper">{title}</h3>
      {note && <p className="mt-1 text-xs text-paper/40">{note}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function StrListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span key={`${it}-${i}`} className="flex items-center gap-2 border border-paper/20 px-3 py-1.5 text-xs text-paper/80">
            {it}
            <button data-cursor onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-paper/40 hover:text-[#d98a72] transition-colors" aria-label={`Remove ${it}`}>
              <CloseIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <button
          data-cursor
          onClick={() => {
            if (draft.trim()) {
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          className="shrink-0 border border-paper/25 px-4 text-paper/70 hover:bg-brass hover:text-ink hover:border-brass transition-all"
          aria-label="Add item"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Branding tab ---------------- */

export function BrandingTab() {
  const { site, saveSite } = useSite();
  const { pushToast } = useCart();
  const [brand, setBrand] = useState(site.brand);
  const [hero, setHero] = useState(site.hero);
  const [shop, setShop] = useState(site.shop);
  const [maint, setMaint] = useState(site.maintenance);
  const [ai, setAi] = useState(site.ai);

  const save = () => {
    saveSite({ ...site, brand, hero, shop, maintenance: maint, ai });
    pushToast("Branding saved", "Name, hero, shop copy and AI voice are live.");
  };

  return (
    <div className="grid xl:grid-cols-2 gap-4 items-start">
      <div className="space-y-4">
        <Panel title="Maison identity" note="Shown in the nav, footer and browser tab.">
          <div><Label>Store name</Label><TextInput value={brand.name} onChange={(v) => setBrand((b) => ({ ...b, name: v }))} /></div>
          <div><Label>Tagline</Label><TextInput value={brand.tagline} onChange={(v) => setBrand((b) => ({ ...b, tagline: v }))} /></div>
          <div><Label>Established</Label><TextInput value={brand.est} onChange={(v) => setBrand((b) => ({ ...b, est: v }))} /></div>
          <div><Label>Footer note</Label><AreaInput value={brand.footerNote} onChange={(v) => setBrand((b) => ({ ...b, footerNote: v }))} /></div>
          <div><Label>“As seen in” press list</Label><StrListEditor items={brand.press} onChange={(v) => setBrand((b) => ({ ...b, press: v }))} placeholder="Publication name…" /></div>
        </Panel>
        <Panel title="Concierge voice (AI)" note="Persona and tone fed to the OpenRouter concierge.">
          <div><Label>Persona</Label><AreaInput value={ai.persona} onChange={(v) => setAi((a) => ({ ...a, persona: v }))} /></div>
          <div><Label>Tone</Label><AreaInput value={ai.tone} onChange={(v) => setAi((a) => ({ ...a, tone: v }))} /></div>
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel title="Homepage hero">
          <div><Label>Kicker</Label><TextInput value={hero.kicker} onChange={(v) => setHero((h) => ({ ...h, kicker: v }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Headline line 1</Label><TextInput value={hero.line1} onChange={(v) => setHero((h) => ({ ...h, line1: v }))} /></div>
            <div><Label>Headline line 2</Label><TextInput value={hero.line2} onChange={(v) => setHero((h) => ({ ...h, line2: v }))} /></div>
          </div>
          <div><Label>Gold accent word</Label><TextInput value={hero.accent} onChange={(v) => setHero((h) => ({ ...h, accent: v }))} /></div>
          <div><Label>Sub-copy</Label><AreaInput value={hero.sub} onChange={(v) => setHero((h) => ({ ...h, sub: v }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>CTA — shop</Label><TextInput value={hero.ctaShop} onChange={(v) => setHero((h) => ({ ...h, ctaShop: v }))} /></div>
            <div><Label>CTA — 360°</Label><TextInput value={hero.ctaView} onChange={(v) => setHero((h) => ({ ...h, ctaView: v }))} /></div>
          </div>
        </Panel>
        <Panel title="Shop page">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Headline</Label><TextInput value={shop.headline} onChange={(v) => setShop((s) => ({ ...s, headline: v }))} /></div>
            <div><Label>Accent</Label><TextInput value={shop.accent} onChange={(v) => setShop((s) => ({ ...s, accent: v }))} /></div>
          </div>
          <div><Label>Sub-copy</Label><AreaInput value={shop.sub} onChange={(v) => setShop((s) => ({ ...s, sub: v }))} /></div>
        </Panel>
        <Panel title="Maintenance mode" note="Replaces the storefront with a closing notice. The console stays open.">
          <div className="flex items-center justify-between">
            <span className="text-sm text-paper/70">Storefront closed for polishing</span>
            <Toggle on={maint.enabled} onChange={(v) => setMaint((m) => ({ ...m, enabled: v }))} />
          </div>
          <div><Label>Notice title</Label><TextInput value={maint.title} onChange={(v) => setMaint((m) => ({ ...m, title: v }))} /></div>
          <div><Label>Notice note</Label><AreaInput value={maint.note} onChange={(v) => setMaint((m) => ({ ...m, note: v }))} /></div>
        </Panel>
        <SaveBar onSave={save} />
      </div>
    </div>
  );
}

/* ---------------- Homepage tab ---------------- */

const SECTION_LABELS: Array<[keyof SiteConfig["sections"], string]> = [
  ["promoCountdown", "Promo countdown"],
  ["rail", "Product rail"],
  ["spotlight", "Objet of the season"],
  ["disciplines", "Choose your instrument"],
  ["bundle", "Travel Set bundle"],
  ["craft", "Atelier story"],
  ["services", "House services"],
  ["stats", "Stats band"],
  ["voices", "Owner voices"],
  ["privateList", "Private list signup"],
];

export function HomepageTab() {
  const { site, saveSite, products } = useSite();
  const { pushToast } = useCart();
  const [sec, setSec] = useState(site.sections);
  const [rail, setRail] = useState(site.rail);
  const [promo, setPromo] = useState(site.promo);
  const [spot, setSpot] = useState(site.spotlight);
  const [bundle, setBundle] = useState(site.bundle);
  const [craft, setCraft] = useState(site.craft);
  const [services, setServices] = useState(site.services);
  const [stats, setStats] = useState(site.stats);
  const [voices, setVoices] = useState(site.voices);
  const [pl, setPl] = useState(site.privateList);
  const [marquee, setMarquee] = useState(site.marquee);
  const [disc, setDisc] = useState(site.disciplines);

  const save = () => {
    saveSite({ ...site, sections: sec, rail, promo, spotlight: spot, bundle, craft, services, stats, voices, privateList: pl, marquee, disciplines: disc });
    pushToast("Homepage saved", "Sections and copy are live.");
  };

  const toggleSec = (k: keyof SiteConfig["sections"]) =>
    setSec((s) => ({ ...s, [k]: !s[k] }) as SiteConfig["sections"]);

  return (
    <div className="space-y-4">
      <Panel title="Section switches" note="Toggle any homepage section on or off.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTION_LABELS.map(([k, label]) => (
            <div key={k} className="flex items-center justify-between border border-paper/12 px-4 py-3">
              <span className="text-sm text-paper/75">{label}</span>
              <Toggle on={Boolean(sec[k])} onChange={() => toggleSec(k)} />
            </div>
          ))}
          <div className="flex items-center justify-between border border-paper/12 px-4 py-3">
            <span className="text-sm text-paper/75">Load ad takeover</span>
            <Toggle on={sec.ads.takeover} onChange={() => setSec((s) => ({ ...s, ads: { ...s.ads, takeover: !s.ads.takeover } }))} />
          </div>
          <div className="flex items-center justify-between border border-paper/12 px-4 py-3">
            <span className="text-sm text-paper/75">Shop flash-drop peek</span>
            <Toggle on={sec.ads.peek} onChange={() => setSec((s) => ({ ...s, ads: { ...s.ads, peek: !s.ads.peek } }))} />
          </div>
          <div className="flex items-center justify-between gap-3 border border-paper/12 px-4 py-3">
            <span className="text-sm text-paper/75 shrink-0">Peek product</span>
            <select value={sec.ads.peekId} onChange={(e) => setSec((s) => ({ ...s, ads: { ...s.ads, peekId: e.target.value } }))} className="bg-ink border border-paper/15 px-2 py-1.5 text-xs text-paper focus:outline-none focus:border-brass max-w-[160px]">
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </Panel>

      <div className="grid xl:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <Panel title="Promo countdown">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={promo.title} onChange={(v) => setPromo((p) => ({ ...p, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={promo.accent} onChange={(v) => setPromo((p) => ({ ...p, accent: v }))} /></div>
            </div>
            <div><Label>Sub-copy</Label><AreaInput value={promo.sub} onChange={(v) => setPromo((p) => ({ ...p, sub: v }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Countdown code</Label><TextInput value={promo.code} onChange={(v) => setPromo((p) => ({ ...p, code: v.toUpperCase() }))} /></div>
              <div><Label>Duration (hours)</Label><NumInput value={promo.hours} onChange={(v) => setPromo((p) => ({ ...p, hours: v }))} /></div>
            </div>
          </Panel>
          <Panel title="Product rail">
            <div><Label>Kicker</Label><TextInput value={rail.kicker} onChange={(v) => setRail((r) => ({ ...r, kicker: v }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={rail.title} onChange={(v) => setRail((r) => ({ ...r, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={rail.accent} onChange={(v) => setRail((r) => ({ ...r, accent: v }))} /></div>
            </div>
          </Panel>
          <Panel title="Objet of the season">
            <div><Label>Featured product</Label>
              <select value={spot.productId} onChange={(e) => setSpot((s) => ({ ...s, productId: e.target.value }))} className={inputCls}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Badge</Label><TextInput value={spot.badge} onChange={(v) => setSpot((s) => ({ ...s, badge: v }))} /></div>
              <div><Label>Kicker</Label><TextInput value={spot.note} onChange={(v) => setSpot((s) => ({ ...s, note: v }))} /></div>
            </div>
          </Panel>
          <Panel title="Travel Set bundle">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={bundle.title} onChange={(v) => setBundle((b) => ({ ...b, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={bundle.accent} onChange={(v) => setBundle((b) => ({ ...b, accent: v }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Saving (USD)</Label><NumInput value={bundle.save} step={10} onChange={(v) => setBundle((b) => ({ ...b, save: v }))} /></div>
              <div><Label>Edition note</Label><TextInput value={bundle.note} onChange={(v) => setBundle((b) => ({ ...b, note: v }))} /></div>
            </div>
            <div><Label>Sub-copy</Label><AreaInput value={bundle.sub} onChange={(v) => setBundle((b) => ({ ...b, sub: v }))} /></div>
          </Panel>
          <Panel title="Marquee ticker">
            <StrListEditor items={marquee} onChange={setMarquee} placeholder="Ticker item…" />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Atelier story">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={craft.title} onChange={(v) => setCraft((c) => ({ ...c, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={craft.accent} onChange={(v) => setCraft((c) => ({ ...c, accent: v }))} /></div>
            </div>
            <div><Label>Story copy</Label><AreaInput value={craft.copy} onChange={(v) => setCraft((c) => ({ ...c, copy: v }))} /></div>
            <div><Label>Caption</Label><TextInput value={craft.figLabel} onChange={(v) => setCraft((c) => ({ ...c, figLabel: v }))} /></div>
            <div>
              <Label>Craft points</Label>
              {craft.points.map((pt, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={pt.k} onChange={(e) => setCraft((c) => ({ ...c, points: c.points.map((x, j) => (j === i ? { ...x, k: e.target.value } : x)) }))} className={inputCls} placeholder="Term" />
                  <input value={pt.v} onChange={(e) => setCraft((c) => ({ ...c, points: c.points.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)) }))} className={inputCls} placeholder="Detail" />
                  <button data-cursor onClick={() => setCraft((c) => ({ ...c, points: c.points.filter((_, j) => j !== i) }))} className="shrink-0 border border-paper/20 px-3 text-paper/50 hover:text-[#d98a72] hover:border-[#d98a72] transition-colors" aria-label="Remove point"><CloseIcon className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <button data-cursor onClick={() => setCraft((c) => ({ ...c, points: [...c.points, { k: "", v: "" }] }))} className="border border-dashed border-paper/25 px-4 py-2 text-xs text-paper/60 hover:border-brass hover:text-brass transition-colors flex items-center gap-2"><PlusIcon className="w-3.5 h-3.5" /> Add point</button>
            </div>
          </Panel>
          <Panel title="House services">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={services.title} onChange={(v) => setServices((s) => ({ ...s, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={services.accent} onChange={(v) => setServices((s) => ({ ...s, accent: v }))} /></div>
            </div>
            {services.items.map((it, i) => (
              <div key={i} className="border border-paper/10 p-3 space-y-2">
                <div className="flex gap-2">
                  <select value={it.icon} onChange={(e) => setServices((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, icon: e.target.value as typeof it.icon } : x)) }))} className="bg-ink border border-paper/15 px-2 py-2 text-xs text-paper focus:outline-none focus:border-brass">
                    <option value="truck">Truck</option><option value="shield">Shield</option><option value="tag">Tag</option><option value="globe">Globe</option>
                  </select>
                  <input value={it.title} onChange={(e) => setServices((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) }))} className={inputCls} placeholder="Title" />
                </div>
                <input value={it.note} onChange={(e) => setServices((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) }))} className={inputCls} placeholder="Note" />
              </div>
            ))}
          </Panel>
          <Panel title="Stats band">
            {stats.items.map((st, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_70px_1.4fr_auto] gap-2 items-center mb-2">
                <NumInput value={st.value} step={0.1} onChange={(v) => setStats((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, value: v } : x)) }))} />
                <TextInput value={st.suffix} onChange={(v) => setStats((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, suffix: v } : x)) }))} />
                <NumInput value={st.decimals} onChange={(v) => setStats((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, decimals: v } : x)) }))} />
                <TextInput value={st.label} onChange={(v) => setStats((s) => ({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, label: v } : x)) }))} />
                <button data-cursor onClick={() => setStats((s) => ({ ...s, items: s.items.filter((_, j) => j !== i) }))} className="border border-paper/20 p-2 text-paper/50 hover:text-[#d98a72] transition-colors" aria-label="Remove stat"><CloseIcon className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button data-cursor onClick={() => setStats((s) => ({ ...s, items: [...s.items, { value: 0, suffix: "", decimals: 0, label: "New stat" }] }))} className="border border-dashed border-paper/25 px-4 py-2 text-xs text-paper/60 hover:border-brass hover:text-brass transition-colors flex items-center gap-2"><PlusIcon className="w-3.5 h-3.5" /> Add stat</button>
          </Panel>
          <Panel title="Owner voices">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={voices.title} onChange={(v) => setVoices((q) => ({ ...q, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={voices.accent} onChange={(v) => setVoices((q) => ({ ...q, accent: v }))} /></div>
            </div>
            {voices.quotes.map((qt, i) => (
              <div key={i} className="border border-paper/10 p-3 space-y-2">
                <AreaInput value={qt.quote} rows={2} onChange={(v) => setVoices((s) => ({ ...s, quotes: s.quotes.map((x, j) => (j === i ? { ...x, quote: v } : x)) }))} />
                <div className="flex gap-2">
                  <input value={qt.name} onChange={(e) => setVoices((s) => ({ ...s, quotes: s.quotes.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} className={inputCls} placeholder="Name" />
                  <input value={qt.role} onChange={(e) => setVoices((s) => ({ ...s, quotes: s.quotes.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)) }))} className={inputCls} placeholder="Role" />
                  <button data-cursor onClick={() => setVoices((s) => ({ ...s, quotes: s.quotes.filter((_, j) => j !== i) }))} className="shrink-0 border border-paper/20 px-3 text-paper/50 hover:text-[#d98a72] transition-colors" aria-label="Remove quote"><CloseIcon className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button data-cursor onClick={() => setVoices((s) => ({ ...s, quotes: [...s.quotes, { quote: "", name: "", role: "" }] }))} className="border border-dashed border-paper/25 px-4 py-2 text-xs text-paper/60 hover:border-brass hover:text-brass transition-colors flex items-center gap-2"><PlusIcon className="w-3.5 h-3.5" /> Add quote</button>
          </Panel>
          <Panel title="Private list">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><TextInput value={pl.title} onChange={(v) => setPl((p) => ({ ...p, title: v }))} /></div>
              <div><Label>Accent</Label><TextInput value={pl.accent} onChange={(v) => setPl((p) => ({ ...p, accent: v }))} /></div>
            </div>
            <div><Label>Sub-copy</Label><AreaInput value={pl.sub} onChange={(v) => setPl((p) => ({ ...p, sub: v }))} /></div>
            <div><Label>Members line</Label><TextInput value={pl.members} onChange={(v) => setPl((p) => ({ ...p, members: v }))} /></div>
          </Panel>
          <Panel title="Discipline shelves" note="Copy shown inside each collapsible discipline.">
            {CATEGORIES.map((c) => (
              <div key={c} className="border border-paper/10 p-3 space-y-2">
                <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-brass">{c}</div>
                <AreaInput value={disc[c]?.blurb ?? ""} rows={2} onChange={(v) => setDisc((dd) => ({ ...dd, [c]: { ...dd[c], blurb: v } }))} />
                <input value={disc[c]?.note ?? ""} onChange={(e) => setDisc((dd) => ({ ...dd, [c]: { ...dd[c], note: e.target.value } }))} className={inputCls} placeholder="House note" />
                <StrListEditor items={disc[c]?.feats ?? []} onChange={(v) => setDisc((dd) => ({ ...dd, [c]: { ...dd[c], feats: v } }))} placeholder="Feature chip…" />
              </div>
            ))}
          </Panel>
        </div>
      </div>
      <SaveBar onSave={save} />
    </div>
  );
}

/* ---------------- Catalog tab ---------------- */

export function CatalogTab() {
  const { site, products, saveSite } = useSite();
  const { pushToast } = useCart();
  const [editing, setEditing] = useState<Product | null>(null);

  const saveProduct = (p: Product) => {
    const { id, ...rest } = p;
    saveSite({ ...site, productOverrides: { ...site.productOverrides, [id]: rest } });
    pushToast("Catalog updated", `${p.name} is live on the storefront.`);
    setEditing(null);
  };

  const resetProduct = (id: string, name: string) => {
    const next = { ...site.productOverrides };
    delete next[id];
    saveSite({ ...site, productOverrides: next });
    pushToast("Reset to default", `${name} restored.`);
  };

  return (
    <div className="space-y-4">
      <Panel title="Product catalog" note="Edit any field — the storefront, shop, product pages, ads and the AI concierge all read these live.">
        <div className="space-y-2">
          {products.map((p) => {
            const overridden = Boolean(site.productOverrides[p.id]);
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-4 border border-paper/10 px-4 py-3">
                <span className="w-12 h-12 plate-dark border border-paper/15 p-1 shrink-0">
                  <img src={p.img} alt="" className="blend-lighten w-full h-full object-contain" />
                </span>
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-paper">{p.name}</span>
                    {overridden && <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-brass border border-brass/50 px-1.5 py-0.5">edited</span>}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-paper/40">{p.category} · {formatPrice(p.price)}{p.was ? ` · was ${formatPrice(p.was)}` : ""}</div>
                </div>
                <div className="flex gap-2">
                  <button data-cursor onClick={() => setEditing(p)} className="border border-paper/25 px-4 py-2 font-mono text-[9px] tracking-[0.2em] uppercase text-paper/70 hover:bg-brass hover:text-ink hover:border-brass transition-all">Edit</button>
                  {overridden && (
                    <button data-cursor onClick={() => resetProduct(p.id, p.name)} className="border border-paper/15 px-4 py-2 font-mono text-[9px] tracking-[0.2em] uppercase text-paper/40 hover:text-[#d98a72] hover:border-[#d98a72] transition-colors">Reset</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {editing && (
        <div className="fixed inset-0 z-[92] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl max-h-[86vh] overflow-y-auto border-2 border-brass bg-coal p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-2xl text-paper">Edit — {editing.name}</h3>
              <button data-cursor onClick={() => setEditing(null)} className="text-paper/50 hover:text-brass transition-colors" aria-label="Close editor"><CloseIcon /></button>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div><Label>Name</Label><TextInput value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} /></div>
              <div><Label>Category</Label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Category })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><Label>Price (USD)</Label><NumInput value={editing.price} step={10} onChange={(v) => setEditing({ ...editing, price: v })} /></div>
              <div><Label>Was price (0 = no deal)</Label><NumInput value={editing.was ?? 0} step={10} onChange={(v) => setEditing({ ...editing, was: v > 0 ? v : undefined })} /></div>
              <div><Label>Tag badge (blank = none)</Label><TextInput value={editing.tag ?? ""} onChange={(v) => setEditing({ ...editing, tag: v || undefined })} /></div>
              <div><Label>Image URL</Label><TextInput value={editing.img} onChange={(v) => setEditing({ ...editing, img: v })} /></div>
              <div className="sm:col-span-2"><Label>Blurb</Label><AreaInput value={editing.blurb} onChange={(v) => setEditing({ ...editing, blurb: v })} /></div>
              <div className="sm:col-span-2"><Label>Specs (one per line)</Label>
                <AreaInput value={editing.specs.join("\n")} rows={3} onChange={(v) => setEditing({ ...editing, specs: v.split("\n").filter(Boolean) })} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <span className="w-20 h-20 plate-dark border border-paper/15 p-1.5 shrink-0">
                <img src={editing.img} alt="" className="blend-lighten w-full h-full object-contain" />
              </span>
              <p className="text-xs text-paper/40">Live preview of the plate image. Transparent black-background shots blend best.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button data-cursor onClick={() => saveProduct(editing)} className="btn-sheen flex-1 bg-brass text-ink py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase font-medium hover:bg-goldlight transition-colors">Save product</button>
              <button data-cursor onClick={() => setEditing(null)} className="border border-paper/25 px-6 font-mono text-[10px] tracking-[0.24em] uppercase text-paper/60 hover:text-paper transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Shipping & policies tab ---------------- */

export function ShippingTab() {
  const { site, saveSite } = useSite();
  const { pushToast } = useCart();
  const [ship, setShip] = useState(site.shipping);
  const [room, setRoom] = useState(site.showroom);
  const [faq, setFaq] = useState(site.faq);

  const save = () => {
    saveSite({ ...site, shipping: ship, showroom: room, faq });
    pushToast("Policies saved", "Cart, checkout and contact pages updated.");
  };

  return (
    <div className="grid xl:grid-cols-2 gap-4 items-start">
      <div className="space-y-4">
        <Panel title="Delivery rules">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Standard rate (USD)</Label><NumInput value={ship.flat} step={5} onChange={(v) => setShip((s) => ({ ...s, flat: v }))} /></div>
            <div><Label>Free threshold (USD)</Label><NumInput value={ship.freeAt} step={50} onChange={(v) => setShip((s) => ({ ...s, freeAt: v }))} /></div>
          </div>
        </Panel>
        <Panel title="Delivery options" note="Shown at checkout. Standard becomes free above the threshold.">
          {ship.options.map((o, i) => (
            <div key={o.id} className="border border-paper/10 p-3 space-y-2">
              <div className="grid grid-cols-[1.4fr_90px] gap-2">
                <input value={o.name} onChange={(e) => setShip((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} className={inputCls} placeholder="Name" />
                <NumInput value={o.cost} step={5} onChange={(v) => setShip((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, cost: v } : x)) }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={o.eta} onChange={(e) => setShip((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, eta: e.target.value } : x)) }))} className={inputCls} placeholder="ETA" />
                <input value={o.note} onChange={(e) => setShip((s) => ({ ...s, options: s.options.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) }))} className={inputCls} placeholder="Note" />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Showroom & concierge" note="Shown on the contact page and fed to the AI concierge.">
          <div><Label>Address</Label><TextInput value={room.address} onChange={(v) => setRoom((r) => ({ ...r, address: v }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Hours</Label><TextInput value={room.hours} onChange={(v) => setRoom((r) => ({ ...r, hours: v }))} /></div>
            <div><Label>Phone</Label><TextInput value={room.phone} onChange={(v) => setRoom((r) => ({ ...r, phone: v }))} /></div>
          </div>
          <div><Label>Email</Label><TextInput value={room.email} onChange={(v) => setRoom((r) => ({ ...r, email: v }))} /></div>
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel title="FAQ (contact page)">
          {faq.map((f, i) => (
            <div key={i} className="border border-paper/10 p-3 space-y-2">
              <div className="flex gap-2">
                <input value={f.q} onChange={(e) => setFaq((fs) => fs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} className={inputCls} placeholder="Question" />
                <button data-cursor onClick={() => setFaq((fs) => fs.filter((_, j) => j !== i))} className="shrink-0 border border-paper/20 px-3 text-paper/50 hover:text-[#d98a72] transition-colors" aria-label="Remove FAQ"><CloseIcon className="w-3.5 h-3.5" /></button>
              </div>
              <AreaInput value={f.a} rows={2} onChange={(v) => setFaq((fs) => fs.map((x, j) => (j === i ? { ...x, a: v } : x)))} />
            </div>
          ))}
          <button data-cursor onClick={() => setFaq((fs) => [...fs, { q: "", a: "" }])} className="border border-dashed border-paper/25 px-4 py-2 text-xs text-paper/60 hover:border-brass hover:text-brass transition-colors flex items-center gap-2"><PlusIcon className="w-3.5 h-3.5" /> Add question</button>
        </Panel>
        <SaveBar onSave={save} />
      </div>
    </div>
  );
}


