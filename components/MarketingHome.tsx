"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Panel } from "@/components/Panel";
import { GoogleAdsLogo, MetaPair } from "@/components/Logos";
import { AccountsPanel, RunningPanel, leadsByListing } from "@/components/designs/shared";
import { agent, formatPrice, listings } from "@/lib/data";

/** Přehled marketingového centra. Nic negeneruje: ukazuje jen data z CRM a to, co už běží. */
export default function MarketingHome() {
  return (
    <div className="space-y-6">
      {/* Tři hlavní práce makléře */}
      <section>
        <div className="grid gap-x-6 gap-y-8 lg:grid-cols-3">
          <Job
            href="/marketing/kampan/prodej"
            title="Prodat nemovitost"
            tint="from-[#e2f3c4] to-[#cfe9ad]"
            pills={["Bannery a texty reklam", "Cílení a rozpočet", "Google a Meta"]}
            cta="Vybrat nemovitost"
            primary
            art={<SellArt />}
          />
          <Job
            href="/marketing/kampan/zakazky"
            title="Nabrat nové zakázky"
            tint="from-[#fde6c4] to-[#f8c8b4]"
            pills={["Reklama pro majitele", "Ocenění zdarma", "Formulář poptávky"]}
            cta="Nabrat zakázky"
            art={<LeadsArt />}
          />
          <Job
            href="/marketing/kampan/znacka"
            title="Podpořit svou značku"
            tint="from-[#d9eefb] to-[#c3d9f8]"
            pills={["Vizitka a profil", "Příspěvky o obchodech", "Hodnocení klientů"]}
            cta="Podpořit značku"
            art={<BrandArt />}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-gray-500">
          Další možnosti:
          <Link href="/marketing/kampan/web" className="font-semibold text-brand hover:underline">Přivést klienty na můj web</Link>
          <Link href="/marketing/poptavky" className="font-semibold text-brand hover:underline">Oslovit klienty z databáze</Link>
          <Link href="/marketing/kampan/znacka" className="font-semibold text-brand hover:underline">Získat hodnocení od klientů</Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Moje nabídky" action={<Link href="/marketing/nabidky" className="text-[13px] font-semibold text-brand hover:underline">Všechny nabídky</Link>}>
          <div className="hidden grid-cols-[1fr_84px_84px_130px_120px] gap-3 border-b border-gray-100 px-5 py-2 text-xs text-gray-500 md:grid">
            <span>Nemovitost</span>
            <span>V nabídce</span>
            <span>Poptávky</span>
            <span>Reklama</span>
            <span />
          </div>
          {listings.map((l, i) => {
            const hint = l.premium && l.daysActive > 30 ? "Prémiová nabídka, 41 dní bez rezervace" : null;
            return (
              <div key={l.id} className="grid items-center gap-3 border-b border-gray-100 px-5 py-3 last:border-0 md:grid-cols-[1fr_84px_84px_130px_120px]">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={l.photo} alt="" className="h-12 w-[68px] shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">{l.title}</div>
                    <div className="truncate text-xs text-gray-500">
                      {l.city} · {formatPrice(l)}
                    </div>
                    {hint && <div className="text-xs font-medium text-amber-700">{hint}</div>}
                  </div>
                </div>
                <div className={`text-sm ${l.daysActive > 30 ? "font-bold text-amber-700" : "text-gray-700"}`}>{l.daysActive} dní</div>
                <div className="text-sm font-semibold text-gray-800">{leadsByListing[l.id]}</div>
                <div className="text-[13px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-gray-500 ring-1 ring-gray-200">
                    <span className="size-2 rounded-full bg-gray-300" /> Bez reklamy
                  </span>
                </div>
                <div className="text-right">
                  <Link
                    href={`/marketing/kampan/prodej/${l.id}`}
                    className={`inline-block rounded-full px-4 py-1.5 text-[13px] font-semibold ${i === 0 ? "bg-brand text-white hover:bg-brand-dark" : "bg-brand-soft text-brand hover:bg-brand hover:text-white"}`}
                  >
                    Zpropagovat
                  </Link>
                </div>
              </div>
            );
          })}
        </Panel>

        <div className="space-y-4">
          <RunningPanel />
          <AccountsPanel />
        </div>
      </div>
    </div>
  );
}

