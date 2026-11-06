export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-5">
        <h2 className="text-lg font-semibold tracking-tight text-[#14233b]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Scaled({ w, ratio, dw, children }: { w: number; ratio: number; dw: number; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded shadow-sm ring-1 ring-black/5" style={{ width: w, height: w / ratio }}>
      <div style={{ width: dw, height: dw / ratio, transform: `scale(${w / dw})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}
