import "server-only";
import { db } from "./db";
import type { Capsule } from "./capsules";

export const REQUIRED_APPROVALS = 1;

export type CapsuleValidationState = {
  approved: boolean;
  approvals: { name: string; profession: string | null; license: string | null; at: Date }[];
  changeRequests: { name: string; comment: string | null; at: Date }[];
};

export async function getValidationState(capsule: Capsule): Promise<CapsuleValidationState> {
  const rows = await db.validation.findMany({
    where: { capsuleSlug: capsule.slug, contentHash: capsule.contentHash },
    include: { validator: { select: { id: true, name: true, profession: true, license: true } } },
    orderBy: { createdAt: "desc" },
  });
  const latestByValidator = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (!latestByValidator.has(row.validatorId)) latestByValidator.set(row.validatorId, row);
  }
  const latest = [...latestByValidator.values()];
  const approvals = latest
    .filter((r) => r.status === "APROBADA")
    .map((r) => ({
      name: r.validator.name,
      profession: r.validator.profession,
      license: r.validator.license,
      at: r.createdAt,
    }));
  const changeRequests = latest
    .filter((r) => r.status === "CAMBIOS")
    .map((r) => ({ name: r.validator.name, comment: r.comment, at: r.createdAt }));
  return {
    approved: approvals.length >= REQUIRED_APPROVALS && changeRequests.length === 0,
    approvals,
    changeRequests,
  };
}
