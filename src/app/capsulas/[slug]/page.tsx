import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { Alert, ValidationBadge } from "@/components/ui";
import { getCapsule } from "@/lib/capsules";
import { AUDIENCES, AUDIENCE_LABEL, audienceForRole } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";
import { getValidationState } from "@/lib/validation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const capsule = await getCapsule((await params).slug);
  return { title: capsule?.title ?? "Cápsula" };
}

export default async function CapsulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [capsule, user] = await Promise.all([getCapsule(slug), getCurrentUser()]);
  if (!capsule) notFound();
  const state = await getValidationState(capsule);
  if (!state.approved && user?.role !== "VALIDADOR") notFound();
  const suggested = user ? audienceForRole(user.role) : null;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{capsule.title}</h1>
        <p className="text-lg">{capsule.summary}</p>
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span>{capsule.minutes} minutos</span>
          <ValidationBadge approved={state.approved} />
        </p>
        {state.approvals.length > 0 && (
          <p className="text-sm text-slate-700">
            Validada por:{" "}
            {state.approvals
              .map((a) => [a.name, a.profession, a.license && `Mat. ${a.license}`].filter(Boolean).join(", "))
              .join(" · ")}
          </p>
        )}
      </header>

      {!state.approved && (
        <Alert kind="info">
          Estás viendo esta cápsula como validador/a. Las demás personas la verán cuando esté aprobada.{" "}
          <Link href={`/validar/${capsule.slug}`} className="underline font-bold">Revisarla</Link>
        </Alert>
      )}

      {capsule.easyRead.length > 0 && (
        <details className="rounded-lg border-2 border-ib-blue bg-ib-blue-soft p-4">
          <summary className="cursor-pointer font-bold text-lg">Versión de lectura fácil</summary>
          <ul className="mt-3 space-y-2 text-lg list-disc pl-6">
            {capsule.easyRead.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </details>
      )}

      <Markdown>{capsule.intro}</Markdown>

      <section aria-labelledby="recorridos" className="space-y-3 border-t-2 border-slate-200 pt-6">
        <h2 id="recorridos" className="text-2xl font-bold">Seguí con el recorrido para vos</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <li key={a}>
              <Link
                href={`/capsulas/${capsule.slug}/${a}`}
                className={`block rounded-lg border-2 p-4 font-bold text-center hover:bg-ib-blue-soft ${
                  a === suggested ? "border-ib-blue bg-ib-blue-soft" : "border-slate-300"
                }`}
              >
                Para {AUDIENCE_LABEL[a].toLowerCase()}
                {a === suggested && <span className="block text-sm font-normal">(tu recorrido)</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
