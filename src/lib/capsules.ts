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

export type VisualCard = { imagen: string; audio: string; alt: string; texto: string };

export type VisualGame = {
  preguntas: {
    pregunta: string;
    audio: string;
    opciones: VisualCard[];
    correcta: number;
    bien: string;
    audioBien: string;
  }[];
  otraVez: string;
  audioOtraVez: string;
};

export type VisualPath = {
  video?: { archivo: string; subtitulos?: string; poster?: string; titulo: string };
  tarjetas: VisualCard[];
  juego?: VisualGame;
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
  visuals: Partial<Record<Audience, VisualPath>>;
  quiz: QuizQuestion[];
  contentHash: string;
};

async function readFile(file: string) {
  return fs.readFile(file, "utf8");
}

const PUBLIC = path.join(process.cwd(), "public");

function visualAssets(v: VisualPath) {
  const files = v.tarjetas.flatMap((t) => [t.imagen, t.audio]);
  if (v.video) files.push(...[v.video.archivo, v.video.subtitulos, v.video.poster].filter((f): f is string => !!f));
  if (v.juego) {
    files.push(v.juego.audioOtraVez);
    for (const q of v.juego.preguntas) {
      files.push(q.audio, q.audioBien, ...q.opciones.flatMap((o) => [o.imagen, o.audio]));
    }
  }
  return files;
}

function resolveVisual(v: VisualPath, base: string): VisualPath {
  const url = (file: string) => `${base}/${file}`;
  const card = (t: VisualCard) => ({ ...t, imagen: url(t.imagen), audio: url(t.audio) });
  return {
    video: v.video && {
      ...v.video,
      archivo: url(v.video.archivo),
      subtitulos: v.video.subtitulos && url(v.video.subtitulos),
      poster: v.video.poster && url(v.video.poster),
    },
    tarjetas: v.tarjetas.map(card),
    juego: v.juego && {
      ...v.juego,
      audioOtraVez: url(v.juego.audioOtraVez),
      preguntas: v.juego.preguntas.map((q) => ({
        ...q,
        audio: url(q.audio),
        audioBien: url(q.audioBien),
        opciones: q.opciones.map(card),
      })),
    },
  };
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
    const parsedPaths = pathRaws.map((raw) => matter(raw));
    const hash = createHash("sha256");
    hash.update(indexRaw);
    pathRaws.forEach((raw) => hash.update(raw));
    const visuals: Partial<Record<Audience, VisualPath>> = {};
    for (const [i, a] of AUDIENCES.entries()) {
      const visual = parsedPaths[i].data as VisualPath;
      if (!Array.isArray(visual.tarjetas)) continue;
      const base = `/capsulas/${slug}/${a}`;
      for (const file of visualAssets(visual)) {
        hash.update(await fs.readFile(path.join(PUBLIC, base, file)));
      }
      visuals[a] = resolveVisual(visual, base);
    }
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
        AUDIENCES.map((a, i) => [a, parsedPaths[i].content.trim()]),
      ) as Record<Audience, string>,
      visuals,
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
