"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

export type FormState = { error?: string } | undefined;

const registerSchema = z.object({
  name: z.string().trim().min(2, "Escribí tu nombre (al menos 2 letras)."),
  email: z.string().trim().toLowerCase().email("Escribí un email válido."),
  password: z.string().min(8, "La contraseña tiene que tener al menos 8 caracteres."),
  role: z.enum(["DOCENTE", "ESTUDIANTE", "FAMILIA"], { message: "Elegí cómo participás." }),
  schoolId: z.string().min(1, "Elegí tu escuela."),
});

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/capsulas";
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, role, schoolId } = parsed.data;
  if (!(await db.school.findUnique({ where: { id: schoolId } }))) return { error: "Elegí tu escuela." };
  if (await db.user.findUnique({ where: { email } })) {
    return { error: "Ya existe una cuenta con ese email. Probá ingresar." };
  }
  const user = await db.user.create({
    data: { name, email, role, schoolId, passwordHash: await bcrypt.hash(password, 10) },
  });
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "El email o la contraseña no son correctos." };
  }
  await createSession(user.id);
  const next = safeNext(formData.get("next"));
  redirect(next === "/capsulas" && user.role === "VALIDADOR" ? "/validar" : next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
