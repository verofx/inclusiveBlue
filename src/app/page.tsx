import { ButtonLink, secondaryButtonClass } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-ib-blue-dark">Educación inclusiva real</h1>
        <p className="text-xl">
          Cápsulas breves sobre inclusión escolar para docentes, estudiantes y familias. Cada contenido está
          validado por profesionales y, al completarlo, recibís un certificado que cualquiera puede verificar.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/capsulas">Ver cápsulas</ButtonLink>
          <Link href="/verificar" className={secondaryButtonClass}>Verificar un certificado</Link>
        </div>
      </section>
      <section aria-labelledby="como" className="space-y-4">
        <h2 id="como" className="text-2xl font-bold">Cómo funciona</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["1. Aprendé", "Elegí una cápsula y el recorrido para tu rol. Lleva unos 10 minutos."],
            ["2. Contenido confiable", "Profesionales de la salud y la educación revisan y aprueban cada cápsula."],
            ["3. Certificado", "Respondé unas preguntas y obtené tu certificado con código QR verificable."],
          ].map(([title, text]) => (
            <li key={title} className="rounded-lg border-2 border-ib-blue-soft bg-ib-blue-soft p-4">
              <p className="font-bold text-lg">{title}</p>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
