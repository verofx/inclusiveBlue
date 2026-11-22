import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: { default: "InclusiveBlue", template: "%s · InclusiveBlue" },
  description: "Cápsulas breves sobre inclusión escolar, validadas por profesionales, con certificado verificable.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${atkinson.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-ib-blue-dark"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" tabIndex={-1} className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-700">
          InclusiveBlue · Por una inclusión real, para todos y con todos.
        </footer>
      </body>
    </html>
  );
}
