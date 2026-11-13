import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, ProjectCard } from "@/components/Bloques";
import { Check, Flecha, WhatsApp } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/projects";
import { getService, services } from "@/content/services";
import { whatsappUrl } from "@/content/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: { canonical: `/servicios/${s.slug}` } };
}

export default async function Servicio(props: PageProps<"/servicios/[slug]">) {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) notFound();

  const obras = projects.filter((p) => p.service === s.slug).slice(0, 3);
  const otros = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero titulo={s.title} bajada={s.summary} migas={[{ href: "/servicios", label: "Servicios" }]} />

      <section className="seccion">
        <div className="contenedor grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Reveal modo="descubre" className="corte-techo">
              <Photo slot={`service.${s.slug}`} src={s.image} alt={s.title} variant={s.art} className="aspect-[16/10] w-full" priority />
            </Reveal>
            <Reveal className="mt-10">
              <h2 className="titulo titulo-barra !text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">En qué consiste</h2>
              <p className="mt-5 max-w-[60ch] text-[1.1875rem] leading-relaxed">{s.description}</p>
            </Reveal>
          </div>

          <Reveal as="aside" demora={150} className="chapa self-start p-7 md:p-9 lg:sticky lg:top-24">
            <h2 className="font-display text-[1.75rem] font-bold uppercase leading-none">Alcances</h2>
            <ul className="mt-5 grid gap-3">
              {s.scope.map((a) => (
                <li key={a} className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-verde" width={22} height={22} />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href={`/contacto?servicio=${s.slug}`} className="btn btn-verde w-full">
                Consultar por este servicio <Flecha />
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-tinta w-full">
                <WhatsApp width={20} height={20} /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {obras.length > 0 && (
        <section className="seccion !pt-0" aria-labelledby="t-rel">
          <div className="contenedor">
            <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 id="t-rel" className="titulo titulo-barra">
                Obras relacionadas
              </h2>
              <Link href={`/obras?servicio=${s.slug}`} className="enlace shrink-0">
                Ver todas <Flecha />
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {obras.map((p, i) => (
                <Reveal key={p.slug} demora={i * 100}>
                  <ProjectCard p={p} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-linea py-12" aria-label="Otros servicios">
        <div className="contenedor flex flex-wrap items-center gap-x-8 gap-y-3">
          <p className="font-display text-xl font-semibold uppercase text-acero">Otros servicios</p>
          {otros.map((o) => (
            <Link key={o.slug} href={`/servicios/${o.slug}`} className="enlace !text-tinta">
              {o.shortTitle}
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
