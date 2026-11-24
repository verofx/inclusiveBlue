# Cómo correr la demo de InclusiveBlue

Guía paso a paso para ver la demo en tu computadora (Windows, Mac o Linux). Tarda unos 10 minutos la primera vez.

Si solo querés ver cómo funciona, mirá el video: [`docs/InclusiveBlue-Demo.mp4`](docs/InclusiveBlue-Demo.mp4).

## 1. Instalar lo necesario

- **Node.js 20 o más nuevo:** descargalo de https://nodejs.org (versión "LTS") e instalalo con las opciones por defecto.
- **Git** (opcional, para clonar el repo): https://git-scm.com. Si no lo tenés, podés bajar el código como ZIP desde GitHub con el botón **Code → Download ZIP**.

Para comprobar que Node quedó instalado, abrí una terminal (en Windows: "Símbolo del sistema" o "PowerShell") y escribí:

```bash
node --version
```

Tiene que mostrar `v20` o un número mayor.

## 2. Descargar el código

```bash
git clone https://github.com/verofx/inclusiveBlue.git
cd inclusiveBlue
```

Si bajaste el ZIP, descomprimilo y, en la terminal, entrá a la carpeta con `cd ruta/a/inclusiveBlue`.

## 3. Preparar la demo (solo la primera vez)

```bash
npm install
npm run db:setup
```

Antes de esos comandos, copiá el archivo de configuración:

- Mac / Linux: `cp .env.example .env`
- Windows: `copy .env.example .env`

`npm run db:setup` crea la base de datos local y carga los usuarios y las escuelas de prueba.

## 4. Iniciar la demo

```bash
npm run dev
```

Abrí el navegador en **http://localhost:3000**. Para cerrarla, volvé a la terminal y apretá `Ctrl + C`.

## 5. Recorrido sugerido

Todos los usuarios de prueba usan la contraseña **`inclusive123`**.

| Rol | Email |
| --- | --- |
| Validadora (profesional) | validadora@inclusiveblue.test |
| Docente | docente@inclusiveblue.test |
| Estudiante | estudiante@inclusiveblue.test |
| Familia | familia@inclusiveblue.test |

1. **Validar:** ingresá como validadora, andá a **Validar**, abrí «¿Qué es el TEA?» y tocá **Aprobar esta versión**. Hasta que no se aprueba, la cápsula no aparece para el resto.
2. **Aprender:** salí e ingresá como docente (o creá una cuenta nueva en **Crear cuenta** y elegí tu escuela). Abrí la cápsula, mirá la versión de lectura fácil y entrá al recorrido para tu rol.
3. **Certificar:** respondé las preguntas. Si están bien, se emite el certificado y la escuela suma 10 puntos. Desde ahí podés descargar el PDF con QR.
4. **Verificar:** en **Verificar certificado**, cualquiera puede comprobar un certificado con su código.
5. **Escuelas:** en **Escuelas** se ve el puntaje y los créditos de cada escuela.

Las escuelas y los usuarios de la demo son ficticios.

## Volver a empezar de cero

Para borrar todo lo que hiciste en la demo (validaciones, certificados y cuentas nuevas):

- Mac / Linux: `rm prisma/dev.db && npm run db:setup`
- Windows: `del prisma\dev.db` y después `npm run db:setup`

## Problemas comunes

- **`npm` no se reconoce como comando:** cerrá y volvé a abrir la terminal después de instalar Node.js.
- **El puerto 3000 está ocupado:** usá `npm run dev -- -p 3001` y abrí http://localhost:3001.
- **La cápsula no aparece:** falta aprobarla como validadora (paso 1).
