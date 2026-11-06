"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ChannelLogo } from "@/components/Logos";
import { Modal } from "@/components/Modal";
import { Chip } from "@/components/Ui";
import StepChannels from "@/components/wizard/StepChannels";
import type { Landing } from "@/components/wizard/Wizard";
import { agent, formatPrice, listings } from "@/lib/data";
import { channelInfo, offers, recommend, regionNote, regions, segments, suggest, type ChannelKey, type Goal, type Subject } from "@/lib/campaign";

type Edit = "listing" | "region" | "segment" | "offer" | "channels" | "landing" | null;

function Tile({ label, ai, reason, onChange, children }: { label: string; ai: boolean; reason: string; onChange: () => void; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[190px] flex-col rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {ai && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">Doporučeno AI</span>}
      </div>
      <div className="mt-3">{children}</div>
      <p className="mt-2 flex-1 text-[13px] leading-snug text-gray-500">{reason}</p>
      <button onClick={onChange} className="mt-3 w-fit text-sm font-semibold text-brand hover:underline">
        Změnit
      </button>
    </div>
  );
}

export default function StepSetup({
  goal,
  subject,
  setSubject,
  chan,
  setChan,
  landing,
  setLanding,
}: {
  goal: Goal;
  subject: Subject;
  setSubject: (s: Subject) => void;
  chan: Set<ChannelKey>;
  setChan: (c: Set<ChannelKey>) => void;
  landing: Landing;
  setLanding: (l: Landing) => void;
}) {
  const [edit, setEdit] = useState<Edit>(null);
  const sug = suggest(goal);
  const set = (patch: Partial<Subject>) => setSubject({ ...subject, ...patch });
  const rec = recommend(goal, subject);

  const l = listings.find((x) => x.id === subject.listingId);
  const seg = segments[goal].find((x) => x.key === subject.segment);
  const off = offers.find((x) => x.key === subject.offer);
  const recKeys = (Object.keys(rec) as ChannelKey[]).filter((k) => rec[k].rec && channelInfo[k].available);
  const chanIsRec = recKeys.length === chan.size && recKeys.every((k) => chan.has(k));
  const segTitle = { zakazky: "Koho oslovit", znacka: "Zaměření", web: "Cíl webu", prodej: "" }[goal];

  const option = (on: boolean) => `rounded-2xl p-3 text-left ${on ? "bg-brand-soft ring-2 ring-brand" : "ring-1 ring-gray-200 hover:ring-brand/40"}`;

  return (
    <>
      <div className={`grid gap-4 ${goal === "zakazky" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {goal === "prodej" && l && (
          <Tile label="Co propagujeme" ai={subject.listingId === sug.listingId} reason={subject.listingId === sug.listingId ? sug.reasons.listing : `${l.daysActive} dní v nabídce.`} onChange={() => setEdit("listing")}>
            <div className="flex items-center gap-3">
              <img src={l.photo} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{l.title}</div>
                <div className="text-xs text-gray-500">{formatPrice(l)}</div>
              </div>
            </div>
          </Tile>
        )}

        {goal !== "prodej" && (
          <>
            <Tile label="Kde" ai={subject.region === sug.region} reason={subject.region ? regionNote[subject.region] : ""} onChange={() => setEdit("region")}>
              <div className="text-xl font-semibold tracking-tight text-gray-900">{subject.region}</div>
            </Tile>
            <Tile label={segTitle} ai={subject.segment === sug.segment} reason={subject.segment === sug.segment ? sug.reasons.segment : seg?.text ?? ""} onChange={() => setEdit("segment")}>
              <div className="text-xl font-semibold tracking-tight text-gray-900">{seg?.title}</div>
            </Tile>
          </>
        )}

        {goal === "zakazky" && (
          <Tile label="Nabídka pro majitele" ai={subject.offer === sug.offer} reason={subject.offer === sug.offer ? sug.reasons.offer : off?.text ?? ""} onChange={() => setEdit("offer")}>
            <div className="text-xl font-semibold tracking-tight text-gray-900">{off?.title}</div>
          </Tile>
        )}

        <Tile
          label="Kde se reklama zobrazí"
          ai={chanIsRec}
          reason={chanIsRec ? "Google zachytí ty, kdo už hledají. Facebook a Instagram osloví ty, kdo o tom zatím jen přemýšlejí." : "Vlastní výběr kanálů."}
          onChange={() => setEdit("channels")}
        >
          <div className="flex flex-wrap gap-2">
            {[...chan].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-full bg-gray-50 py-1 pl-1.5 pr-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200">
                <ChannelLogo channel={c} size={22} /> {channelInfo[c].name}
              </span>
            ))}
          </div>
        </Tile>

        {goal === "prodej" && (
          <Tile
            label="Kam reklama vede"
            ai={landing === "web"}
            reason={landing === "web" ? `Klient uvidí i vaše další nabídky a zanechá kontakt na ${agent.web}.` : "Klient přejde rovnou na jeden inzerát na portálu."}
            onChange={() => setEdit("landing")}
          >
            <div className="text-xl font-semibold tracking-tight text-gray-900">{landing === "web" ? "Váš web makléře" : "Detail inzerátu"}</div>
          </Tile>
        )}
      </div>

      {edit === "listing" && (
        <Modal title="Kterou nemovitost propagovat?" onClose={() => setEdit(null)}>
          <div className="grid gap-2 md:grid-cols-2">
            {listings.map((x) => (
              <button key={x.id} onClick={() => set({ listingId: x.id })} className={`flex items-center gap-3 ${option(x.id === subject.listingId)}`}>
                <img src={x.photo} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-gray-900">{x.title}</div>
                  <div className="text-xs text-gray-500">{formatPrice(x)} · {x.daysActive} dní</div>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {edit === "region" && (
        <Modal title="Kde chcete být vidět?" onClose={() => setEdit(null)}>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <Chip key={r} active={subject.region === r} onClick={() => set({ region: r })}>{r}</Chip>
            ))}
          </div>
          {subject.region && <p className="mt-4 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">{regionNote[subject.region]}</p>}
        </Modal>
      )}
      {edit === "segment" && (
        <Modal title={segTitle} onClose={() => setEdit(null)}>
          <div className="grid gap-2 md:grid-cols-3">
            {segments[goal].map((o) => (
              <button key={o.key} onClick={() => set({ segment: o.key })} className={option(o.key === subject.segment)}>
                <div className="text-sm font-semibold text-gray-900">{o.title}</div>
                <div className="mt-0.5 text-xs text-gray-500">{o.text}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {edit === "offer" && (
        <Modal title="Co majitelům nabídnete?" onClose={() => setEdit(null)}>
          <div className="grid gap-2 md:grid-cols-3">
            {offers.map((o) => (
              <button key={o.key} onClick={() => set({ offer: o.key })} className={option(o.key === subject.offer)}>
                <div className="text-sm font-semibold text-gray-900">{o.title}</div>
                <div className="mt-0.5 text-xs text-gray-500">{o.text}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {edit === "channels" && (
        <Modal title="Kde se má reklama zobrazovat?" onClose={() => setEdit(null)}>
          <StepChannels goal={goal} subject={subject} chan={chan} setChan={setChan} />
        </Modal>
      )}
      {edit === "landing" && (
        <Modal title="Kam má reklama vést?" onClose={() => setEdit(null)}>
          <div className="grid gap-2 md:grid-cols-2">
            {(
              [
                ["web", "Váš web makléře", `Klient uvidí i další nabídky a zanechá kontakt na ${agent.web}. Doporučujeme.`],
                ["listing", "Detail inzerátu", "Klient přejde rovnou na jednu nabídku na portálu."],
              ] as const
            ).map(([k, t, d]) => (
              <button key={k} onClick={() => setLanding(k)} className={option(landing === k)}>
                <div className="text-sm font-semibold text-gray-900">{t}</div>
                <div className="mt-0.5 text-xs text-gray-500">{d}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
