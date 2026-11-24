"use client";

import { useActionState } from "react";
import { reviewCapsule } from "@/app/actions/validation";
import { Alert, buttonClass, inputClass, secondaryButtonClass } from "./ui";

export function ReviewForm({ slug, contentHash }: { slug: string; contentHash: string }) {
  const [state, action, pending] = useActionState(reviewCapsule, undefined);
  return (
    <form action={action} className="space-y-4" aria-labelledby="tu-revision">
      <h2 id="tu-revision" className="text-xl font-bold">Tu revisión</h2>
      {state?.error && <Alert kind="error">{state.error}</Alert>}
      {state?.ok && <Alert kind="ok">{state.ok}</Alert>}
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="contentHash" value={contentHash} />
      <div className="space-y-1">
        <label htmlFor="comment" className="block font-bold">Comentario</label>
        <p id="comment-hint" className="text-sm text-slate-700">Obligatorio si pedís cambios.</p>
        <textarea id="comment" name="comment" rows={4} aria-describedby="comment-hint" className={inputClass} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" name="status" value="APROBADA" className={buttonClass} disabled={pending}>
          Aprobar esta versión
        </button>
        <button type="submit" name="status" value="CAMBIOS" className={secondaryButtonClass} disabled={pending}>
          Pedir cambios
        </button>
      </div>
    </form>
  );
}
