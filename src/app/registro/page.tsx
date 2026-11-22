import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";
import { db } from "@/lib/db";

export const metadata = { title: "Crear cuenta" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const schools = await db.school.findMany({ select: { id: true, name: true, locality: true }, orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <p>Con tu cuenta podés completar cápsulas y obtener certificados verificables.</p>
      <RegisterForm next={next} schools={schools} />
      <p>
        ¿Ya tenés cuenta?{" "}
        <Link href={next ? `/ingresar?next=${encodeURIComponent(next)}` : "/ingresar"} className="text-ib-blue underline">
          Ingresá
        </Link>
        .
      </p>
    </div>
  );
}
