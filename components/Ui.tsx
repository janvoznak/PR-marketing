"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 text-xs font-medium text-gray-500">{label}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function Line({ text, pre = false }: { text: string; pre?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-2.5 text-sm text-gray-800">
      <span className={pre ? "whitespace-pre-line" : ""}>{text}</span>
      <button
        aria-label="Kopírovat"
        onClick={() => {
          navigator.clipboard?.writeText(text).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="mt-0.5 shrink-0 text-gray-400 hover:text-brand"
      >
        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function Chip({ active, onClick, children, disabled = false }: { active: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-brand text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function Source({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">{children}</span>;
}

export function AiTag() {
  return <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-white">Doporučeno AI</span>;
}

export function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-3xl bg-white ring-1 ring-black/5">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-semibold tracking-tight text-[#14233b]">
        {title}
        <span className="text-sm font-semibold text-brand group-open:hidden">Zobrazit</span>
        <span className="hidden text-sm font-semibold text-gray-500 group-open:inline">Skrýt</span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}
