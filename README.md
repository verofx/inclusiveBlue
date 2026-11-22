# InclusiveBlue 💙

**Educación inclusiva real.** Cápsulas breves sobre inclusión escolar para docentes, estudiantes y familias, validadas por profesionales, con certificado verificable.

> La propuesta original (Hackathon Polkadot x NerdConf 2025) está en [`docs/PITCH.md`](docs/PITCH.md) y [`docs/InclusiveBlue-TecnologiaWeb3.pdf`](docs/InclusiveBlue-TecnologiaWeb3.pdf).

## Qué hace la v1

- **Cápsulas** en Markdown con un recorrido por rol (docente, estudiante, familia) y una versión de lectura fácil. La primera: *¿Qué es el TEA?*
- **Validación profesional:** cada versión del contenido necesita la aprobación de un profesional validador antes de publicarse. Si el contenido cambia, vuelve a revisión.
- **Certificados:** al responder bien las preguntas de la cápsula se emite un certificado en PDF con QR y una página pública de verificación (`/verificar/<código>`).
- **Accesible:** HTML semántico, navegación por teclado, foco visible, fuente Atkinson Hyperlegible, respeta `prefers-reduced-motion`.

Web3 (NFT del certificado) queda como módulo opcional para más adelante: el certificado ya guarda el hash de la versión del contenido para poder anclarlo on-chain.

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
