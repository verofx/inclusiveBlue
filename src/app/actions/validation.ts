"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCapsule } from "@/lib/capsules";
import { getCurrentUser } from "@/lib/session";

export type ReviewState = { error?: string; ok?: string } | undefined;

const schema = z
  .object({
    slug: z.string(),
    contentHash: z.string(),
    status: z.enum(["APROBADA", "CAMBIOS"]),
    comment: z.string().trim().max(2000).optional(),
  })
  .refine((v) => v.status === "APROBADA" || (v.comment && v.comment.length >= 5), {
    message: "Contá qué habría que cambiar (al menos unas palabras).",
  });

export async function reviewCapsule(_: ReviewState, formData: FormData): Promise<ReviewState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "VALIDADOR") return { error: "Solo profesionales validadores pueden revisar cápsulas." };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { slug, contentHash, status, comment } = parsed.data;
  const capsule = await getCapsule(slug);
  if (!capsule) return { error: "Cápsula no encontrada." };
  if (capsule.contentHash !== contentHash) {
    return { error: "El contenido cambió mientras lo revisabas. Recargá la página y revisalo de nuevo." };
  }
  await db.validation.create({
    data: { capsuleSlug: slug, contentHash, status, comment: comment || null, validatorId: user.id },
  });
  revalidatePath("/validar");
  revalidatePath(`/capsulas/${slug}`);
  return { ok: status === "APROBADA" ? "Aprobaste esta versión de la cápsula." : "Enviaste tus pedidos de cambio." };
}
