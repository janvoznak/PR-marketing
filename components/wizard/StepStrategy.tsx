"use client";

import { useState } from "react";
import { ChannelLogo } from "@/components/Logos";
import { Source } from "@/components/Ui";
import { Panel } from "@/components/Panel";
import { audienceFor, channelInfo, checkpoints, estimate, evidenceFor, money, preflight, type Goal, type Planned, type Subject } from "@/lib/campaign";

const roleText: Record<Planned["role"], string> = {
  Povědomí: "Ukáže nabídku lidem, kteří zatím nehledají.",
  Zájem: "Zachytí lidi ve chvíli, kdy hledají.",
  Dotlačení: "Připomene se těm, kdo už projevili zájem.",
};

/** Přehled kampaní jako jedna časová osa. Kliknutím na řádek se rozbalí cílení. */
export function PlanCard({ planned, daily, days }: { planned: Planned[]; daily: number; days: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const total = daily * days;
  return (
    <Panel title="Plán kampaní">
      <div className="px-5 pb-5">
        <p className="text-sm text-gray-500">Kampaně na sebe navazují: nejdřív zaujmeme, pak zachytíme zájem a nakonec se připomeneme.</p>
        <div className="mt-4 grid grid-cols-[minmax(150px,230px)_1fr] gap-x-4 gap-y-2">
          <span />
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>Den 1</span>
            <span>Den {Math.round(days / 2)}</span>
            <span>Den {days}</span>
          </div>
          {planned.map((c) => {
            const isOpen = open === c.id;
            return (
              <div key={c.id} className="contents">
                <button onClick={() => setOpen(isOpen ? null : c.id)} className="flex items-center gap-2.5 text-left">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-gray-100">
                    <ChannelLogo channel={c.channel} size={c.channel === "meta" ? 22 : 24} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-gray-900">{c.name}</span>
                    <span className="block text-[11px] text-gray-500">{c.role}</span>
                  </span>
                </button>
                <div className="relative h-11 self-center rounded-full bg-gray-50">
                  <div
                    className="absolute inset-y-1 flex items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-[#14233b] ring-1 ring-brand/30"
                    style={{ left: `${c.from * 100}%`, width: `${(c.to - c.from) * 100}%` }}
                  >
                    {money(total * c.weight)}
                  </div>
                </div>
                {isOpen && (
                  <div className="col-span-2 mb-1 rounded-2xl bg-gray-50 p-4 text-[13px] text-gray-700">
                    <div className="font-semibold text-gray-900">{channelInfo[c.channel].name} · {c.format}</div>
                    <div className="mt-1">Cílení: {c.audience}</div>
                    <div className="mt-0.5 text-gray-500">{roleText[c.role]} Podíl na rozpočtu: {Math.round(c.weight * 100)} %.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-400">Kliknutím na kampaň zobrazíte, komu se reklama ukáže.</p>
      </div>
    </Panel>
  );
}

/** Důvody a podklady strategie v záložkách. */
export function WhyTabs({ goal, subject, days }: { goal: Goal; subject: Subject; days: number }) {
  const [tab, setTab] = useState<"aud" | "ev" | "run">("aud");
  const aud = audienceFor(goal, subject);
  const ev = evidenceFor(goal, subject);
  const tabs = [
    ["aud", "Komu reklamu ukážeme"],
    ["ev", "Z čeho vycházíme"],
    ["run", "Jak kampaň řídíme"],
  ] as const;

  return (
    <Panel title="Proč tato strategie">
      <div className="px-5 pb-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([k, t]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === k ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "aud" && (
            <div>
              <div className="text-base font-semibold text-gray-900">{aud.title}</div>
              <ul className="mt-3 space-y-2">
                {aud.why.map((w) => (
                  <li key={w} className="border-l-2 border-brand pl-3 text-sm text-gray-700">{w}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === "ev" && (
            <div className="grid gap-3 md:grid-cols-2">
              {ev.map((e) => (
                <div key={e.label} className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-medium text-gray-500">{e.label}</div>
                    <Source>{e.source}</Source>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{e.value}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-gray-500">{e.note}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "run" && (
            <div className="grid gap-6 md:grid-cols-2">
              <ol className="space-y-3">
                {checkpoints.map((c) => (
                  <li key={c.day} className="flex gap-3 text-sm">
                    <span className="w-14 shrink-0 font-semibold text-brand">{c.day === "Konec" ? `Den ${days}` : c.day}</span>
                    <span className="text-gray-700">{c.text}</span>
                  </li>
                ))}
              </ol>
              <ul className="space-y-2.5">
                {preflight.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

/** Pravý sloupec: rozpočet, odhad a hlavní akce. */
export function BudgetPanel({
  goal,
  subject,
  daily,
  days,
  setDaily,
  setDays,
  onNext,
  disabled,
  campaigns,
}: {
  goal: Goal;
  subject: Subject;
  daily: number;
  days: number;
  setDaily: (n: number) => void;
  setDays: (n: number) => void;
  onNext: () => void;
  disabled: boolean;
  campaigns: number;
}) {
  const total = daily * days;
  const est = estimate(goal, subject, total);
  return (
    <aside className="h-fit space-y-5 rounded-3xl bg-white p-5 ring-1 ring-black/5 xl:sticky xl:top-4">
      <div>
        <div className="text-xs font-medium text-gray-500">Rozpočet celkem</div>
        <div className="text-4xl font-semibold tracking-tight text-[#14233b]">{money(total)}</div>
        <div className="text-sm text-gray-500">{campaigns} kampaně · {days} dní</div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#d9eefb] to-[#c3d9f8] p-4">
        <div className="text-xs font-medium text-[#14233b]/60">Odhad výsledku</div>
        <div className="text-xl font-semibold text-[#14233b]">{est.lo}–{est.hi} {est.label}</div>
        <p className="mt-1 text-[11px] leading-snug text-[#14233b]/70">{est.assumption} Není to garance.</p>
      </div>

      <label className="block">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Denně</span>
          <b className="text-gray-900">{money(daily)}</b>
        </div>
        <input type="range" min={100} max={1000} step={50} value={daily} onChange={(e) => setDaily(Number(e.target.value))} className="mt-1.5 w-full accent-[#0b4fc4]" />
      </label>
      <label className="block">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Délka</span>
          <b className="text-gray-900">{days} dní</b>
        </div>
        <input type="range" min={7} max={60} step={1} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1.5 w-full accent-[#0b4fc4]" />
      </label>

      <button onClick={onNext} disabled={disabled} className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-gray-300">
        Schválit a vytvořit kreativy
      </button>
      <p className="text-[11px] leading-snug text-gray-400">Rozpočet platíte ze svého reklamního účtu a nepřekročíme ho. Nic se nespustí, dokud sami neschválíte.</p>
    </aside>
  );
}
