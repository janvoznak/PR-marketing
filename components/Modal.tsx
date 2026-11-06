"use client";

import { useEffect } from "react";

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#071a45]/50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`max-h-[88vh] w-full ${wide ? "max-w-4xl" : "max-w-2xl"} overflow-auto rounded-3xl bg-white p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-[#14233b]">{title}</h3>
          <button onClick={onClose} className="rounded-full px-4 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100">Zavřít</button>
        </div>
        {children}
        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Hotovo</button>
        </div>
      </div>
    </div>
  );
}
