import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { QuizForm } from "@/components/QuizForm";
import { Alert, ButtonLink } from "@/components/ui";
import { VisualPath } from "@/components/VisualPath";
import { getCapsule } from "@/lib/capsules";
import { db } from "@/lib/db";
import { AUDIENCE_LABEL, hasCertificate, isAudience } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";
import { getValidationState } from "@/lib/validation";

type Params = Promise<{ slug: string; audiencia: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, audiencia } = await params;
  const capsule = await getCapsule(slug);
  if (!capsule || !isAudience(audiencia)) return { title: "Cápsula" };
  return { title: `${capsule.title} · ${AUDIENCE_LABEL[audiencia]}` };
}

export default async function CapsulePathPage({ params }: { params: Params }) {
  const { slug, audiencia } = await params;
  const [capsule, user] = await Promise.all([getCapsule(slug), getCurrentUser()]);
  if (!capsule || !isAudience(audiencia)) notFound();
  const state = await getValidationState(capsule);
  if (!state.approved && user?.role !== "VALIDADOR") notFound();
  const visual = capsule.visuals[audiencia];
  const certificate = user && hasCertificate(audiencia)
    ? await db.certificate.findUnique({
        where: { userId_capsuleSlug_audience: { userId: user.id, capsuleSlug: slug, audience: audiencia } },
      })
    : null;
  const here = `/capsulas/${slug}/${audiencia}`;

  return (
    <article className="space-y-6">
      <nav aria-label="Migas de pan" className="text-sm">
        <Link href={`/capsulas/${slug}`} className="text-ib-blue underline">← {capsule.title}</Link>
      </nav>
      <h1 className="text-3xl font-bold">
        {capsule.title} <span className="block text-xl font-normal">Para {AUDIENCE_LABEL[audiencia].toLowerCase()}</span>
      </h1>
      {visual && <VisualPath path={visual} />}
      <Markdown>{capsule.paths[audiencia]}</Markdown>

      {hasCertificate(audiencia) && (
      <section aria-labelledby="quiz" className="space-y-4 border-t-2 border-slate-200 pt-6">
        <h2 id="quiz" className="text-2xl font-bold">Tu certificado</h2>
        {certificate ? (
          <Alert kind="ok">
            Ya tenés el certificado de este recorrido.{" "}
            <Link href={`/verificar/${certificate.code}`} className="underline font-bold">Verlo</Link>
          </Alert>
        ) : !state.approved ? (
          <Alert kind="info">El certificado estará disponible cuando la cápsula esté validada.</Alert>
        ) : !user ? (
          <div className="space-y-3">
            <p>Respondé {capsule.quiz.length} preguntas cortas para obtener tu certificado verificable.</p>
            <ButtonLink href={`/ingresar?next=${encodeURIComponent(here)}`}>Ingresá para hacerlo</ButtonLink>
          </div>
        ) : user.role === "VALIDADOR" ? (
          <Alert kind="info">Las cuentas de validación no reciben certificados.</Alert>
        ) : (
          <>
            <p>Respondé estas {capsule.quiz.length} preguntas. Podés intentarlo las veces que quieras.</p>
            <QuizForm slug={slug} audience={audiencia} questions={capsule.quiz} />
          </>
        )}
      </section>
      )}
    </article>
  );
}
