import type { Metadata } from "next";
import { PageHero } from "@/components/Bloques";
import { ContactForm } from "@/components/ContactForm";
import { Correo, Instagram, Pin, Telefono, WhatsApp } from "@/components/Icons";
import { services } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto y presupuestos",
  description: "Pedí una cotización para tu obra industrial o civil. Formulario, WhatsApp, teléfono y ubicación de TODO TECHOS.",
  alternates: { canonical: "/contacto" },
};

export default function Contacto() {
  const c = site.contact;
  const fila = "group flex items-center gap-4 border-b border-linea py-4 transition-colors hover:text-verde";
  const icono = "grid h-12 w-12 shrink-0 place-items-center bg-chapa text-verde transition-colors group-hover:bg-verde group-hover:text-white";

  return (
    <>
      <PageHero titulo="Contacto" bajada="Contanos qué necesitás construir. Analizamos tu caso y te respondemos con una propuesta." />

      <section className="seccion">
        <div className="contenedor grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <div>
            <h2 className="titulo titulo-barra !text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)]">Solicitar cotización</h2>
            <p className="bajada mb-8 mt-4">Completá los datos de la obra. Cuanto más detalle, mejor podemos orientarte.</p>
            <ContactForm servicios={services.map((s) => ({ value: s.slug, label: s.title }))} />
          </div>

          <aside className="self-start lg:sticky lg:top-24">
            <h2 className="font-display text-[1.75rem] font-bold uppercase leading-none">Contacto directo</h2>
            <ul className="mt-4 border-t-2 border-tinta">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={fila}>
                  <span className={icono}><WhatsApp /></span>
                  <span>
                    <span className="block text-sm text-acero">WhatsApp</span>
                    <span className="font-medium">Escribinos ahora</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={c.phoneHref} className={fila}>
                  <span className={icono}><Telefono /></span>
                  <span>
                    <span className="block text-sm text-acero">Teléfono</span>
                    <span className="font-medium">{c.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${c.email}`} className={fila}>
                  <span className={icono}><Correo /></span>
                  <span>
                    <span className="block text-sm text-acero">Correo</span>
                    <span className="break-all font-medium">{c.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className={fila}>
                  <span className={icono}><Pin /></span>
                  <span>
                    <span className="block text-sm text-acero">Ubicación</span>
                    <span className="font-medium">{c.address}, {c.province}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className={fila}>
                  <span className={icono}><Instagram /></span>
                  <span>
                    <span className="block text-sm text-acero">Instagram</span>
                    <span className="font-medium">{c.instagramHandle}</span>
                  </span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section aria-label="Mapa de ubicación" className="relative h-[420px] bg-chapa">
        <iframe
          title={`Mapa: ${c.address}, ${c.province}`}
          src={c.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[0.35]"
        />
      </section>
    </>
  );
}
