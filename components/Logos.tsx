/** Zjednodušené značky platforem. Pro ostrou verzi nahradit oficiálními assety. */
export function GoogleAdsLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Google Ads">
      <path d="M17.3 6.7l-13 22.5a6 6 0 0010.4 6l13-22.5a6 6 0 00-10.4-6z" fill="#FBBC04" />
      <path d="M43.7 29.2L30.7 6.7a6 6 0 00-10.4 6l13 22.5a6 6 0 0010.4-6z" fill="#4285F4" />
      <circle cx="10" cy="38" r="6" fill="#34A853" />
    </svg>
  );
}

export function FacebookLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Facebook">
      <circle cx="24" cy="24" r="22" fill="#1877F2" />
      <path d="M26.5 40V26h4.7l.7-5.5h-5.4v-3.5c0-1.6.4-2.7 2.7-2.7H32V9.4c-.5-.1-2.2-.2-4.1-.2-4.1 0-6.9 2.5-6.9 7.1v4.2h-4.6V26H21v14h5.5z" fill="#fff" />
    </svg>
  );
}

export function InstagramLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Instagram">
      <defs>
        <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.3" stopColor="#FA7E1E" />
          <stop offset="0.55" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#ig)" />
      <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="31.5" cy="16.5" r="1.8" fill="#fff" />
    </svg>
  );
}

export function SklikLogo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Sklik">
      <rect x="3" y="3" width="42" height="42" rx="11" fill="#CC0000" />
      <text x="24" y="33" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">S</text>
    </svg>
  );
}

export function MetaPair({ size = 24 }: { size?: number }) {
  return (
    <span className="inline-flex items-center -space-x-1.5">
      <FacebookLogo size={size} />
      <span className="rounded-full ring-2 ring-white">
        <InstagramLogo size={size} />
      </span>
    </span>
  );
}

export function ChannelLogo({ channel, size = 24 }: { channel: "google" | "meta" | "sklik"; size?: number }) {
  if (channel === "google") return <GoogleAdsLogo size={size} />;
  if (channel === "sklik") return <SklikLogo size={size} />;
  return <MetaPair size={size} />;
}
