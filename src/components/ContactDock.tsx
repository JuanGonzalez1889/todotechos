"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappUrl } from "@/content/site";
import { Correo, Telefono, WhatsApp } from "./Icons";

/** Escritorio: botón flotante de WhatsApp. Celular: barra inferior de contacto a una mano. */
export function ContactDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        className={`group fixed bottom-6 right-6 z-40 hidden h-14 items-center bg-[#1faa59] text-white shadow-[0_12px_30px_-10px_rgb(0_0_0/0.5)] transition-[opacity,transform] duration-500 ease-[var(--ease-obra)] md:flex ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center">
          <WhatsApp width={28} height={28} />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-lg font-semibold uppercase tracking-wide transition-[max-width,padding] duration-500 ease-[var(--ease-obra)] group-hover:max-w-56 group-hover:pr-5 group-focus-visible:max-w-56 group-focus-visible:pr-5">
          Escribinos
        </span>
      </a>

      <nav
        aria-label="Contacto rápido"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-verde-hondo pb-[env(safe-area-inset-bottom)] text-white md:hidden"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-medium active:bg-white/10">
          <WhatsApp width={22} height={22} className="text-verde-luz" /> WhatsApp
        </a>
        <a href={site.contact.phoneHref} className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 border-x border-white/10 text-[0.8125rem] font-medium active:bg-white/10">
          <Telefono width={22} height={22} className="text-verde-luz" /> Llamar
        </a>
        <Link href="/contacto" className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-medium active:bg-white/10">
          <Correo width={22} height={22} className="text-verde-luz" /> Cotizar
        </Link>
      </nav>
    </>
  );
}
