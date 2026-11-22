export const AUDIENCES = ["docente", "estudiante", "familia"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const ROLES = ["DOCENTE", "ESTUDIANTE", "FAMILIA", "VALIDADOR"] as const;
export type Role = (typeof ROLES)[number];

export const AUDIENCE_LABEL: Record<Audience, string> = {
  docente: "Docentes",
  estudiante: "Estudiantes",
  familia: "Familias",
};

export const ROLE_LABEL: Record<Role, string> = {
  DOCENTE: "Docente",
  ESTUDIANTE: "Estudiante",
  FAMILIA: "Familia",
  VALIDADOR: "Profesional validador/a",
};

export function isAudience(value: string): value is Audience {
  return (AUDIENCES as readonly string[]).includes(value);
}

export function audienceForRole(role: string): Audience | null {
  const audience = role.toLowerCase();
  return isAudience(audience) ? audience : null;
}
