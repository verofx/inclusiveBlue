import "server-only";
import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newCertificateCode() {
  const bytes = randomBytes(10);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `IB-${chars.slice(0, 5)}-${chars.slice(5)}`;
}

export type ValidatorSnapshot = { name: string; profession: string | null; license: string | null };

export function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
