import Link from "next/link";
import { ValidationBadge } from "@/components/ui";
import { listCapsules } from "@/lib/capsules";
import { requireValidator } from "@/lib/session";
import { getValidationState } from "@/lib/validation";

export const metadata = { title: "Validar cápsulas" };

export default async function ValidatorDashboard() {
  const user = await requireValidator();
  const capsules = await listCapsules();
  const rows = await Promise.all(capsules.map(async (c) => ({ c, s: await getValidationState(c) })));
  const pending = rows.filter((r) => !r.s.approved);
  const done = rows.filter((r) => r.s.approved);

  const List = ({ items }: { items: typeof rows }) => (
    <ul className="space-y-3">
      {items.map(({ c, s }) => (
        <li key={c.slug} className="rounded-lg border-2 border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/validar/${c.slug}`} className="text-lg font-bold text-ib-blue underline-offset-4 hover:underline">
              {c.title}
            </Link>
            <p className="text-sm text-slate-700">
              Versión {c.contentHash.slice(0, 8)} · {s.approvals.length} aprobación(es) · {s.changeRequests.length} pedido(s) de cambio
            </p>
          </div>
          <ValidationBadge approved={s.approved} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Validar cápsulas</h1>
        <p>
          Hola, {user.name}. Revisá que cada cápsula sea correcta, respetuosa y actualizada. Si el contenido cambia, la
          nueva versión vuelve a necesitar validación.
        </p>
      </div>
      <section aria-labelledby="pendientes" className="space-y-3">
        <h2 id="pendientes" className="text-2xl font-bold">Pendientes ({pending.length})</h2>
        {pending.length ? <List items={pending} /> : <p>No hay cápsulas pendientes. ¡Gracias!</p>}
      </section>
      <section aria-labelledby="validadas" className="space-y-3">
        <h2 id="validadas" className="text-2xl font-bold">Validadas ({done.length})</h2>
        {done.length ? <List items={done} /> : <p>Todavía ninguna.</p>}
      </section>
    </div>
  );
}
