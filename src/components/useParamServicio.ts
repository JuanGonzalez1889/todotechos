"use client";

import { useSyncExternalStore } from "react";

const sinCambios = () => () => {};

/** Lee ?servicio= de la URL (p. ej. /obras?servicio=naves-industriales) sin romper el prerender. */
export function useParamServicio(validos: { value: string }[]) {
  const param = useSyncExternalStore(
    sinCambios,
    () => new URLSearchParams(window.location.search).get("servicio"),
    () => null,
  );
  return param && validos.some((o) => o.value === param) ? param : null;
}
