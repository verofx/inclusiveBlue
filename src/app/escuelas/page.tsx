import { Alert } from "@/components/ui";
import { db } from "@/lib/db";
import { POINTS_PER_CERTIFICATE, POINTS_PER_CREDIT, creditsFor } from "@/lib/scoring";

export const metadata = { title: "Escuelas comprometidas" };

export default async function SchoolsPage() {
  const [schools, totals] = await Promise.all([
    db.school.findMany(),
    db.certificate.groupBy({
      by: ["schoolId"],
      where: { schoolId: { not: null } },
      _sum: { points: true },
      _count: { _all: true },
    }),
  ]);
  const bySchool = new Map(totals.map((t) => [t.schoolId, t]));
  const rows = schools
    .map((s) => {
      const t = bySchool.get(s.id);
      const points = t?._sum.points ?? 0;
      return { ...s, certificates: t?._count._all ?? 0, points, credits: creditsFor(points) };
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Escuelas comprometidas</h1>
      <p>
        Cada vez que alguien de la comunidad educativa completa una cápsula, su escuela suma{" "}
        {POINTS_PER_CERTIFICATE} puntos. Cada {POINTS_PER_CREDIT} puntos, la escuela gana 1 crédito InclusiveBlue.
      </p>
      <Alert kind="info">
        <strong>Próximamente con Web3:</strong> los créditos se van a registrar en blockchain como prueba pública y
        verificable del compromiso de cada escuela con la inclusión, y se van a poder canjear por formación,
        materiales o reconocimientos.
      </Alert>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Puntaje de las escuelas, de mayor a menor</caption>
          <thead>
            <tr className="border-b-2 border-ib-blue">
              <th scope="col" className="py-2 pr-3">Puesto</th>
              <th scope="col" className="py-2 pr-3">Escuela</th>
              <th scope="col" className="py-2 pr-3">Región</th>
              <th scope="col" className="py-2 pr-3 text-right">Certificados</th>
              <th scope="col" className="py-2 pr-3 text-right">Puntaje</th>
              <th scope="col" className="py-2 text-right">Créditos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b border-slate-200">
                <td className="py-2 pr-3">{i + 1}</td>
                <th scope="row" className="py-2 pr-3 font-bold">
                  {r.name}
                  <span className="block text-sm font-normal text-slate-700">{r.locality}</span>
                </th>
                <td className="py-2 pr-3">{r.region}</td>
                <td className="py-2 pr-3 text-right">{r.certificates}</td>
                <td className="py-2 pr-3 text-right font-bold">{r.points}</td>
                <td className="py-2 text-right">{r.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
