import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, ProjectCard } from "@/components/Bloques";
import { Flecha } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { formatSurface, getProject, projects } from "@/content/projects";
import { getService } from "@/content/services";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/obras/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} en ${p.province}`,
    description: p.description,
    alternates: { canonical: `/obras/${p.slug}` },
  };
}

export default async function Obra(props: PageProps<"/obras/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const servicio = getService(p.service);
  // Solo se muestran los datos disponibles, como pide el brief.
  const ficha = [
    ["Ubicación", `${p.city}, ${p.province}`],
    ["Tipo de obra", servicio?.shortTitle],
    ["Alcance", p.scope],
    ["Superficie", p.surface ? formatSurface(p.surface) : undefined],
    ["Año", p.year?.toString()],
    ["Plazo", p.duration],
    ["Cliente", p.client],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  const galeria = p.gallery ?? [{ caption: "Antes" }, { caption: "Durante" }, { caption: "Después" }];
  const otras = projects.filter((o) => o.slug !== p.slug && o.service === p.service).slice(0, 3);
  const mas = otras.length ? otras : projects.filter((o) => o.slug !== p.slug).slice(0, 3);

  return (
    <>
      <PageHero titulo={p.title} bajada={`${p.city}, ${p.province}`} migas={[{ href: "/obras", label: "Obras" }]} />

      <section className="seccion">
        <div className="contenedor grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Reveal modo="descubre" className="corte-techo">
              <Photo slot={`project.${p.slug}`} src={p.image} alt={`${p.title}, ${p.province}`} variant={p.art} className="aspect-[16/10] w-full" priority />
            </Reveal>
            <Reveal className="mt-9">
              <p className="max-w-[60ch] text-[1.25rem] leading-relaxed">{p.description}</p>
            </Reveal>
          </div>

          <Reveal as="aside" demora={150} className="self-start lg:sticky lg:top-24">
            <h2 className="font-display text-[1.75rem] font-bold uppercase leading-none">Ficha de obra</h2>
            <dl className="mt-5 border-t-2 border-tinta">
              {ficha.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-linea py-3.5">
                  <dt className="text-acero">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 grid gap-3">
              <Link href={`/contacto?servicio=${p.service}`} className="btn btn-verde w-full">
                Consultar por una obra similar <Flecha />
              </Link>
              {servicio && (
                <Link href={`/servicios/${servicio.slug}`} className="btn btn-tinta w-full">
                  Ver {servicio.shortTitle.toLowerCase()}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="chapa seccion" aria-labelledby="t-galeria">
        <div className="contenedor">
          <h2 id="t-galeria" className="titulo titulo-barra">
            Galería de la obra
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {galeria.map((g, i) => (
              <Reveal as="li" key={g.caption} demora={i * 120}>
                <figure>
                  <Reveal modo="descubre" demora={i * 120}>
                    <Photo slot={`project.${p.slug}.gallery.${i + 1}`} src={g.src} alt={`${p.title}: ${g.caption.toLowerCase()}`} variant={p.art} className="aspect-[4/3] w-full" sizes="(min-width: 768px) 33vw, 100vw" />
                  </Reveal>
                  <figcaption className="mt-3 font-display text-xl font-semibold uppercase">{g.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion" aria-labelledby="t-mas">
        <div className="contenedor">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 id="t-mas" className="titulo titulo-barra">
              Más obras
            </h2>
            <Link href="/obras" className="enlace shrink-0">
              Ver todas las obras <Flecha />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {mas.map((o, i) => (
              <Reveal key={o.slug} demora={i * 100}>
                <ProjectCard p={o} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
