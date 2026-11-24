# InclusiveBlue 💙

**Educación inclusiva real.** Cápsulas breves sobre inclusión escolar para docentes, estudiantes y familias, validadas por profesionales, con certificado verificable.

- **Presentación del proyecto (Jujuy):** [`docs/InclusiveBlue-Presentacion.pdf`](docs/InclusiveBlue-Presentacion.pdf)
- **Video de la demo:** [`docs/InclusiveBlue-Demo.mp4`](docs/InclusiveBlue-Demo.mp4)
- **Cómo correr la demo paso a paso:** [`INSTRUCCIONES-DEMO.md`](INSTRUCCIONES-DEMO.md)

Equipo: Rocío Astudillo, Analía Aparicio y Verónica Torres.

> La propuesta original (Hackathon Polkadot x NerdConf 2025) está en [`docs/PITCH.md`](docs/PITCH.md).

## Qué hace la v1

- **Cápsulas** en Markdown con un recorrido por rol (docente, estudiante, familia) y una versión de lectura fácil. La primera: *¿Qué es el TEA?*
- **Validación profesional:** cada versión del contenido necesita la aprobación de un profesional validador antes de publicarse. Si el contenido cambia, vuelve a revisión.
- **Certificados:** al responder bien las preguntas de la cápsula se emite un certificado en PDF con QR y una página pública de verificación (`/verificar/<código>`).
- **Puntaje por escuela:** cada persona elige su escuela al registrarse. Cada certificado suma 10 puntos a su escuela y cada 10 puntos dan 1 crédito InclusiveBlue (`/escuelas`).
- **Recorrido para peques:** para chicos y chicas que todavía no leen: video narrado, tarjetas ilustradas con audio y un juego con dibujos (sin certificado, para hacer con una persona adulta).
- **Accesible:** HTML semántico, navegación por teclado, foco visible, fuente Atkinson Hyperlegible, respeta `prefers-reduced-motion`.

Web3 queda como módulo opcional para más adelante: registrar en blockchain el NFT del certificado y los créditos de cada escuela, para que sean públicos, verificables y canjeables. El certificado ya guarda el hash de la versión del contenido para poder anclarlo on-chain.

## Estado actual

🧪 Proyecto en fase de demo. Buscamos que el NOA sea un punto de innovación educativa (a futuro, también con uso de blockchain).

## Desarrollo

Requiere Node.js 20+.

```bash
cp .env.example .env      # y cambiá SESSION_SECRET
npm install
npm run db:setup          # crea la base SQLite y carga usuarios demo
npm run dev               # http://localhost:3000
```

Usuarios demo (contraseña `inclusive123`):

| Rol | Email |
| --- | --- |
| Validadora | validadora@inclusiveblue.test |
| Docente | docente@inclusiveblue.test |
| Estudiante | estudiante@inclusiveblue.test |
| Familia | familia@inclusiveblue.test |

Las cápsulas arrancan **sin validar**: ingresá como validadora en `/validar` y aprobá la cápsula para que aparezca para el resto.

## Agregar una cápsula

Crear `content/capsulas/<slug>/` con:

- `index.md`: frontmatter (`titulo`, `resumen`, `minutos`, `temas`, `lecturaFacil`, `quiz`) y la introducción común.
- `docente.md`, `estudiante.md`, `familia.md`: el recorrido para cada rol.

Ver `content/capsulas/que-es-el-tea/` como ejemplo.

## Pasar a Supabase / Postgres

En `prisma/schema.prisma` cambiar `provider = "sqlite"` por `"postgresql"`, poner la connection string de Supabase en `DATABASE_URL` y correr `npm run db:setup`.

## Créditos

La narración del recorrido para peques se generó con [Piper](https://github.com/rhasspy/piper) y la voz `es_AR-daniela-high`, entrenada con el corpus de español argentino de [OpenSLR 61](https://www.openslr.org/61/) (CC BY-SA 4.0).
