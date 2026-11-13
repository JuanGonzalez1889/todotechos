import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bloques";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { infrastructure } from "@/content/company";
import { slugForMedia } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Infraestructura",
  description: "Taller metalúrgico, maquinaria, logística y equipo humano de TODO TECHOS.",
  alternates: { canonical: "/infraestructura" },
};

export default function Infraestructura() {
  return (
    <>
      <PageHero
        titulo="Infraestructura"
        bajada="Taller, maquinaria, logística y personal propios para fabricar, trasladar y montar cada obra."
      />
      <section className="seccion">
        <div className="contenedor grid gap-16 md:gap-24">
          {infrastructure.map((r, i) => (
            <article key={r.title} className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
              <Reveal modo="descubre" className={i % 2 ? "corte-techo-inv lg:order-2" : "corte-techo"}>
                <Photo slot={`infra.${slugForMedia(r.title)}`} src={r.image} alt={r.title} variant={r.art} className="aspect-[16/10] w-full" />
              </Reveal>
              <Reveal demora={150}>
                <h2 className="titulo titulo-barra">{r.title}</h2>
                <p className="mt-5 max-w-[46ch] text-[1.1875rem] text-acero">{r.text}</p>
              </Reveal>
            </article>
          ))}
        </div>
      </section>
      <CtaBand titulo="¿Querés conocer nuestra capacidad de obra?" />
    </>
  );
}
