import { redirect } from "next/navigation";
import { buttonClass, inputClass } from "@/components/ui";

export const metadata = { title: "Verificar certificado" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ codigo?: string }> }) {
  const { codigo } = await searchParams;
  const code = codigo?.trim().toUpperCase();
  if (code) redirect(`/verificar/${encodeURIComponent(code)}`);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Verificar un certificado</h1>
      <p>Escribí el código que figura en el certificado (por ejemplo, IB-ABCDE-FGHJK) o escaneá su código QR.</p>
      <form method="get" className="space-y-4 max-w-md">
        <div className="space-y-1">
          <label htmlFor="codigo" className="block font-bold">Código del certificado</label>
          <input id="codigo" name="codigo" required autoComplete="off" className={`${inputClass} uppercase`} />
        </div>
        <button type="submit" className={buttonClass}>Verificar</button>
      </form>
    </div>
  );
}
