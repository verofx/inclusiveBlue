import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const DEMO_PASSWORD = "inclusive123";

const schools = [
  { id: "demo-san-salvador", name: "Escuela Demo San Salvador", locality: "San Salvador de Jujuy", region: "Valles" },
  { id: "demo-palpala", name: "Escuela Demo Palpalá", locality: "Palpalá", region: "Valles" },
  { id: "demo-humahuaca", name: "Escuela Demo Humahuaca", locality: "Humahuaca", region: "Quebrada" },
  { id: "demo-tilcara", name: "Escuela Demo Tilcara", locality: "Tilcara", region: "Quebrada" },
  { id: "demo-la-quiaca", name: "Escuela Demo La Quiaca", locality: "La Quiaca", region: "Puna" },
  { id: "demo-libertador", name: "Escuela Demo Libertador", locality: "Libertador General San Martín", region: "Yungas" },
];

const users = [
  { name: "Lic. Ana Gómez", email: "validadora@inclusiveblue.test", role: "VALIDADOR", profession: "Psicopedagoga", license: "JY-1234" },
  { name: "Laura Docente", email: "docente@inclusiveblue.test", role: "DOCENTE", schoolId: "demo-humahuaca" },
  { name: "Mateo Estudiante", email: "estudiante@inclusiveblue.test", role: "ESTUDIANTE", schoolId: "demo-humahuaca" },
  { name: "Familia Pérez", email: "familia@inclusiveblue.test", role: "FAMILIA", schoolId: "demo-san-salvador" },
];

async function main() {
  for (const s of schools) {
    await db.school.upsert({ where: { id: s.id }, update: s, create: s });
  }
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const u of users) {
    await db.user.upsert({ where: { email: u.email }, update: { schoolId: u.schoolId ?? null }, create: { ...u, passwordHash } });
  }
  console.log(`Usuarios demo listos (contraseña: ${DEMO_PASSWORD}):`);
  users.forEach((u) => console.log(`  ${u.role.padEnd(10)} ${u.email}`));
}

main().finally(() => db.$disconnect());
