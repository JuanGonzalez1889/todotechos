"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/content/projects";
import { ProjectCard } from "./Bloques";
import { useParamServicio } from "./useParamServicio";

type Opcion = { value: string; label: string };

export function ObrasExplorer({ projects, servicios }: { projects: Project[]; servicios: Opcion[] }) {
  const desdeUrl = useParamServicio(servicios);
  const [elegido, setServicio] = useState<string | null>(null);
  const servicio = elegido ?? desdeUrl ?? "todos";
  const [provincia, setProvincia] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  const provincias = useMemo(() => [...new Set(projects.map((p) => p.province))].sort(), [projects]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (servicio === "todos" || p.service === servicio) &&
        (provincia === "todas" || p.province === provincia) &&
        (!q || `${p.title} ${p.city} ${p.province}`.toLowerCase().includes(q)),
    );
  }, [projects, servicio, provincia, busqueda]);

  const limpiar = () => {
    setServicio("todos");
    setProvincia("todas");
    setBusqueda("");
  };

  const chip = (activo: boolean) =>
    `min-h-11 px-4 font-display text-[1.0625rem] font-semibold uppercase tracking-wide transition-colors ${
      activo ? "bg-verde text-white" : "bg-chapa text-tinta hover:bg-tinta hover:text-white"
    }`;

  return (
    <div>
      <div className="grid gap-5 border-b border-linea pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <fieldset>
          <legend className="mb-2.5 text-[0.9375rem] font-semibold">Tipo de obra</legend>
          <div className="flex flex-wrap gap-2">
            {[{ value: "todos", label: "Todas" }, ...servicios].map((o) => (
              <button key={o.value} type="button" aria-pressed={servicio === o.value} onClick={() => setServicio(o.value)} className={chip(servicio === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="campo grid gap-4 sm:grid-cols-2 lg:w-[30rem]">
          <div>
            <label htmlFor="f-provincia">Provincia</label>
            <select id="f-provincia" value={provincia} onChange={(e) => setProvincia(e.target.value)}>
              <option value="todas">Todas</option>
              {provincias.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-buscar">Buscar obra</label>
            <input id="f-buscar" type="search" placeholder="Nombre o localidad" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>
      </div>

      <p className="mt-5 text-acero" aria-live="polite">
        {visibles.length === 1 ? "1 obra" : `${visibles.length} obras`}
      </p>

      {visibles.length === 0 ? (
        <div className="chapa mt-6 px-6 py-14 text-center">
          <p className="font-display text-3xl font-bold uppercase">No hay obras con esos filtros</p>
          <p className="mt-2 text-acero">Probá con otro tipo de obra u otra provincia.</p>
          <button type="button" onClick={limpiar} className="btn btn-tinta mt-6">
            Quitar filtros
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard p={p} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
