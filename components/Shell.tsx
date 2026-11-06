"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  Heart,
  Building2,
  BookUser,
  Megaphone,
  BarChart3,
  Calendar,
  Wallet,
  FileText,
  Search,
  Bell,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { agent } from "@/lib/data";

const menu: { label: string; icon: LucideIcon; href?: string }[] = [
  { label: "Pošta", icon: Mail },
  { label: "Zájmy", icon: Heart },
  { label: "Adresář", icon: BookUser },
  { label: "Nabídky", icon: Building2 },
  { label: "Statistiky", icon: BarChart3 },
  { label: "Plánování", icon: Calendar },
  { label: "Finance", icon: Wallet },
  { label: "Smlouvy", icon: FileText },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inMarketing = pathname.startsWith("/marketing");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[170px] shrink-0 flex-col bg-brand text-white md:flex">
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="grid size-9 place-items-center rounded-lg bg-white text-brand">
            <Home size={20} />
          </div>
          <div className="leading-none">
            <div className="text-[10px] font-medium opacity-80">Poski</div>
            <div className="text-xl font-extrabold tracking-tight">REAL</div>
          </div>
        </div>
        <nav className="flex-1 px-2 pb-4 text-[13px]">
          <div className="px-2 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Hlavní menu
          </div>
          {menu.map((m) => (
            <div
              key={m.label}
              className="flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-2 opacity-85 hover:bg-white/10"
            >
              <m.icon size={15} /> {m.label}
            </div>
          ))}
          <Link
            href="/marketing"
            className={`mt-1 flex items-center gap-2.5 rounded-md px-2.5 py-2 font-semibold ${
              inMarketing ? "bg-white text-brand" : "hover:bg-white/10"
            }`}
          >
            <Megaphone size={15} /> Marketing
            <span className="ml-auto rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">NOVÉ</span>
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 bg-brand px-4 text-white">
          <div className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-md bg-white/15 px-3 text-sm text-white/80">
            <Search size={15} /> Rychlé hledání v softwaru
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Share2 size={18} />
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1 text-[9px] font-bold">10+</span>
            </div>
            <div className="hidden text-right text-xs leading-tight sm:block">
              <div className="font-semibold">001 {agent.name}</div>
              <div className="opacity-75">Pobočka: {agent.branch}</div>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-white text-xs font-bold text-brand">
              {agent.initials}
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}
