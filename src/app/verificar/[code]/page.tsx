import Link from "next/link";
import { Alert, buttonClass } from "@/components/ui";
import type { ValidatorSnapshot } from "@/lib/certificates";
import { db } from "@/lib/db";
import { AUDIENCE_LABEL, isAudience } from "@/lib/roles";

export const metadata = { title: "Certificado" };

const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "America/Argentina/Jujuy" });

export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const code = decodeURIComponent((await params).code).toUpperCase();
  const { nuevo } = await searchParams;
  const cert = await db.certificate.findUnique({
    where: { code },
    include: { user: { select: { name: true } }, school: { select: { name: true, locality: true } } },
  });

  if (!cert) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Certificado no encontrado</h1>
        <Alert kind="error">No existe ningún certificado con el código {code}. Revisá que esté bien escrito.</Alert>
        <Link href="/verificar" className="text-ib-blue underline">Probar con otro código</Link>
      </div>
    );
  }

  const validators = JSON.parse(cert.validatorsJson) as ValidatorSnapshot[];
  const audience = isAudience(cert.audience) ? AUDIENCE_LABEL[cert.audience].toLowerCase() : cert.audience;

  return (
    <div className="space-y-6">
      {nuevo && (
        <Alert kind="ok">
          ¡Felicitaciones! Completaste la cápsula y obtuviste tu certificado.
          {cert.school && cert.points > 0 && (
            <>
              {" "}Sumaste {cert.points} puntos para {cert.school.name}.{" "}
              <Link href="/escuelas" className="underline font-bold">Ver puntaje de las escuelas</Link>
            </>
          )}
        </Alert>
      )}
      <section aria-labelledby="cert" className="rounded-xl border-4 border-ib-blue p-6 space-y-3">
        <p className="font-bold text-green-800">✓ Certificado válido</p>
        <h1 id="cert" className="text-3xl font-bold">{cert.user.name}</h1>
        <p className="text-lg">
          completó la cápsula <strong>{cert.capsuleTitle}</strong> (recorrido para {audience}) el{" "}
          {dateFormat.format(cert.issuedAt)}.
        </p>
        {validators.length > 0 && (
          <p>
            Contenido validado por:{" "}
            {validators
              .map((v) => [v.name, v.profession, v.license && `Mat. ${v.license}`].filter(Boolean).join(", "))
              .join(" · ")}
          </p>
        )}
        {cert.school && (
          <p>
            Escuela: {cert.school.name} ({cert.school.locality})
          </p>
        )}
        <p className="text-sm text-slate-700">
          Código: <span className="font-mono">{cert.code}</span> · Versión del contenido: {cert.contentHash.slice(0, 8)}
        </p>
      </section>
      <a href={`/certificados/${cert.code}/pdf`} className={buttonClass}>
        Descargar PDF
      </a>
    </div>
  );
}
