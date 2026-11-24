import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ingresar</h1>
      <LoginForm next={next} />
      <p>
        ¿No tenés cuenta?{" "}
        <Link href={next ? `/registro?next=${encodeURIComponent(next)}` : "/registro"} className="text-ib-blue underline">
          Creá una
        </Link>
        .
      </p>
    </div>
  );
}
