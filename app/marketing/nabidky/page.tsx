/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { formatPrice, listings } from "@/lib/data";

export default function ListingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Kterou nemovitost chcete zpropagovat?</h2>
        <p className="text-sm text-gray-500">Vyberte nabídku. Bannery, texty i cílení vytvoříme z jejích údajů a fotek.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {listings.map((l) => (
          <div key={l.id} className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
            <div className="relative h-48">
              <img src={l.photo} alt={l.title} className="absolute inset-0 size-full object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-800">
                {l.type}
              </span>
              {l.premium && (
                <span className="absolute right-2 top-2 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-semibold text-amber-950">
                  PRÉMIOVÁ
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-3">
              <div className="line-clamp-2 text-sm font-semibold text-gray-900">{l.title}</div>
              <div className="mt-0.5 text-xs text-gray-500">
                {l.city} · {l.disposition} · {l.area} m² · {l.daysActive} dní v nabídce
              </div>
              <div className="mt-2 text-sm font-semibold text-brand">{formatPrice(l)}</div>
              <Link
                href={`/marketing/kampan/prodej/${l.id}`}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
              >
                <Sparkles size={13} /> Zpropagovat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
