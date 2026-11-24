import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">No encontramos esta página</h1>
      <ButtonLink href="/capsulas">Ir a las cápsulas</ButtonLink>
    </div>
  );
}
