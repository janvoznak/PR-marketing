/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Panel } from "@/components/Panel";
import { ChannelLogo } from "@/components/Logos";
import { agent, listings } from "@/lib/data";

/** Poptávky u nabídek (ukázková data z CRM). */
export const leadsByListing: Record<string, number> = {
  [listings[0].id]: 6,
  [listings[1].id]: 9,
  [listings[2].id]: 4,
  [listings[3].id]: 7,
};

/** Denní poptávky za 30 dní, deterministicky (ukázková data). */
export const trend = {
  web: Array.from({ length: 30 }, (_, i) => 1 + ((i * 7) % 4)),
  portals: Array.from({ length: 30 }, (_, i) => 1 + ((i * 5) % 3)),
};

export type Campaign = {
  name: string;
  channel: string;
  photo: string;
  round?: boolean;
  day: number;
  of: number;
  spent: number;
  budget: number;
  leads: number;
};

/** Při první návštěvě nic neběží. Po spuštění kampaní se sem zapíšou. */
export const campaigns: Campaign[] = [];
export const accountsConnected = false;

export function RunningPanel({ items = campaigns }: { items?: Campaign[] }) {
  return (
    <Panel title="Co právě běží">
      {items.length ? (
        <ul className="divide-y divide-gray-100">
          {items.map((c) => (
            <li key={c.name} className="p-5">
              <div className="flex items-center gap-3">
                <img src={c.photo} alt="" className={`size-10 shrink-0 object-cover ${c.round ? "rounded-full object-top" : "rounded-xl"}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.channel} · den {c.day} z {c.of}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900">{c.leads}</div>
                  <div className="text-[11px] text-gray-500">poptávek</div>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand" style={{ width: `${(c.day / c.of) * 100}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-gray-500">
                <span>
                  {c.spent.toLocaleString("cs-CZ")} z {c.budget.toLocaleString("cs-CZ")} Kč
                </span>
                <button className="font-semibold text-brand hover:underline">Pozastavit</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-500">Zatím nic neběží. Jak to funguje:</p>
          <ol className="mt-3 space-y-2">
            {["Vyberete cíl nebo nemovitost.", "Zkontrolujete hotové bannery a texty.", "Reklamu spustíte ze svého účtu a výsledky uvidíte tady."].map((t, i) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-[#d9eefb] to-[#e8f0fd] px-4 py-3 text-[13px] text-[#14233b]">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-brand">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Panel>
  );
}

export function AccountsPanel() {
  const connected = accountsConnected;
  return (
    <Panel title="Reklamní účty" action={<Link href="/marketing/ucty" className="text-[13px] font-semibold text-brand hover:underline">Spravovat</Link>}>
      <ul className="space-y-2 px-5 pb-5 text-sm">
        {([["google", "Google Ads"], ["meta", "Facebook a Instagram"]] as const).map(([k, n]) => (
          <li key={n} className="flex items-center gap-3 rounded-full bg-gray-50 py-2 pl-3 pr-2 ring-1 ring-gray-200">
            <ChannelLogo channel={k} size={22} />
            <span className="flex-1 font-medium text-gray-800">{n}</span>
            {connected ? (
              <span className="inline-flex items-center gap-1.5 pr-2 text-[13px] font-medium text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500" /> Připojeno
              </span>
            ) : (
              <Link href="/marketing/ucty" className="rounded-full bg-brand px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-brand-dark">
                Připojit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
