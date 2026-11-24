import "server-only";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { AUDIENCES, type Audience } from "./roles";

const ROOT = path.join(process.cwd(), "content", "capsulas");

export type QuizQuestion = {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
};

export type Capsule = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  topics: string[];
  easyRead: string[];
  intro: string;
  paths: Record<Audience, string>;
  quiz: QuizQuestion[];
  contentHash: string;
};

async function readFile(file: string) {
  return fs.readFile(file, "utf8");
}

export async function listCapsuleSlugs() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

export async function getCapsule(slug: string): Promise<Capsule | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const dir = path.join(ROOT, slug);
  try {
    const indexRaw = await readFile(path.join(dir, "index.md"));
    const pathRaws = await Promise.all(
      AUDIENCES.map((a) => readFile(path.join(dir, `${a}.md`))),
    );
    const { data, content } = matter(indexRaw);
    const hash = createHash("sha256");
    hash.update(indexRaw);
    pathRaws.forEach((raw) => hash.update(raw));
    return {
      slug,
      title: String(data.titulo),
      summary: String(data.resumen),
      minutes: Number(data.minutos ?? 10),
      topics: (data.temas as string[]) ?? [],
      easyRead: (data.lecturaFacil as string[]) ?? [],
      quiz: (data.quiz as QuizQuestion[]) ?? [],
      intro: content.trim(),
      paths: Object.fromEntries(
        AUDIENCES.map((a, i) => [a, matter(pathRaws[i]).content.trim()]),
      ) as Record<Audience, string>,
      contentHash: hash.digest("hex").slice(0, 16),
    };
  } catch {
    return null;
  }
}

export async function listCapsules() {
  const slugs = await listCapsuleSlugs();
  const capsules = await Promise.all(slugs.map(getCapsule));
  return capsules.filter((c): c is Capsule => c !== null);
}
