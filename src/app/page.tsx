import Link from "next/link";
import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { Flecha, ServicioIcono } from "@/components/Icons";
import { Carril, Contador, Recursos } from "@/components/Interactivos";
import { ClientsMarquee, CtaBand, ProjectCard } from "@/components/Bloques";
import { indicators, site } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { infrastructure } from "@/content/company";

export default function Inicio() {
  const destacados = services.filter((s) => s.featured);
  const obras = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Hero />

      {/* 03 · Servicios principales */}
      <section className="seccion" aria-labelledby="t-servicios">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-servicios" className="titulo titulo-barra">
                Qué hacemos
              </h2>
              <p className="bajada mt-4">
                Cinco especialidades que se combinan en una misma obra: preparamos el suelo, levantamos la estructura y
                la cerramos.
              </p>
            </div>
            <Link href="/servicios" className="enlace shrink-0">
              Todos los servicios <Flecha />
            </Link>
          </Reveal>

          {/* Escritorio: paneles que se abren. Celular: tarjetas apiladas. */}
          <Reveal demora={120} className="mt-10 flex flex-col gap-3 lg:h-[520px] lg:flex-row lg:gap-2">
            {destacados.map((s) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="servicio-card group relative block min-h-[150px] overflow-hidden text-white transition-[flex-grow] duration-700 ease-[var(--ease-obra)] lg:min-h-0 lg:flex-1 lg:hover:flex-[2.4] lg:focus-visible:flex-[2.4]"
                style={{ "--corte": "2.4rem" } as CSSProperties}
              >
                <Photo
                  src={s.image}
                  slot={`service.${s.slug}`}
                  alt=""
                  variant={s.art}
                  rotulo={false}
                  className="!absolute inset-0"
                  innerClassName="servicio-foto"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="servicio-panel absolute inset-x-0 bottom-0 hidden h-[62%] bg-verde lg:block" />
                <div className="relative flex h-full flex-col justify-end p-5 lg:p-6">
                  <ServicioIcono slug={s.slug} width={40} height={40} className="mb-3 text-verde-luz transition-colors duration-300 lg:group-hover:text-white" />
                  <h3 className="font-display text-[1.75rem] font-bold uppercase leading-none lg:text-[1.875rem]">
                    {s.shortTitle}
                  </h3>
                  <div className="grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-obra)] lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-visible:grid-rows-[1fr] lg:group-focus-visible:opacity-100">
                    <div className="overflow-hidden">
                      <p className="mt-2.5 max-w-[36ch] text-[0.9875rem] leading-snug text-white/90 lg:w-[19rem]">{s.summary}</p>
                    </div>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide">
                    Ver servicio <Flecha />
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 · Quiénes somos */}
      <section className="seccion !pt-0" aria-labelledby="t-quienes">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 id="t-quienes" className="titulo titulo-barra">
              Quiénes somos
            </h2>
            <p className="mt-6 max-w-[54ch] text-[1.1875rem] leading-relaxed">{site.about.intro}</p>
            <p className="mt-4 max-w-[54ch] text-acero">
              Trabajamos con taller y equipos propios, y acompañamos cada obra desde el primer movimiento de suelo hasta
              la entrega.
            </p>
            <Link href="/empresa" className="btn btn-tinta mt-8">
              Conocer la empresa <Flecha />
            </Link>
          </Reveal>
          <div className="relative">
            <Reveal modo="descubre" className="corte-techo">
              <Photo slot="home.about" fit="contain" alt="Obra de TODO TECHOS" variant="estructura" className="aspect-[5/4] w-full" />
            </Reveal>
            <Reveal demora={350} className="absolute -bottom-6 -left-3 bg-verde px-6 py-4 text-white shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] sm:-left-8 [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]">
              <p className="display text-[3.5rem]">+60</p>
              <p className="font-display text-lg font-semibold uppercase leading-none tracking-wide">años en obra</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 · Indicadores de capacidad */}
      <section className="chapa mt-6" aria-label="Capacidad de la empresa">
        <div className="contenedor">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {indicators.map((ind, i) => (
              <Reveal as="li" key={ind.label} demora={i * 90} className="border-tinta/12 px-1 py-8 sm:px-6 md:py-11 lg:border-l lg:first:border-l-0 [&:nth-child(even)]:border-l [&:nth-child(even)]:pl-5 max-lg:[&:nth-child(n+3)]:border-t">
                <p className="display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-verde-hondo">
                  {"value" in ind ? <Contador valor={ind.value} prefijo={ind.prefix} sufijo={ind.suffix} /> : ind.text}
                </p>
                <p className="mt-2 max-w-[22ch] text-[0.9875rem] leading-snug text-acero">{ind.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 06 · Obras destacadas */}
      <section className="seccion overflow-hidden" aria-labelledby="t-obras">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-obras" className="titulo titulo-barra">
                Obras destacadas
              </h2>
              <p className="bajada mt-4">Naves, estructuras, cubiertas y obra civil ejecutadas en el norte argentino.</p>
            </div>
            <Link href="/obras" className="enlace shrink-0">
              Ver todas las obras <Flecha />
            </Link>
          </Reveal>
        </div>
        <Reveal demora={120} className="mt-10">
          <Carril etiqueta="Obras destacadas">
            {obras.map((p) => (
              <ProjectCard
                key={p.slug}
                p={p}
                className="w-[82vw] sm:w-[25rem]"
                sizes="(min-width: 640px) 400px, 82vw"
              />
            ))}
          </Carril>
        </Reveal>
      </section>

      {/* 07 · Infraestructura y equipo */}
      <section className="sobre-oscuro seccion bg-tinta text-white" aria-labelledby="t-infra">
        <div className="contenedor">
          <Reveal className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-infra" className="titulo titulo-barra">
                Infraestructura y equipo
              </h2>
              <p className="bajada mt-4 !text-white/70">
                Los recursos con los que fabricamos, trasladamos y montamos cada estructura.
              </p>
            </div>
            <Link href="/infraestructura" className="enlace shrink-0">
              Ver infraestructura <Flecha />
            </Link>
          </Reveal>
          <Reveal demora={100}>
            <Recursos items={infrastructure} />
          </Reveal>
        </div>
      </section>

      {/* 08 · Empresas que confían en nosotros */}
      <section className="seccion bg-chapa-clara" aria-labelledby="t-clientes">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 id="t-clientes" className="titulo titulo-barra max-w-[18ch]">
              Empresas que confían en nosotros
            </h2>
            <Link href="/clientes" className="enlace shrink-0">
              Ver clientes y obras <Flecha />
            </Link>
          </Reveal>
        </div>
        <Reveal demora={120} className="mt-10">
          <ClientsMarquee />
        </Reveal>
      </section>

      {/* 09 · Llamado a la acción */}
      <CtaBand />
    </>
  );
}
