import Link from "next/link";
import { Panel } from "@/components/Panel";
import { AreaChart, Donut, Legend } from "@/components/designs/Charts";
import { trend } from "@/components/designs/shared";

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

export default function StatsPage() {
  const series = [
    { name: "Web makléře", color: "#7fa6ea", values: trend.web },
    { name: "Portály", color: "#cbd5e1", values: trend.portals },
  ];
  const total = sum(trend.web) + sum(trend.portals);
  const parts = series.map((s) => ({ name: s.name, color: s.color, value: sum(s.values) }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Poptávky za posledních 30 dní z dat vašeho CRM. Ukázková data.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["1 840", "návštěv webu makléře", "from-[#d9eefb] to-[#c3d9f8]"],
          [String(total), "poptávek za 30 dní", "from-[#e2f3c4] to-[#cfe9ad]"],
          ["18 dní", "průměrná doba nabídky na trhu", "from-[#fde6c4] to-[#f8c8b4]"],
        ].map(([v, k, t]) => (
          <div key={k} className={`rounded-3xl bg-gradient-to-br ${t} p-6`}>
            <div className="text-4xl font-semibold tracking-tight text-[#14233b]">{v}</div>
            <div className="mt-1 text-sm text-[#14233b]/70">{k}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Odkud přicházejí poptávky">
          <div className="px-5 pb-5">
            <AreaChart series={series} height={200} />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>před 30 dny</span>
              <span>dnes</span>
            </div>
          </div>
        </Panel>
        <Panel title="Zdroje">
          <div className="flex flex-col items-center gap-4 px-5 pb-5">
            <Donut parts={parts} label={String(total)} sub="poptávek" />
            <Legend items={parts.map((p) => ({ name: p.name, color: p.color, value: `${Math.round((p.value / total) * 100)} %` }))} />
          </div>
        </Panel>
      </div>

      <Panel title="Reklamy">
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-500">Zatím jste žádnou reklamu nespustili. Výsledky kampaní (útrata, poptávky, cena za poptávku) se zobrazí tady.</p>
          <Link href="/marketing/nabidky" className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            Vybrat nemovitost
          </Link>
        </div>
      </Panel>
    </div>
  );
}
