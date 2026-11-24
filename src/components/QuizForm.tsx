"use client";

import { useActionState } from "react";
import { submitQuiz, type QuizState } from "@/app/actions/learning";
import type { QuizQuestion } from "@/lib/capsules";
import { Alert, buttonClass } from "./ui";

export function QuizForm(props: { slug: string; audience: string; questions: QuizQuestion[] }) {
  const [state, action, pending] = useActionState<QuizState, FormData>(submitQuiz, { status: "idle" });
  const wrong = state.status === "retry" ? new Set(state.wrong) : new Set<number>();

  return (
    <form action={action} className="space-y-6">
      {state.status === "error" && <Alert kind="error">{state.message}</Alert>}
      {state.status === "retry" && (
        <Alert kind="info">
          Respondiste bien {state.correct} de {state.total}. Revisá las preguntas marcadas y probá de nuevo.
        </Alert>
      )}
      <input type="hidden" name="slug" value={props.slug} />
      <input type="hidden" name="audience" value={props.audience} />
      {props.questions.map((q, i) => (
        <fieldset
          key={q.pregunta}
          className={`rounded-lg border-2 p-4 space-y-2 ${wrong.has(i) ? "border-amber-600" : "border-slate-200"}`}
          aria-describedby={wrong.has(i) ? `q${i}-hint` : undefined}
        >
          <legend className="font-bold px-1">
            {i + 1}. {q.pregunta}
          </legend>
          {q.opciones.map((opcion, j) => (
            <label key={opcion} className="flex items-start gap-2">
              <input type="radio" name={`q${i}`} value={j} required className="mt-1 size-5 shrink-0" />
              <span>{opcion}</span>
            </label>
          ))}
          {wrong.has(i) && (
            <p id={`q${i}-hint`} className="text-amber-900 text-sm">
              Esta respuesta no es correcta. Pista: {q.explicacion}
            </p>
          )}
        </fieldset>
      ))}
      <button type="submit" className={buttonClass} disabled={pending}>
        {pending ? "Revisando…" : "Enviar respuestas"}
      </button>
    </form>
  );
}
