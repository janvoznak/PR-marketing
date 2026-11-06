"use client";

import { useState } from "react";
import { Check, Mail, MessageSquare, Send } from "lucide-react";
import { agent, listings, matchedBuyers, shortPrice } from "@/lib/data";

export default function BuyersPage() {
  const [sent, setSent] = useState(false);
  const l = listings[0];
  const email = `Dobrý den,\n\nvíte, že hledáte vilu v Praze? Právě jsem získal do nabídky ${l.title.toLowerCase()} (${l.city}, ${l.area} m², ${shortPrice(l)}). Odpovídá tomu, co hledáte.\n\nChcete si ji prohlédnout dřív než ostatní? Odpovězte na tento e-mail nebo zavolejte.\n\n${agent.name}, ${agent.phone}`;
  const sms = `${agent.name.split(" ")[0]} z Poski: máme vilu ${l.city}, ${l.area} m², ${shortPrice(l)}. Odpovídá vaší poptávce. Prohlídka? ${agent.phone}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Najít kupce mezi mými klienty</h2>
        <p className="text-sm text-gray-500">
          Podle parametrů nemovitosti jsme v CRM našli klienty, jejichž poptávka sedí: <b>{l.title}</b>
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl bg-white ring-1 ring-black/5 p-5">
          <h3 className="mb-3 text-base font-semibold">Nalezeno 5 vhodných klientů</h3>
          <div className="divide-y divide-gray-100">
            {matchedBuyers.map((b) => (
              <div key={b.who} className="flex items-center gap-3 py-2.5">
                <div className="grid size-9 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                  {b.who.slice(-4, -3)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{b.who}</div>
                  <div className="text-xs text-gray-500">{b.note}</div>
                </div>
                <div className="text-sm font-semibold text-emerald-600">{b.match} %</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl bg-white ring-1 ring-black/5 p-5">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              <Mail size={13} /> E-mail
            </div>
            <div className="whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm text-gray-800">{email}</div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              <MessageSquare size={13} /> SMS
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800">{sms}</div>
          </div>
          <button
            onClick={() => setSent(true)}
            disabled={sent}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:bg-emerald-600"
          >
            {sent ? <Check size={15} /> : <Send size={15} />} {sent ? "Odesláno 5 klientům (ukázka)" : "Schválit a odeslat"}
          </button>
          <p className="text-xs text-gray-400">Odeslání jen klientům se souhlasem s marketingovou komunikací (GDPR).</p>
        </section>
      </div>
    </div>
  );
}
