import { CATEGORIES, type Category } from "../data/products";
import { ArrowUpRight, InstagramIcon, LogoMark, XSocialIcon, YoutubeIcon } from "./Icons";
import { scrollToId } from "./Nav";

export default function Footer({
  onSelectCategory,
  onSocial,
}: {
  onSelectCategory: (c: Category) => void;
  onSocial: (name: string) => void;
}) {
  const year = new Date().getFullYear();

  const socials = [
    { name: "Instagram", icon: <InstagramIcon className="w-4 h-4" /> },
    { name: "X", icon: <XSocialIcon className="w-4 h-4" /> },
    { name: "YouTube", icon: <YoutubeIcon className="w-4 h-4" /> },
  ];

  return (
    <footer className="relative border-t border-gold/12 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 text-gold">
              <LogoMark className="w-7 h-7" />
              <span className="font-display text-xl tracking-[0.32em] text-ivory">AURION</span>
            </div>
            <p className="mt-5 max-w-sm text-fog font-light leading-relaxed text-sm">
              A maison of electronic objets, founded MMXIX. We build instruments in
              numbered runs and finish them in champagne gold — nothing is ever re-made.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socials.map((s) => (
                <button
                  key={s.name}
                  data-cursor
                  onClick={() => onSocial(s.name)}
                  aria-label={s.name}
                  className="w-10 h-10 border border-gold/20 text-fog flex items-center justify-center hover:text-ink hover:bg-gold hover:border-gold transition-all duration-300 hover:-translate-y-1"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] tracking-[0.34em] uppercase text-gold">The Boutique</h4>
            <ul className="mt-5 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    data-cursor
                    onClick={() => {
                      onSelectCategory(c);
                      setTimeout(() => scrollToId("collection"), 60);
                    }}
                    className="group text-sm text-fog hover:text-goldlight transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                    {c}
                  </button>
                </li>
              ))}
              <li>
                <button
                  data-cursor
                  onClick={() => scrollToId("collection")}
                  className="group text-sm text-fog hover:text-goldlight transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                  All Objets
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.34em] uppercase text-gold">Maison</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: "The Atelier", id: "atelier" },
                { label: "360° Salon", id: "showcase" },
                { label: "Journal", id: "journal" },
                { label: "Private List", id: "contact" },
              ].map((l) => (
                <li key={l.id + l.label}>
                  <button
                    data-cursor
                    onClick={() => scrollToId(l.id)}
                    className="group text-fog hover:text-goldlight transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.34em] uppercase text-gold">Concierge</h4>
            <ul className="mt-5 space-y-3 text-sm text-fog">
              <li>concierge@aurion.example</li>
              <li>+41 22 555 01 19</li>
              <li className="text-dim text-xs leading-relaxed">
                Rue du Rhône 12<br />Geneva, Switzerland
              </li>
            </ul>
            <button
              data-cursor
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.26em] uppercase text-gold hover:text-goldlight transition-colors"
            >
              Back to top <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.24em] uppercase text-dim">
          <span>© {year} AURION Maison d'Électronique</span>
          <span className="flex items-center gap-6">
            <span>Visa</span>
            <span>Amex</span>
            <span>Wire</span>
            <span className="text-gold">Gold Standard</span>
          </span>
          <span>Designed as a concept boutique</span>
        </div>
      </div>
    </footer>
  );
}
