import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { db } from "@/lib/db";
import { AUDIENCE_LABEL, isAudience } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Mis certificados" };

export default async function MyCertificatesPage() {
  const user = await requireUser("/mis-certificados");
  const certs = await db.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis certificados</h1>
      {certs.length === 0 ? (
        <div className="space-y-3">
          <p>Todavía no tenés certificados. Completá una cápsula para obtener el primero.</p>
          <ButtonLink href="/capsulas">Ver cápsulas</ButtonLink>
        </div>
      ) : (
        <ul className="space-y-3">
          {certs.map((c) => (
            <li key={c.id} className="rounded-lg border-2 border-slate-200 p-4">
              <Link href={`/verificar/${c.code}`} className="text-lg font-bold text-ib-blue underline-offset-4 hover:underline">
                {c.capsuleTitle}
              </Link>
              <p className="text-sm">
                Recorrido para {isAudience(c.audience) ? AUDIENCE_LABEL[c.audience].toLowerCase() : c.audience} ·{" "}
                <span className="font-mono">{c.code}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
