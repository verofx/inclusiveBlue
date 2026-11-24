import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ReviewForm } from "@/components/ReviewForm";
import { ValidationBadge } from "@/components/ui";
import { VisualPathReview } from "@/components/VisualPath";
import { getCapsule } from "@/lib/capsules";
import { AUDIENCES, AUDIENCE_LABEL } from "@/lib/roles";
import { requireValidator } from "@/lib/session";
import { getValidationState } from "@/lib/validation";

export const metadata = { title: "Revisar cápsula" };

export default async function ReviewCapsulePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireValidator();
  const capsule = await getCapsule((await params).slug);
  if (!capsule) notFound();
  const state = await getValidationState(capsule);

  return (
    <div className="space-y-8">
      <nav aria-label="Migas de pan" className="text-sm">
        <Link href="/validar" className="text-ib-blue underline">← Validar cápsulas</Link>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Revisar: {capsule.title}</h1>
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span>Versión {capsule.contentHash.slice(0, 8)}</span>
          <ValidationBadge approved={state.approved} />
        </p>
      </header>

      {(state.approvals.length > 0 || state.changeRequests.length > 0) && (
        <section aria-labelledby="historial" className="space-y-2">
          <h2 id="historial" className="text-xl font-bold">Revisiones de esta versión</h2>
          <ul className="space-y-1 list-disc pl-6">
            {state.approvals.map((a) => <li key={`a-${a.name}`}>{a.name}: aprobó</li>)}
            {state.changeRequests.map((r) => <li key={`c-${r.name}`}>{r.name}: pidió cambios — “{r.comment}”</li>)}
          </ul>
        </section>
      )}

      <section aria-labelledby="contenido-capsula" className="space-y-4 rounded-lg border-2 border-slate-200 p-5">
        <h2 id="contenido-capsula" className="text-xl font-bold">Contenido completo</h2>
        <p><strong>Resumen:</strong> {capsule.summary}</p>
        <div>
          <p className="font-bold">Lectura fácil</p>
          <ul className="list-disc pl-6">{capsule.easyRead.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <Markdown>{capsule.intro}</Markdown>
        {AUDIENCES.map((a) => (
          <div key={a} className="border-t border-slate-200 pt-4">
            <p className="text-lg font-bold">Recorrido para {AUDIENCE_LABEL[a].toLowerCase()}</p>
            {capsule.visuals[a] && <VisualPathReview path={capsule.visuals[a]} />}
            <Markdown>{capsule.paths[a]}</Markdown>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-lg font-bold">Preguntas del certificado</p>
          <ol className="list-decimal pl-6 space-y-2">
            {capsule.quiz.map((q) => (
              <li key={q.pregunta}>
                {q.pregunta} <br />
                <span className="text-sm">Respuesta correcta: {q.opciones[q.correcta]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReviewForm slug={capsule.slug} contentHash={capsule.contentHash} />
    </div>
  );
}
