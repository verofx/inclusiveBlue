"use client";

import { useRef, useState } from "react";
import type { VisualCard, VisualGame, VisualPath as VisualPathData } from "@/lib/capsules";

function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  return (src: string) => {
    ref.current?.pause();
    ref.current = new Audio(src);
    void ref.current.play();
  };
}

function ListenButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-ib-blue text-white hover:bg-ib-blue-dark"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
      </svg>
    </button>
  );
}

export function VisualPath({ path }: { path: VisualPathData }) {
  const play = useAudio();
  return (
    <div className="space-y-10">
      {path.video && (
        <section aria-labelledby="video-peques" className="space-y-3">
          <h2 id="video-peques" className="text-2xl font-bold">{path.video.titulo}</h2>
          <video controls preload="metadata" poster={path.video.poster} className="w-full rounded-xl border-2 border-slate-200">
            <source src={path.video.archivo} type="video/mp4" />
            {path.video.subtitulos && <track kind="captions" src={path.video.subtitulos} srcLang="es" label="Español" />}
          </video>
        </section>
      )}

      <section aria-labelledby="tarjetas-peques" className="space-y-4">
        <h2 id="tarjetas-peques" className="text-2xl font-bold">Mirá y escuchá</h2>
        <ol className="grid gap-5 sm:grid-cols-2">
          {path.tarjetas.map((t, i) => (
            <li key={t.imagen} className="rounded-2xl border-2 border-slate-200 p-3 space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.imagen} alt={t.alt} className="w-full rounded-xl" />
              <div className="flex items-center gap-3">
                <ListenButton onClick={() => play(t.audio)} label={`Escuchar tarjeta ${i + 1}`} />
                <p className="text-lg">{t.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {path.juego && <Game game={path.juego} play={play} />}
    </div>
  );
}

function Game({ game, play }: { game: VisualGame; play: (src: string) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <section aria-labelledby="juego-peques" className="space-y-6">
      <h2 id="juego-peques" className="text-2xl font-bold">¡A jugar!</h2>
      {game.preguntas.map((q, i) => {
        const chosen = answers[i];
        const solved = chosen === q.correcta;
        return (
          <fieldset key={q.pregunta} className="rounded-2xl border-2 border-slate-200 p-4 space-y-4">
            <legend className="flex items-center gap-3 px-1">
              <ListenButton onClick={() => play(q.audio)} label={`Escuchar pregunta ${i + 1}`} />
              <span className="text-lg font-bold">{q.pregunta}</span>
            </legend>
            <div className={`grid gap-4 ${q.opciones.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {q.opciones.map((o: VisualCard, j) => {
                const state = chosen === j ? (j === q.correcta ? "ok" : "no") : null;
                return (
                  <div key={o.imagen} className="space-y-2">
                    <button
                      type="button"
                      aria-pressed={chosen === j}
                      onClick={() => {
                        setAnswers((a) => ({ ...a, [i]: j }));
                        play(j === q.correcta ? q.audioBien : game.audioOtraVez);
                      }}
                      className={`block w-full rounded-2xl border-4 p-1 ${
                        state === "ok" ? "border-green-600 bg-green-50" : state === "no" ? "border-amber-500" : "border-transparent hover:border-ib-blue"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.imagen} alt={o.alt} className="w-full rounded-xl" />
                      <span className="sr-only">{o.texto}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <ListenButton onClick={() => play(o.audio)} label={`Escuchar: ${o.texto}`} />
                      {state && (
                        <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-10 ${state === "ok" ? "text-green-700" : "text-amber-600"}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          {state === "ok" ? <path d="m4 12 5 5L20 6" /> : <path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5" />}
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p role="status" className="text-lg font-bold min-h-7">
              {chosen === undefined ? "" : solved ? q.bien : game.otraVez}
            </p>
          </fieldset>
        );
      })}
    </section>
  );
}

export function VisualPathReview({ path }: { path: VisualPathData }) {
  return (
    <div className="space-y-3">
      {path.video && (
        <p>
          <a href={path.video.archivo} className="text-ib-blue underline">{path.video.titulo}</a>
        </p>
      )}
      <ol className="grid gap-3 sm:grid-cols-2">
        {path.tarjetas.map((t) => (
          <li key={t.imagen} className="space-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.imagen} alt={t.alt} className="w-full rounded-lg border border-slate-200" />
            <p className="text-sm">{t.texto}</p>
          </li>
        ))}
      </ol>
      {path.juego && (
        <ol className="list-decimal pl-6 space-y-1">
          {path.juego.preguntas.map((q) => (
            <li key={q.pregunta}>
              {q.pregunta} <br />
              <span className="text-sm">Respuesta correcta: {q.opciones[q.correcta].texto}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