function Job({
  href,
  title,
  tint,
  pills,
  cta,
  art,
  primary = false,
}: {
  href: string;
  title: string;
  tint: string;
  pills: string[];
  cta: string;
  art: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <Link href={href} className={`group relative block h-[380px] overflow-hidden rounded-[28px] bg-gradient-to-br ${tint}`}>
        <h2 className="relative z-10 px-8 pt-8 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#14233b]">{title}</h2>
        <div className="transition-transform duration-500 group-hover:-translate-y-1">{art}</div>
      </Link>
      <ul className="mt-5 space-y-2">
        {pills.map((p) => (
          <li key={p} className="flex w-fit items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[15px] text-gray-800 ring-1 ring-gray-200">
            {p === "Google a Meta" ? (
              <>
                <GoogleAdsLogo size={18} />
                <MetaPair size={18} />
              </>
            ) : (
              <span className="size-2.5 rounded-full bg-brand" />
            )}
            {p}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-5 w-fit rounded-md px-6 py-2.5 text-sm font-semibold ${primary ? "bg-brand text-white hover:bg-brand-dark" : "bg-brand-soft text-brand hover:bg-brand hover:text-white"}`}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ---------- Ilustrace uvnitř karet: ukazují princip, ne vygenerovaný obsah ---------- */

function SellArt() {
  const l = listings[0];
  return (
    <>
      <div className="absolute left-8 top-[104px] z-10">
        <div className="w-fit rounded-t-md bg-brand px-3 py-1 text-xs font-semibold text-white">Doporučujeme</div>
        <div className="w-[300px] rounded-b-xl rounded-tr-xl bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,35,59,0.25)]">
          <div className="flex items-center gap-3">
            <img src={l.photo} alt="" className="h-12 w-16 rounded object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-900">Luxusní vila, Ořechovka</div>
              <div className="text-xs text-gray-500">38 900 000 Kč</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded bg-amber-50 px-3 py-2 text-[13px]">
            <span className="text-gray-600">V nabídce</span>
            <b className="text-amber-700">41 dní</b>
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-[13px]">
            <span className="text-gray-600">Reklama</span>
            <b className="text-gray-800">zatím žádná</b>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-8 bottom-0 top-[318px] rounded-t-2xl bg-[#1f2a3d] p-4">
        <div className="grid grid-cols-3 gap-2">
          {["Bannery", "Texty", "Cílení"].map((t) => (
            <div key={t} className="grid h-14 place-items-center rounded-md bg-white/10 text-[12px] text-white/80">
              {t}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function LeadsArt() {
  return (
    <>
      <div className="absolute left-8 right-8 top-[104px] z-10 rounded-xl bg-white/90 p-3 shadow-[0_10px_30px_-10px_rgba(20,35,59,0.2)]">
        <div className="flex gap-2 text-[13px]">
          <span className="flex-1 rounded-3xl bg-white ring-1 ring-black/5 px-3 py-2 text-gray-700">Majitelé bytů a domů</span>
          <span className="rounded-3xl bg-white ring-1 ring-black/5 px-3 py-2 text-gray-700">Praha 6</span>
        </div>
      </div>
      <div className="absolute left-[44px] top-[170px] h-[92px] w-px bg-[#7fb2f0]" />
      <div className="absolute left-8 top-[196px] z-10 rounded-md bg-[#8fc3f5] px-4 py-2 text-[13px] font-bold tracking-wide text-[#0b3a7a]">+ A ZÁROVEŇ</div>
      <div className="absolute left-[60px] top-[246px] size-[88px] overflow-hidden rounded-full ring-4 ring-white/80">
        <img src="/img/dum.jpg" alt="" className="size-full object-cover" />
      </div>
      <div className="absolute left-[170px] top-[232px] size-[104px] overflow-hidden rounded-full ring-4 ring-white/80">
        <img src="/img/byt.jpg" alt="" className="size-full object-cover" />
      </div>
      <div className="absolute left-[260px] top-[290px] size-[64px] overflow-hidden rounded-full ring-4 ring-white/80">
        <img src="/img/pronajem.jpg" alt="" className="size-full object-cover" />
      </div>
    </>
  );
}

function BrandArt() {
  const bars = [40, 62, 48, 74, 58, 86, 66, 92, 70, 100];
  return (
    <div className="absolute inset-x-8 bottom-0 top-[100px]">
      <div className="absolute inset-x-0 top-0 h-[290px] rounded-t-2xl bg-white shadow-[0_10px_30px_-10px_rgba(20,35,59,0.2)]">
        <div className="flex gap-4 border-b border-gray-100 px-5 pt-3 text-[12px] text-gray-500">
          <span className="border-b-2 border-brand pb-2 font-semibold text-gray-900">Vizitka</span>
          <span className="pb-2">Příspěvky</span>
          <span className="pb-2">Hodnocení</span>
        </div>
        <div className="flex items-center gap-3 px-5 pt-4">
          <img src={agent.photo} alt="" className="size-14 rounded-full object-cover object-top" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{agent.name}</div>
            <div className="text-xs text-gray-500">{agent.web}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 px-5 text-center">
          {[
            ["40", "obchodů"],
            ["9 let", "praxe"],
            ["4,9", "hodnocení"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-md bg-gray-50 py-2">
              <div className="text-base font-bold text-gray-900">{v}</div>
              <div className="text-[11px] text-gray-500">{k}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-16 items-end gap-1.5 px-5">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-t bg-[#9db8f0]" style={{ height: `${b}%`, background: i % 2 ? "#9db8f0" : "#6c93e6" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
