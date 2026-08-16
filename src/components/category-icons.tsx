export { ArrowUpRight, BoltIcon, GemIcon, GlobeIcon } from "./Icons";

type P = { className?: string };

export const CameraIconFallback = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h2l1.6-2h5.8l1.6 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9Z" strokeLinejoin="round" />
    <circle cx="12" cy="12.5" r="3.6" />
    <circle cx="17.8" cy="9.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
