import type { Metadata } from "next";
import Link from "next/link";
import { ClientSlot, CtaBand, PageHero, ProjectCard } from "@/components/Bloques";
import { Flecha } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { clients } from "@/content/company";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Empresas e industrias que confiaron sus obras a TODO TECHOS.",
  alternates: { canonical: "/clientes" },
};

export default function Clientes() {
  const casos = projects.filter((p) => p.featured).slice(0, 3);
  return (
    <>
      <PageHero titulo="Clientes" bajada="Empresas e industrias con las que trabajamos." />

      <section className="seccion">
        <div className="contenedor">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {clients.map((c, i) => (
              <Reveal as="li" key={c.name} demora={(i % 4) * 70}>
                {c.project ? (
                  <Link href={`/obras/${c.project}`} aria-label={`Ver obra realizada para ${c.name}`} className="block transition-shadow hover:shadow-[0_0_0_2px_var(--color-verde)]">
                    <ClientSlot {...c} />
                  </Link>
                ) : (
                  <ClientSlot {...c} />
                )}
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 max-w-[62ch] text-[0.9375rem] text-acero">
            Publicamos únicamente logos originales de clientes que autorizaron su exhibición.
          </p>
        </div>
      </section>

      <section className="seccion bg-chapa-clara" aria-labelledby="t-casos">
        <div className="contenedor">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 id="t-casos" className="titulo titulo-barra">
              Trabajos realizados
            </h2>
            <Link href="/obras" className="enlace shrink-0">
              Ver todas las obras <Flecha />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {casos.map((p, i) => (
              <Reveal key={p.slug} demora={i * 100}>
                <ProjectCard p={p} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
