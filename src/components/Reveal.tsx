"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** "aparece" = sube suave · "descubre" = la foto se corre como una chapa */
  modo?: "aparece" | "descubre";
  demora?: number;
  className?: string;
};

export function Reveal({ children, as: Tag = "div", modo = "aparece", demora = 0, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // "descubre" recorta un hijo interno: así el observador mide la caja completa
  // y el recorte no pisa otros clip-path del contenedor (corte-techo).
  if (modo === "descubre") {
    return (
      <Tag ref={ref} className={`descubre-caja ${className}`} style={{ "--demora": `${demora}ms` } as CSSProperties}>
        <div className="descubre">{children}</div>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`aparece ${className}`} style={{ "--demora": `${demora}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
