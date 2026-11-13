"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Check, Flecha } from "./Icons";
import { useParamServicio } from "./useParamServicio";

const MAX_ARCHIVOS = 5;
const MAX_MB = 10;
const FORMATOS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".dwg"];

type Errores = Partial<Record<string, string>>;

export function ContactForm({ servicios }: { servicios: { value: string; label: string }[] }) {
  const form = useRef<HTMLFormElement>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviada" | "error">("idle");
  const [archivos, setArchivos] = useState<File[]>([]);
  const desdeUrl = useParamServicio(servicios);
  const [elegido, setServicio] = useState<string | null>(null);
  const servicio = elegido ?? desdeUrl ?? "";

  const validar = (d: FormData): Errores => {
    const e: Errores = {};
    const txt = (k: string) => String(d.get(k) ?? "").trim();
    if (txt("nombre").length < 3) e.nombre = "Escribí tu nombre y apellido.";
    if (txt("telefono").replace(/\D/g, "").length < 8) e.telefono = "Escribí un teléfono con código de área.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt("email"))) e.email = "Escribí un correo válido, por ejemplo nombre@empresa.com.";
    if (!txt("localidad")) e.localidad = "Indicá la localidad y la provincia de la obra.";
    if (!txt("servicio")) e.servicio = "Elegí un tipo de servicio.";
    if (txt("descripcion").length < 15) e.descripcion = "Contanos un poco más sobre la obra (al menos 15 caracteres).";
    if (!d.get("privacidad")) e.privacidad = "Necesitamos que aceptes la política de privacidad.";
    if (archivos.length > MAX_ARCHIVOS) e.archivos = `Podés adjuntar hasta ${MAX_ARCHIVOS} archivos.`;
    const malo = archivos.find((f) => f.size > MAX_MB * 1024 * 1024 || !FORMATOS.some((x) => f.name.toLowerCase().endsWith(x)));
    if (malo) e.archivos = `"${malo.name}" no se puede adjuntar: usá ${FORMATOS.join(", ")} de hasta ${MAX_MB} MB.`;
    return e;
  };

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const datos = new FormData(ev.currentTarget);
    const e = validar(datos);
    setErrores(e);
    if (Object.keys(e).length) {
      const primero = Object.keys(e)[0];
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }
    setEstado("enviando");
    try {
      const r = await fetch("/api/contacto", { method: "POST", body: datos });
      if (!r.ok) throw new Error(String(r.status));
      setEstado("enviada");
    } catch {
      setEstado("error");
    }
  };

  if (estado === "enviada") {
    return (
      <div role="status" className="chapa p-8 md:p-12">
        <span className="grid h-14 w-14 place-items-center bg-verde text-white">
          <Check width={30} height={30} />
        </span>
        <h2 className="titulo mt-6 !text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)]">Consulta enviada</h2>
        <p className="mt-3 max-w-[48ch] text-[1.125rem] text-acero">
          Recibimos tus datos. Un integrante del equipo va a analizar tu proyecto y te va a contactar para avanzar con el
          presupuesto.
        </p>
        <button type="button" className="btn btn-tinta mt-7" onClick={() => { setEstado("idle"); setArchivos([]); }}>
          Enviar otra consulta
        </button>
      </div>
    );
  }

  const err = (k: string) =>
    errores[k] ? (
      <p id={`e-${k}`} className="error">
        {errores[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": errores[k] ? true : undefined, "aria-describedby": errores[k] ? `e-${k}` : undefined });

  return (
    <form ref={form} onSubmit={enviar} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="campo">
          <label htmlFor="nombre">Nombre y apellido</label>
          <input id="nombre" name="nombre" autoComplete="name" {...aria("nombre")} />
          {err("nombre")}
        </div>
        <div className="campo">
          <label htmlFor="empresa">
            Empresa <span className="font-normal text-acero">(opcional)</span>
          </label>
          <input id="empresa" name="empresa" autoComplete="organization" />
        </div>
        <div className="campo">
          <label htmlFor="telefono">Teléfono o WhatsApp</label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" inputMode="tel" {...aria("telefono")} />
          {err("telefono")}
        </div>
        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" autoComplete="email" {...aria("email")} />
          {err("email")}
        </div>
        <div className="campo">
          <label htmlFor="localidad">Localidad y provincia de la obra</label>
          <input id="localidad" name="localidad" autoComplete="address-level2" {...aria("localidad")} />
          {err("localidad")}
        </div>
        <div className="campo">
          <label htmlFor="servicio">Tipo de servicio</label>
          <select id="servicio" name="servicio" value={servicio} onChange={(e) => setServicio(e.target.value)} {...aria("servicio")}>
            <option value="">Elegí una opción</option>
            {servicios.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value="otro">Otro / no estoy seguro</option>
          </select>
          {err("servicio")}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción de la obra</label>
        <textarea id="descripcion" name="descripcion" rows={5} placeholder="Qué necesitás construir, para qué uso y en qué plazo." {...aria("descripcion")} />
        {err("descripcion")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="campo">
          <label htmlFor="superficie">
            Superficie aproximada en m² <span className="font-normal text-acero">(opcional)</span>
          </label>
          <input id="superficie" name="superficie" inputMode="numeric" />
        </div>
        <div className="campo">
          <label htmlFor="archivos">
            Planos o fotos <span className="font-normal text-acero">(opcional)</span>
          </label>
          <input
            id="archivos"
            name="archivos"
            type="file"
            multiple
            accept={FORMATOS.join(",")}
            onChange={(e) => setArchivos(Array.from(e.target.files ?? []))}
            className="block w-full cursor-pointer border-[1.5px] border-dashed border-linea bg-white p-2.5 text-[0.9375rem] file:mr-3 file:cursor-pointer file:border-0 file:bg-tinta file:px-3.5 file:py-2 file:font-medium file:text-white"
            {...aria("archivos")}
          />
          <p className="mt-1.5 text-[0.8125rem] text-acero">
            Hasta {MAX_ARCHIVOS} archivos de {MAX_MB} MB: PDF, JPG, PNG, WEBP o DWG.
          </p>
          {err("archivos")}
        </div>
      </div>

      {/* antispam: campo trampa invisible para personas */}
      <div aria-hidden className="absolute left-[-9999px] h-0 overflow-hidden">
        <label htmlFor="sitio">No completar</label>
        <input id="sitio" name="sitio" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo">
        <label htmlFor="privacidad" className="!mb-0 flex cursor-pointer items-start gap-3 !font-normal">
          <input id="privacidad" name="privacidad" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-verde)]" {...aria("privacidad")} />
          <span>
            Acepto la{" "}
            <Link href="/privacidad" target="_blank" className="font-medium text-verde underline underline-offset-4">
              política de privacidad
            </Link>{" "}
            y que me contacten por esta consulta.
          </span>
        </label>
        {err("privacidad")}
      </div>

      {estado === "error" && (
        <p role="alert" className="border-l-4 border-[#b3261e] bg-[#fdeceb] px-4 py-3">
          No se pudo enviar la consulta. Revisá tu conexión y volvé a intentar, o escribinos por WhatsApp.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" disabled={estado === "enviando"} className="btn btn-verde disabled:opacity-60">
          {estado === "enviando" ? "Enviando…" : "Enviar consulta"} <Flecha />
        </button>
        <p className="text-[0.9375rem] text-acero">Analizamos cada caso antes de presupuestar.</p>
      </div>
    </form>
  );
}
