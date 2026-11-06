import { ChannelLogo } from "@/components/Logos";
import { channelInfo, type ChannelKey } from "@/lib/campaign";

const order: ChannelKey[] = ["google", "meta", "sklik"];

export default function AccountsPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-gray-600">
        Reklamy platíte přímo ze svých účtů. Po připojení půjde hotovou kampaň spustit, pozastavit i upravit rozpočet z Poski REAL a výsledky uvidíte tady.
      </p>
      {order.map((k) => (
        <div key={k} className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <div className="grid size-14 place-items-center rounded-2xl bg-white ring-1 ring-gray-100">
            <ChannelLogo channel={k} size={k === "meta" ? 28 : 34} />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold text-gray-900">{channelInfo[k].name}</div>
            <div className="text-sm text-gray-500">{channelInfo[k].role}</div>
          </div>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500">Připravujeme</span>
        </div>
      ))}
      <div className="rounded-3xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">
        Napojení půjde přes oficiální přihlášení do vašeho účtu. Kampaň vždy vytvoříme jen jako návrh a spustíme ji až po vašem schválení.
      </div>
    </div>
  );
}
