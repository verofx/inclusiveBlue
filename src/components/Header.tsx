import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { ROLE_LABEL, type Role } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();
  const linkClass = "underline-offset-4 hover:underline px-1";
  return (
    <header className="bg-ib-blue-dark text-white">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo.jpeg" alt="" width={36} height={36} className="rounded-full" />
          InclusiveBlue
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
          <Link href="/capsulas" className={linkClass}>Cápsulas</Link>
          <Link href="/escuelas" className={linkClass}>Escuelas</Link>
          <Link href="/verificar" className={linkClass}>Verificar certificado</Link>
          {user?.role === "VALIDADOR" && (
            <Link href="/validar" className={linkClass}>Validar</Link>
          )}
          {user && user.role !== "VALIDADOR" && (
            <Link href="/mis-certificados" className={linkClass}>Mis certificados</Link>
          )}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span>
                {user.name} <span className="opacity-80">({ROLE_LABEL[user.role as Role] ?? user.role})</span>
              </span>
              <form action={logout}>
                <button type="submit" className="underline underline-offset-4">Salir</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/ingresar" className={linkClass}>Ingresar</Link>
              <Link href="/registro" className="bg-white text-ib-blue-dark font-bold rounded px-3 py-1">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
