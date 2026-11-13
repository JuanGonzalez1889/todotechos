"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type ArtVariant = "nave" | "estructura" | "civil" | "suelo" | "techo" | "demolicion" | "taller" | "equipo";

/* Dibujos a línea que ocupan el lugar de cada foto hasta que llegue la real. */
const art: Record<ArtVariant, string[]> = {
  nave: [
    "M0 250h400",
    "M50 250V150l110-55 110 55v100",
    "M270 150l90-22v122",
    "M160 95l90-22 110 55",
    "M95 250v-70h60v70",
    "M300 250V143M330 250V136",
    "M50 175h220M50 200h40M160 200h110",
  ],
  estructura: [
    "M0 255h400",
    "M40 255V150M360 255V150",
    "M40 150h320",
    "M40 150 200 70l160 80",
    "M120 150V110M200 150V70M280 150V110",
    "M40 150l80-40 80 40 80-40 80 40",
    "M40 205h-14M360 205h14",
  ],
  civil: [
    "M0 250h400",
    "M40 250V120h320v130",
    "M40 152h320M40 184h320M40 216h320",
    "M100 120v32M180 120v32M260 120v32M320 120v32",
    "M70 152v32M140 152v32M220 152v32M290 152v32",
    "M100 184v32M180 184v32M260 184v32M320 184v32",
    "M70 216v34M140 216v34M220 216v34M290 216v34",
    "M60 120V84M120 120V72M200 120V84M280 120V72M340 120V84",
  ],
  suelo: [
    "M0 250h400",
    "M0 215c60-8 90-34 150-34s80 22 130 22 80-18 120-18",
    "M0 180c50-6 80-40 150-40s90 26 140 26 70-24 110-24",
    "M0 145c40-4 90-44 150-44s100 30 150 30 60-28 100-28",
    "M250 96l36-46 30 30",
    "M286 50l52-14",
    "M230 131h76v-35h-56z",
  ],
  techo: [
    "M30 220 130 70h250L280 220z",
    "M72 220 172 70M114 220 214 70M156 220 256 70M198 220 298 70M240 220 340 70",
    "M30 220v24h250v-24",
    "M280 244l100-150V70",
    "M0 268h400",
  ],
  demolicion: [
    "M0 250h400",
    "M50 250V130h90",
    "M170 130h60v40",
    "M50 170h70M50 210h110",
    "M250 250v-60l34-16",
    "M300 60l44 44-34 34-44-44z",
    "M283 121l-58 58",
    "M150 250l14-22 20 10 16-26 22 38",
  ],
  taller: [
    "M0 250h400",
    "M40 250V110l64 34v-34l64 34v-34l64 34v-34l64 34V80h64v170",
    "M80 250v-50h60v50",
    "M180 200h50v24h-50zM260 200h50v24h-50z",
    "M318 80V50h28v30",
  ],
  equipo: [
    "M0 250h400",
    "M120 250V60h36v190",
    "M120 100l36-40M120 140l36-40M120 180l36-40M120 220l36-40M120 250l36-30",
    "M60 60h300",
    "M138 28 60 60M138 28l222 32M138 28v32",
    "M320 60v70",
    "M306 130h28v26h-28z",
    "M90 250h96",
  ],
};

type Props = {
  src?: string;
  slot?: string;
  fit?: "cover" | "contain";
  alt: string;
  variant?: ArtVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** clase extra para el elemento interno (zoom en hover, etc.) */
  innerClassName?: string;
  rotulo?: boolean;
};

export function Photo({
  src,
  slot,
  fit = "cover",
  alt,
  variant = "nave",
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  innerClassName = "",
  rotulo = true,
}: Props) {
  const imageSrc = slot ? `/api/media/${encodeURIComponent(slot)}` : src;
  const [failedSource, setFailedSource] = useState("");
  const [fitMode, setFitMode] = useState<"cover" | "contain">(fit);

  useEffect(() => {
    if (!slot) return;
    let active = true;
    fetch(`/api/media/${encodeURIComponent(slot)}?metadata=1`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Ajuste de imagen: HTTP ${response.status}`);
        return response.json() as Promise<{ fitMode: "cover" | "contain" }>;
      })
      .then((data) => {
        if (active && (data.fitMode === "cover" || data.fitMode === "contain")) {
          setFitMode(data.fitMode);
        }
      })
      .catch((error: unknown) => {
        if (active) console.error(`[Photo] No se pudo leer el ajuste de ${slot}.`, error);
      });
    return () => {
      active = false;
    };
  }, [slot]);

  return (
    <div className={`relative overflow-hidden ${fitMode === "contain" ? "bg-white" : "bg-[#232b2f]"} ${className}`}>
      {imageSrc && failedSource !== imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={imageSrc.startsWith("/api/media/")}
          onError={() => setFailedSource(imageSrc)}
          style={{ objectFit: fitMode }}
          className={innerClassName}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 ${innerClassName}`}
          style={{
            background:
              "radial-gradient(120% 90% at 78% 8%, #46535a 0%, #2a3338 45%, #1a2125 100%)",
          }}
        >
          <svg
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full text-white/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden
          >
            {art[variant].map((d) => (
              <path key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          {rotulo && (
            <span className="absolute right-3 top-3 bg-black/35 px-2 py-1 text-[0.6875rem] font-medium tracking-wide text-white/75">
              Foto pendiente
            </span>
          )}
        </div>
      )}
    </div>
  );
}
