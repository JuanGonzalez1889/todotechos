import type { Metadata } from "next";
import { PageHero } from "@/components/Bloques";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/privacidad" },
};

/** Texto base. Debe revisarlo y aprobarlo la empresa (y su asesor legal) antes de publicar. */
export default function Privacidad() {
  const bloques = [
    {
      t: "Qué datos pedimos",
      p: "Cuando completás el formulario de contacto nos dejás tu nombre, empresa, teléfono, correo, localidad y la descripción de tu obra, además de los planos o fotos que decidas adjuntar.",
    },
    {
      t: "Para qué los usamos",
      p: "Usamos esos datos únicamente para responder tu consulta y preparar una propuesta. No los vendemos ni los cedemos a terceros.",
    },
    {
      t: "Cuánto tiempo los guardamos",
      p: "Conservamos la consulta el tiempo necesario para atenderla y dar seguimiento comercial. Podés pedir que la eliminemos cuando quieras.",
    },
    {
      t: "Tus derechos",
      p: `Podés acceder a tus datos, corregirlos o pedir que los borremos escribiendo a ${site.contact.email}, conforme a la Ley 25.326 de Protección de Datos Personales.`,
    },
  ];
  return (
    <>
      <PageHero titulo="Política de privacidad" />
      <section className="seccion">
        <div className="contenedor grid max-w-[46rem] gap-9 !mx-auto">
          {bloques.map((b) => (
            <div key={b.t}>
              <h2 className="font-display text-[1.75rem] font-bold uppercase leading-none">{b.t}</h2>
              <p className="mt-3 text-[1.125rem] leading-relaxed text-acero">{b.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
