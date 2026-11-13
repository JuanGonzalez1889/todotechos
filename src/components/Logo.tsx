import { useState } from "react";

/**
 * Logo provisorio redibujado a partir de la referencia del brief.
 * Reemplazar por el archivo vectorial original cuando el cliente lo entregue.
 */
export function Logo({ tono = "claro", className = "" }: { tono?: "claro" | "oscuro"; className?: string }) {
  const texto = tono === "claro" ? "text-white" : "text-tinta";
  const [logoPersonalizado, setLogoPersonalizado] = useState(true);
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="TODO TECHOS, Construcciones y Metalúrgica">
      {logoPersonalizado && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/api/media/brand.logo"
          alt=""
          onError={() => setLogoPersonalizado(false)}
          className="h-[50px] w-[150px] object-contain"
        />
      )}
      {!logoPersonalizado && (
        <>
          <svg
            viewBox="0 0 150 22"
            className="-mb-[3px] ml-[2px] h-[15px] w-[104px] text-verde-luz"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinejoin="miter"
            aria-hidden
          >
            <path d="M2 20 62 3l26 7.400V4h9v9l28 7" />
          </svg>
          <span className={`font-display text-[1.72rem] font-bold tracking-[0.01em] ${texto} transition-colors duration-300`}>
            TODO TECHOS
          </span>
          <span className="mt-[3px] bg-verde px-[5px] py-[2.500px] font-display text-[0.56rem] font-semibold tracking-[0.13em] text-white">
            CONSTRUCCIONES &amp; METALÚRGICA
          </span>
        </>
      )}
    </span>
  );
}
