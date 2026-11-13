"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Flecha } from "./Icons";
import { Photo, type ArtVariant } from "./Photo";
import { slugForMedia } from "@/lib/slug";

/** Número que cuenta hasta su valor cuando entra en pantalla. */
export function Contador({ valor, prefijo = "", sufijo = "" }: { valor: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const dur = 1600;
        const paso = (t: number) => {
          const p = Math.min(1, (t - inicio) / dur);
          setN(Math.round(valor * (1 - Math.pow(1 - p, 4))));
          if (p < 1) raf = requestAnimationFrame(paso);
        };
        setN(0);
        raf = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefijo}
      {n}
      {sufijo}
    </span>
  );
}

/** Carrusel con desplazamiento táctil y flechas. */
export function Carril({ children, etiqueta }: { children: ReactNode; etiqueta: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [borde, setBorde] = useState({ inicio: true, fin: false });

  const medir = () => {
    const el = ref.current;
    if (!el) return;
    setBorde({ inicio: el.scrollLeft < 8, fin: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const mover = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const tarjeta = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((tarjeta?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  const boton =
    "grid h-12 w-12 place-items-center border-2 border-tinta text-tinta transition-colors hover:bg-tinta hover:text-white disabled:pointer-events-none disabled:opacity-25";

  return (
    <div role="group" aria-label={etiqueta}>
      <div ref={ref} onScroll={medir} className="carril" tabIndex={0}>
        {children}
      </div>
      <div className="contenedor mt-7 flex gap-2.5">
        <button type="button" className={boton} onClick={() => mover(-1)} disabled={borde.inicio} aria-label="Obras anteriores">
          <Flecha className="rotate-180" />
        </button>
        <button type="button" className={boton} onClick={() => mover(1)} disabled={borde.fin} aria-label="Obras siguientes">
          <Flecha />
        </button>
      </div>
    </div>
  );
}

/** Lista de recursos: al elegir uno, la foto se corre como una chapa. */
export function Recursos({ items }: { items: { title: string; text: string; art: ArtVariant; image?: string }[] }) {
  const [activo, setActivo] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
      <ul className="border-t border-white/15">
        {items.map((item, i) => {
          const on = i === activo;
          return (
            <li key={item.title} className="border-b border-white/15">
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => setActivo(i)}
                onFocus={() => setActivo(i)}
                onClick={() => setActivo(i)}
                className="group relative grid w-full grid-cols-[1fr_auto] items-center gap-x-4 py-5 pl-5 text-left"
              >
                <span
                  aria-hidden
                  className={`absolute bottom-3 left-0 top-3 w-[5px] origin-bottom -skew-x-[14deg] bg-verde-luz transition-transform duration-500 ease-[var(--ease-obra)] ${
                    on ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span className={`font-display text-[1.75rem] font-bold uppercase leading-none transition-colors md:text-[2.125rem] ${on ? "text-white" : "text-white/55"}`}>
                  {item.title}
                </span>
                <Flecha className={`transition-[opacity,transform] duration-300 ${on ? "text-verde-luz opacity-100" : "-translate-x-2 opacity-0"}`} />
                <span
                  className={`col-span-2 grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-obra)] ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="block max-w-[44ch] pt-2 text-white/75">{item.text}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="corte-techo relative aspect-[4/3]">
        {items.map((item, i) => (
          <div
            key={item.title}
            aria-hidden={i !== activo}
            className="absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-obra)]"
            style={{ clipPath: i === activo ? "inset(0 0 0 0)" : "inset(0 0 0 100%)", zIndex: i === activo ? 2 : 1 }}
          >
            <Photo slot={`infra.${slugForMedia(item.title)}`} src={item.image} alt={item.title} variant={item.art} className="h-full w-full" sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
