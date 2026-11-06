"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import StepSetup from "@/components/wizard/StepSetup";
import { BudgetPanel, PlanCard, WhyTabs } from "@/components/wizard/StepStrategy";
import StepCreatives from "@/components/wizard/StepCreatives";
import StepLaunch from "@/components/wizard/StepLaunch";
import {
  campaignsFor,
  channelInfo,
  defaults,
  goalInfo,
  recommend,
  subjectValid,
  suggest,
  type ChannelKey,
  type Goal,
  type Subject,
} from "@/lib/campaign";

export type Landing = "web" | "listing";

const recChannels = (goal: Goal, subject: Subject) => {
  const rec = recommend(goal, subject);
  return new Set((Object.keys(rec) as ChannelKey[]).filter((k) => rec[k].rec && channelInfo[k].available));
};

export default function Wizard({ goal, listingId }: { goal: Goal; listingId?: string }) {
  const info = goalInfo[goal];
  const sug = suggest(goal);
  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState<Subject>({
    listingId: listingId ?? sug.listingId,
    region: sug.region,
    segment: sug.segment,
    offer: sug.offer,
  });
  const [chan, setChan] = useState<Set<ChannelKey>>(() => recChannels(goal, { listingId: listingId ?? sug.listingId, region: sug.region }));
  const [daily, setDaily] = useState(() => defaults(goal, { listingId: listingId ?? sug.listingId }).daily);
  const [days, setDays] = useState(() => defaults(goal, { listingId: listingId ?? sug.listingId }).days);
  const [landing, setLanding] = useState<Landing>("web");
  const [created, setCreated] = useState(false);

  // Při změně nemovitosti přepočítáme doporučený rozpočet a kanály.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const d = defaults(goal, subject);
    setDaily(d.daily);
    setDays(d.days);
    setChan(recChannels(goal, subject));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.listingId]);

  const planned = useMemo(() => campaignsFor(goal, subject, chan), [goal, subject, chan]);
  const valid = subjectValid(goal, subject) && chan.size > 0;
  const labels = ["Návrh kampaně", "Kreativy a spuštění"];

  const go = (n: number) => {
    if (n === 1 && step === 0) setCreated(false);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <div>
        <Link href="/marketing" className="text-xs font-semibold text-gray-500 hover:text-brand">
          ← Zpět na přehled
        </Link>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#14233b]">{info.title}</h2>
      </div>

      <ol className="flex flex-wrap gap-2">
        {labels.map((t, i) => {
          const done = i < step;
          const cur = i === step;
          return (
            <li key={t}>
              <button
                disabled={i > step}
                onClick={() => go(i)}
                className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium ${
                  cur ? "bg-brand text-white" : done ? "bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-brand/40" : "bg-white/60 text-gray-400 ring-1 ring-gray-200"
                }`}
              >
                <span className={`grid size-6 place-items-center rounded-full text-xs font-bold ${cur ? "bg-white text-brand" : done ? "bg-brand text-white" : "bg-gray-100 text-gray-400"}`}>
                  {done ? "✓" : i + 1}
                </span>
                {t}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        {step === 0 && (
          <>
            <div className="min-w-0 space-y-5">
              <p className="text-sm text-gray-600">Kampaň jsme navrhli podle dat ve vašem CRM. Stačí zkontrolovat, případně změnit, a schválit.</p>
              <StepSetup goal={goal} subject={subject} setSubject={setSubject} chan={chan} setChan={setChan} landing={landing} setLanding={setLanding} />
              {valid ? (
                <>
                  <PlanCard planned={planned} daily={daily} days={days} />
                  <WhyTabs goal={goal} subject={subject} days={days} />
                </>
              ) : (
                <div className="rounded-3xl bg-white p-6 text-sm text-gray-500 ring-1 ring-black/5">Doplňte údaje výše, strategii navrhneme hned potom.</div>
              )}
            </div>
            <BudgetPanel goal={goal} subject={subject} daily={daily} days={days} setDaily={setDaily} setDays={setDays} onNext={() => go(1)} disabled={!valid} campaigns={planned.length} />
          </>
        )}
        {step === 1 && (
          <>
            <div className="min-w-0 space-y-5">
              <StepCreatives goal={goal} subject={subject} planned={planned} landing={landing} created={created} setCreated={setCreated} total={daily * days} />
              <button onClick={() => go(0)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
                ← Zpět na návrh
              </button>
            </div>
            <StepLaunch goal={goal} subject={subject} planned={planned} daily={daily} days={days} ready={created} />
          </>
        )}
      </div>
    </div>
  );
}
