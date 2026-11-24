import Link from "next/link";
import { listCapsules } from "@/lib/capsules";
import { getCurrentUser } from "@/lib/session";
import { getValidationState } from "@/lib/validation";
import { ValidationBadge } from "@/components/ui";

export const metadata = { title: "Cápsulas" };

export default async function CapsulesPage() {
  const [capsules, user] = await Promise.all([listCapsules(), getCurrentUser()]);
  const withState = await Promise.all(
    capsules.map(async (c) => ({ capsule: c, state: await getValidationState(c) })),
  );
  const visible = withState.filter(({ state }) => state.approved || user?.role === "VALIDADOR");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cápsulas</h1>
      {visible.length === 0 ? (
        <p>Todavía no hay cápsulas validadas. Pronto vas a encontrar contenido acá.</p>
      ) : (
        <ul className="space-y-4">
          {visible.map(({ capsule, state }) => (
            <li key={capsule.slug} className="rounded-lg border-2 border-slate-200 p-5 space-y-2">
              <h2 className="text-xl font-bold">
                <Link href={`/capsulas/${capsule.slug}`} className="text-ib-blue underline-offset-4 hover:underline">
                  {capsule.title}
                </Link>
              </h2>
              <p>{capsule.summary}</p>
              <p className="flex flex-wrap items-center gap-3 text-sm">
                <span>{capsule.minutes} minutos</span>
                <span aria-hidden="true">·</span>
                <span>{capsule.topics.join(", ")}</span>
                <ValidationBadge approved={state.approved} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
