"use client";

import { ChannelLogo } from "@/components/Logos";
import { channelInfo, recommend, type ChannelKey, type Goal, type Subject } from "@/lib/campaign";

export default function StepChannels({
  goal,
  subject,
  chan,
  setChan,
}: {
  goal: Goal;
  subject: Subject;
  chan: Set<ChannelKey>;
  setChan: (s: Set<ChannelKey>) => void;
}) {
  const rec = recommend(goal, subject);
  const order: ChannelKey[] = ["google", "meta", "sklik"];
  const toggle = (k: ChannelKey) => {
    const n = new Set(chan);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setChan(n);
  };

  return (
    <div>
      <div className="space-y-3">
        {order.map((k) => {
          const c = channelInfo[k];
          const r = rec[k];
          const on = chan.has(k);
          return (
            <button
              key={k}
              disabled={!c.available}
              onClick={() => toggle(k)}
              className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition ${
                !c.available ? "bg-gray-50 opacity-60" : on ? "bg-brand-soft ring-2 ring-brand" : "bg-white ring-1 ring-gray-200 hover:ring-brand/40"
              }`}
            >
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white ring-1 ring-gray-100">
                <ChannelLogo channel={k} size={k === "meta" ? 28 : 34} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-gray-900">{c.name}</span>
                  {c.available && r.rec && <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-white">Doporučujeme</span>}
                  {!c.available && <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">Připravujeme</span>}
                </div>
                <div className="text-[13px] font-medium text-gray-700">{c.role}</div>
                <p className="mt-1 text-[13px] leading-snug text-gray-500">{r.reason}</p>
                {c.available && <div className="mt-2 text-xs text-gray-400">Účet zatím není připojený. Kampaň si můžete připravit i bez připojení.</div>}
              </div>
              {c.available && <span className={`mt-1 grid size-5 shrink-0 place-items-center rounded-md border-2 text-xs text-white ${on ? "border-brand bg-brand" : "border-gray-300"}`}>{on ? "✓" : ""}</span>}
            </button>
          );
        })}
      </div>

      {rec.google.rec && rec.meta.rec && (
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#d9eefb] to-[#e8f0fd] p-4 text-sm text-[#14233b]">
          <b>Proč doporučujeme obojí:</b> Google zachytí lidi, kteří už hledají. Facebook a Instagram ukážou nabídku těm, kdo o koupi či prodeji zatím jen
          přemýšlejí. Dohromady pokryjete celé rozhodování od prvního zájmu po telefonát.
        </div>
      )}
    </div>
  );
}
