import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";

export const metadata = { title: "Crear cuenta" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <p>Con tu cuenta podés completar cápsulas y obtener certificados verificables.</p>
      <RegisterForm next={next} />
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
