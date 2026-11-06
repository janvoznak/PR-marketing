"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/marketing", label: "Přehled" },
  { href: "/marketing/nabidky", label: "Moje nabídky" },
  { href: "/marketing/statistiky", label: "Statistiky" },
  { href: "/marketing/ucty", label: "Reklamní účty" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="text-xs text-gray-500">Úvod › Marketing</div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#14233b]">Marketingové centrum</h1>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${active ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
