"use client";

import { useActionState } from "react";
import { login, register } from "@/app/actions/auth";
import { Alert, buttonClass, inputClass } from "./ui";

function Field(props: { label: string; name: string; type?: string; autoComplete?: string; hint?: string }) {
  const id = `f-${props.name}`;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-bold">{props.label}</label>
      {props.hint && <p id={`${id}-hint`} className="text-sm text-slate-700">{props.hint}</p>}
      <input
        id={id}
        name={props.name}
        type={props.type ?? "text"}
        required
        autoComplete={props.autoComplete}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-5 max-w-md">
      {state?.error && <Alert kind="error">{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" />
      <button type="submit" className={buttonClass} disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(register, undefined);
  return (
    <form action={action} className="space-y-5 max-w-md">
      {state?.error && <Alert kind="error">{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Nombre" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="Al menos 8 caracteres."
      />
      <fieldset className="space-y-2">
        <legend className="font-bold">¿Cómo participás de la escuela?</legend>
        {[
          ["DOCENTE", "Soy docente o parte del equipo escolar"],
          ["ESTUDIANTE", "Soy estudiante"],
          ["FAMILIA", "Soy familia"],
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-2">
            <input type="radio" name="role" value={value} required className="size-5" />
            {label}
          </label>
        ))}
      </fieldset>
      <button type="submit" className={buttonClass} disabled={pending}>
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
