import { ButtonLink, secondaryButtonClass } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="inline-block rounded-full bg-ib-blue-soft px-3 py-1 text-sm font-bold text-ib-blue-dark">
          Piloto 2027 · Escuelas de Jujuy
        </p>
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
      <section aria-labelledby="jujuy" className="space-y-4 rounded-lg border-2 border-ib-blue p-5">
        <h2 id="jujuy" className="text-2xl font-bold">Piloto en Jujuy</h2>
        <p>
          Queremos que cada escuela de la provincia, desde San Salvador hasta la Puna, tenga acceso a formación
          confiable sobre inclusión, aunque esté lejos de un centro especializado.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cápsulas cortas que se pueden ver desde el celular y en pocos minutos.</li>
          <li>Contenido revisado por profesionales de la provincia.</li>
          <li>Certificados verificables para docentes y escuelas comprometidas con la inclusión.</li>
        </ul>
      </section>
    </div>
  );
}
