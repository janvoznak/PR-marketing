"use client";

import { useState } from "react";
import Link from "next/link";
import { ChannelLogo } from "@/components/Logos";
import { channelInfo, estimate, money, type ChannelKey, type Goal, type Planned, type Subject } from "@/lib/campaign";

/** Pravý sloupec druhého kroku: shrnutí, termín, účty a uložení. */
export default function StepLaunch({ goal, subject, planned, daily, days, ready }: { goal: Goal; subject: Subject; planned: Planned[]; daily: number; days: number; ready: boolean }) {
  const [start, setStart] = useState<"now" | "tomorrow">("tomorrow");
  const [saved, setSaved] = useState(false);
  const total = daily * days;
  const est = estimate(goal, subject, total);
  const used = [...new Set(planned.map((c) => c.channel))] as ChannelKey[];

  return (
    <aside className="h-fit space-y-5 rounded-3xl bg-white p-5 ring-1 ring-black/5 xl:sticky xl:top-4">
      <div>
        <div className="text-xs font-medium text-gray-500">Spuštění</div>
        <div className="text-4xl font-semibold tracking-tight text-[#14233b]">{money(total)}</div>
        <div className="text-sm text-gray-500">{planned.length} kampaně · {days} dní · odhad {est.lo}–{est.hi} {est.label}</div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-gray-500">Kdy začít</div>
        <div className="flex gap-2">
          {(
            [
              ["now", "Hned"],
              ["tomorrow", "Zítra v 9:00"],
            ] as const
          ).map(([k, t]) => (
            <button key={k} onClick={() => setStart(k)} className={`rounded-full px-4 py-2 text-sm font-medium ${start === k ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-gray-500">Reklamní účty</div>
        <div className="space-y-2">
          {used.map((k) => (
            <div key={k} className="flex items-center gap-3 rounded-full bg-gray-50 py-1.5 pl-2.5 pr-1.5 ring-1 ring-gray-200">
              <ChannelLogo channel={k} size={22} />
              <span className="flex-1 text-sm font-medium text-gray-800">{channelInfo[k].name}</span>
              <Link href="/marketing/ucty" className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">
                Připojit
              </Link>
            </div>
          ))}
        </div>
      </div>

      {saved ? (
        <div className="rounded-2xl bg-gradient-to-br from-[#e2f3c4] to-[#cfe9ad] p-4 text-[#14233b]">
          <div className="font-semibold">Koncept je uložený</div>
          <p className="mt-1 text-xs">Po připojení účtů ji spustíte jedním klikem. Nic se zatím neodeslalo ani nestrhlo z účtu.</p>
          <Link href="/marketing" className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand">Zpět na přehled</Link>
        </div>
      ) : (
        <div className="space-y-2">
          <button onClick={() => setSaved(true)} disabled={!ready} className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-gray-300">
            Uložit jako koncept
          </button>
          <button disabled className="w-full rounded-full bg-gray-100 py-3 text-sm font-semibold text-gray-400" title="Nejdřív připojte reklamní účty">
            Schválit a spustit
          </button>
          <p className="text-[11px] leading-snug text-gray-400">Spustit půjde po připojení účtů. Do té doby kampaň uložíme jako koncept.</p>
        </div>
      )}
    </aside>
  );
}
