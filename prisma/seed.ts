import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const DEMO_PASSWORD = "inclusive123";

const users = [
  { name: "Lic. Ana Gómez", email: "validadora@inclusiveblue.test", role: "VALIDADOR", profession: "Psicopedagoga", license: "SA-1234" },
  { name: "Laura Docente", email: "docente@inclusiveblue.test", role: "DOCENTE" },
  { name: "Mateo Estudiante", email: "estudiante@inclusiveblue.test", role: "ESTUDIANTE" },
  { name: "Familia Pérez", email: "familia@inclusiveblue.test", role: "FAMILIA" },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const u of users) {
    await db.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, passwordHash } });
  }
  console.log(`Usuarios demo listos (contraseña: ${DEMO_PASSWORD}):`);
  users.forEach((u) => console.log(`  ${u.role.padEnd(10)} ${u.email}`));
}

main().finally(() => db.$disconnect());
