"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCapsule } from "@/lib/capsules";
import { newCertificateCode } from "@/lib/certificates";
import { hasCertificate, isAudience } from "@/lib/roles";
import { POINTS_PER_CERTIFICATE } from "@/lib/scoring";
import { getCurrentUser } from "@/lib/session";
import { getValidationState } from "@/lib/validation";

export type QuizState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "retry"; correct: number; total: number; wrong: number[] };

export async function submitQuiz(_: QuizState, formData: FormData): Promise<QuizState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "Ingresá a tu cuenta para obtener el certificado." };
  const slug = String(formData.get("slug"));
  const audience = String(formData.get("audience"));
  const capsule = await getCapsule(slug);
  if (!capsule || !isAudience(audience)) return { status: "error", message: "Cápsula no encontrada." };
  if (!hasCertificate(audience)) return { status: "error", message: "Este recorrido no emite certificado." };
  const validation = await getValidationState(capsule);
  if (!validation.approved) {
    return { status: "error", message: "Esta cápsula todavía no fue validada por profesionales." };
  }

  const wrong: number[] = [];
  capsule.quiz.forEach((q, i) => {
    if (Number(formData.get(`q${i}`)) !== q.correcta) wrong.push(i);
  });
  if (wrong.length > 0) {
    return { status: "retry", correct: capsule.quiz.length - wrong.length, total: capsule.quiz.length, wrong };
  }

  const existing = await db.certificate.findUnique({
    where: { userId_capsuleSlug_audience: { userId: user.id, capsuleSlug: slug, audience } },
  });
  const certificate =
    existing ??
    (await db.certificate.create({
      data: {
        code: newCertificateCode(),
        userId: user.id,
        capsuleSlug: slug,
        capsuleTitle: capsule.title,
        audience,
        contentHash: capsule.contentHash,
        schoolId: (await db.user.findUnique({ where: { id: user.id }, select: { schoolId: true } }))?.schoolId ?? null,
        points: POINTS_PER_CERTIFICATE,
        validatorsJson: JSON.stringify(
          validation.approvals.map(({ name, profession, license }) => ({ name, profession, license })),
        ),
      },
    }));
  revalidatePath("/mis-certificados");
  revalidatePath("/escuelas");
  redirect(`/verificar/${certificate.code}?nuevo=1`);
}
