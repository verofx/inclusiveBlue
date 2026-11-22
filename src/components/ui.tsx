import Link from "next/link";
import type { ComponentProps } from "react";

export const buttonClass =
  "inline-flex items-center justify-center rounded-md bg-ib-blue px-5 py-2.5 font-bold text-white hover:bg-ib-blue-dark disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-md border-2 border-ib-blue px-5 py-2 font-bold text-ib-blue hover:bg-ib-blue-soft";
export const inputClass =
  "w-full rounded-md border-2 border-slate-400 px-3 py-2 focus:border-ib-blue";

export function ButtonLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={`${buttonClass} ${props.className ?? ""}`} />;
}

export function Alert({ kind, children }: { kind: "error" | "ok" | "info"; children: React.ReactNode }) {
  const styles = {
    error: "border-red-700 bg-red-50 text-red-900",
    ok: "border-green-700 bg-green-50 text-green-900",
    info: "border-ib-blue bg-ib-blue-soft text-ib-ink",
  }[kind];
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`border-l-4 px-4 py-3 rounded ${styles}`}>
      {children}
    </div>
  );
}

export function ValidationBadge({ approved }: { approved: boolean }) {
  return approved ? (
    <span className="inline-block rounded-full bg-green-100 text-green-900 px-3 py-0.5 text-sm font-bold">
      ✓ Validada por profesionales
    </span>
  ) : (
    <span className="inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-0.5 text-sm font-bold">
      En revisión profesional
    </span>
  );
}
