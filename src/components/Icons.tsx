type P = { className?: string };

export const LogoMark = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <path d="M16 2 29 30h-5.6L16 12.4 8.6 30H3L16 2Z" fill="currentColor" />
    <circle cx="16" cy="24.5" r="2.1" fill="currentColor" />
  </svg>
);

export const CartIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M4.5 7.5h15l-1.4 11a2 2 0 0 1-2 1.75H7.9a2 2 0 0 1-2-1.75L4.5 7.5Z" />
    <path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5" />
    <path d="M9.5 12.5c.6 1 1.6 1.6 2.5 1.6s1.9-.6 2.5-1.6" strokeLinecap="round" />
  </svg>
);

export const ArrowRight = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M3.5 12h16m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowUpRight = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M6.5 17.5 17.5 6.5m0 0h-9m9 0v9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const MinusIcon = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
  </svg>
);

export const StarIcon = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9 2.9-6Z" />
  </svg>
);

export const PlayIcon = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8.5 5.8v12.4c0 .8.9 1.3 1.6.9l9.4-6.2c.6-.4.6-1.4 0-1.8L10.1 4.9c-.7-.4-1.6.1-1.6.9Z" />
  </svg>
);

export const DiamondIcon = ({ className = "w-2.5 h-2.5" }: P) => (
  <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden>
    <path d="M6 0.8 11.2 6 6 11.2 0.8 6 6 0.8Z" />
  </svg>
);

export const TruckIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M2.5 6.5h12v10h-12v-10Zm12 3h4l2.5 3v4h-6.5v-7Z" strokeLinejoin="round" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);

export const ShieldIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M12 3 5 5.8v5.4c0 4.6 3 8 7 9.8 4-1.8 7-5.2 7-9.8V5.8L12 3Z" strokeLinejoin="round" />
    <path d="m8.8 11.6 2.2 2.2 4.2-4.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GlobeIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.2 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.2-3.9-8.5s1.3-6.2 3.9-8.5Z" />
  </svg>
);

export const GemIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M7 4h10l4 5.5L12 21 3 9.5 7 4Z" strokeLinejoin="round" />
    <path d="m3 9.5h18M9.5 4 8 9.5 12 21l4-11.5L14.5 4" strokeLinejoin="round" />
  </svg>
);

export const BoltIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M13.5 3 5 13.5h6L10.5 21 19 10.5h-6L13.5 3Z" strokeLinejoin="round" />
  </svg>
);

export const RotateIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5v4h-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InstagramIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const XSocialIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M4 4h4.6l4.2 5.9L17.6 4H20l-6 7.4 6.4 8.6h-4.6l-4.6-6.3-4.8 6.3H4l6.4-8.4L4 4Z" />
  </svg>
);

export const YoutubeIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <rect x="2.8" y="6" width="18.4" height="12" rx="3.5" />
    <path d="m10.2 9.5 4.6 2.5-4.6 2.5v-5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const UserIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" strokeLinecap="round" />
  </svg>
);

export const LockIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const EyeIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const EyeOffIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M4 4.5 20 19.5M9.9 6.3A9.4 9.4 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.6M6 8.4A16 16 0 0 0 2.5 12S6 18.2 12 18.2c1.1 0 2.1-.2 3-.6" strokeLinecap="round" />
  </svg>
);

export const CheckIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CopyIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
    <path d="M5.5 15.5h-.5A1.5 1.5 0 0 1 3.5 14V5a1.5 1.5 0 0 1 1.5-1.5H14A1.5 1.5 0 0 1 15.5 5v.5" />
  </svg>
);

export const ChevronDownIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
    <path d="m6 9.5 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TagIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M3.5 11.5v-7a1 1 0 0 1 1-1h7L21 13l-8 8-9.5-9.5Z" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

export const GiftIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <rect x="4" y="10" width="16" height="10" />
    <path d="M3 6.5h18V10H3zM12 6.5V20M12 6.5c-1.5 0-4-.6-4-2.5S10.5 2 12 6.5c1.5-4.5 4-4.4 4-2.5s-2.5 2.5-4 2.5Z" strokeLinejoin="round" />
  </svg>
);

export const PackageIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" strokeLinejoin="round" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" strokeLinejoin="round" />
  </svg>
);

export const CardIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="2" />
    <path d="M2.8 10h18.4M6.5 14.5h4" strokeLinecap="round" />
  </svg>
);

export const LogoutIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14M10.5 12H21m0 0-3.5-3.5M21 12l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BellIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M12 4a6 6 0 0 0-6 6v3.2L4.5 16h15L18 13.2V10a6 6 0 0 0-6-6Z" strokeLinejoin="round" />
    <path d="M10 18.5a2 2 0 0 0 4 0" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.5 15.5 4.5 4.5" strokeLinecap="round" />
  </svg>
);

export const SettingsIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path
      d="M10.3 3.5h3.4l.5 2.6 1.9.8 2.2-1.4 2.4 2.4-1.4 2.2.8 1.9 2.6.5v3.4l-2.6.5-.8 1.9 1.4 2.2-2.4 2.4-2.2-1.4-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.4-2.4-2.4 1.4-2.2-.8-1.9-2.6-.5v-3.4l2.6-.5.8-1.9-1.4-2.2 2.4-2.4 2.2 1.4 1.9-.8.5-2.6Z"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);

export const ChatIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H12l-4.5 4v-4h-1A2.5 2.5 0 0 1 4 13.5v-7Z" strokeLinejoin="round" />
    <path d="M8.5 9.5h7M8.5 12.5h4.5" strokeLinecap="round" />
  </svg>
);

export const SendIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M20.5 3.5 3.5 10.2l6.6 2.6 2.6 6.7 7.8-16Z" strokeLinejoin="round" />
    <path d="m10.1 12.8 4.2-4.2" strokeLinecap="round" />
  </svg>
);

export const KeyIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <circle cx="8" cy="8.5" r="4.5" />
    <path d="m11.3 11.8 8.2 8.2M17 17.5l2.2-2.2M14.2 14.7l2-2" strokeLinecap="round" />
  </svg>
);

export const SparkIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5L10 13l-6.5-2L10 9l2-6.5Z" />
    <path d="m19 15 .9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15Z" opacity="0.7" />
  </svg>
);

export const TimerIcon = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.8 1.8M9.5 2.5h5" strokeLinecap="round" />
  </svg>
);
