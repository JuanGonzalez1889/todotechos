"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

type MediaSlot = {
  key: string;
  section: string;
  label: string;
  fallback: string | null;
  uploaded: boolean;
  fitMode: "cover" | "contain";
  contentType: string | null;
  byteSize: number | null;
  updatedAt: string | null;
};

const formatSize = (size: number | null) =>
  size === null ? "" : size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [slots, setSlots] = useState<MediaSlot[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);

  const loadSlots = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
      if (!response.ok) {
        setMessage(result.error || "No se pudieron cargar las imágenes.");
        return;
      }
      setMessage("");
      setSlots(result.slots as MediaSlot[]);
    } catch {
      setAuthenticated(false);
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSlots(), 0);
    return () => window.clearTimeout(timer);
  }, [loadSlots]);

  const filteredSlots = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    if (!query) return slots;
    return slots.filter((slot) => `${slot.section} ${slot.label} ${slot.key}`.toLocaleLowerCase("es").includes(query));
  }, [search, slots]);

  const groups = useMemo(
    () =>
      filteredSlots.reduce<Record<string, MediaSlot[]>>((result, slot) => {
        (result[slot.section] ??= []).push(slot);
        return result;
      }, {}),
    [filteredSlots],
  );

  async function logIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "No se pudo iniciar sesión.");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      await loadSlots();
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(slot: MediaSlot, file: File) {
    setBusyKey(slot.key);
    setMessage("");
    try {
      const form = new FormData();
      form.set("key", slot.key);
      form.set("file", file);
      form.set("fitMode", slot.fitMode);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo guardar ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se actualizó “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function changeFit(slot: MediaSlot, fitMode: "cover" | "contain") {
    setBusyKey(slot.key);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: slot.key, fitMode }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo cambiar el ajuste de ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se actualizó el ajuste de “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function restore(slot: MediaSlot) {
    if (!window.confirm(`¿Querés restaurar la imagen original de “${slot.label}”?`)) return;
    setBusyKey(slot.key);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: slot.key }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo restaurar ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se restauró “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function logOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setSlots([]);
  }

  if (authenticated === null) {
    return <div className="grid min-h-dvh place-items-center px-6 text-acero">Cargando panel…</div>;
  }

  if (!authenticated) {
    return (
      <main id="contenido" className="grid min-h-dvh place-items-center bg-chapa-clara px-5 py-12">
        <form onSubmit={logIn} className="w-full max-w-md border border-linea bg-white p-7 shadow-lg sm:p-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-verde">TODO TECHOS</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">Panel de imágenes</h1>
          <p className="mt-3 text-acero">Ingresá con la cuenta de administrador para actualizar las imágenes del sitio.</p>
          <label className="mt-7 block text-sm font-semibold" htmlFor="admin-user">Usuario</label>
          <input
            id="admin-user"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1.5 min-h-12 w-full border border-linea px-3 outline-none focus:border-verde"
          />
          <label className="mt-4 block text-sm font-semibold" htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 min-h-12 w-full border border-linea px-3 outline-none focus:border-verde"
          />
          {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
          <button type="submit" disabled={loading} className="btn btn-verde mt-6 w-full disabled:opacity-60">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-chapa-clara">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-verde">TODO TECHOS</p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase sm:text-4xl">Imágenes del sitio</h1>
          </div>
          <button onClick={logOut} className="shrink-0 border border-linea px-4 py-2 text-sm font-semibold hover:border-verde hover:text-verde">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="max-w-3xl text-acero">
          Elegí una sección, buscá la imagen y subí una nueva. Se aceptan JPG, PNG y WebP de hasta 8 MB.
          Si restaurás la original, vuelve a mostrarse la imagen del proyecto o la ilustración provisoria.
        </p>
        <label className="mt-6 block max-w-xl">
          <span className="sr-only">Buscar imagen</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por sección o nombre…"
            className="min-h-12 w-full border border-linea bg-white px-4 outline-none focus:border-verde"
          />
        </label>

        {message && (
          <p role="status" className={`mt-5 border px-4 py-3 text-sm ${message.includes("No se pudo") || message.includes("MySQL") ? "border-red-300 bg-red-50 text-red-800" : "border-verde/30 bg-verde/5 text-verde"}`}>
            {message}
          </p>
        )}

        {Object.entries(groups).map(([section, sectionSlots]) => (
          <section key={section} className="mt-10" aria-labelledby={`section-${section}`}>
            <h2 id={`section-${section}`} className="font-display text-2xl font-bold uppercase">{section}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectionSlots.map((slot) => (
                <li key={slot.key} className="flex flex-col border border-linea bg-white p-4">
                  <div className="flex min-h-36 items-center justify-center overflow-hidden bg-chapa-clara p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={`${slot.key}-${revision}`}
                      src={`/api/media/${encodeURIComponent(slot.key)}?v=${revision}`}
                      alt={`Vista previa: ${slot.label}`}
                      onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                      className="max-h-32 max-w-full object-contain"
                    />
                    {!slot.uploaded && <span className="absolute sr-only">Sin imagen personalizada</span>}
                  </div>
                  <h3 className="mt-4 font-semibold">{slot.label}</h3>
                  <p className="mt-1 text-xs text-acero">{slot.uploaded ? `Personalizada · ${formatSize(slot.byteSize)}` : slot.fallback ? "Imagen actual del sitio" : "Ilustración provisoria"}</p>
                  <label className="mt-4 block text-sm font-medium">
                    Cómo se muestra en el sitio
                    <select
                      value={slot.fitMode}
                      disabled={!slot.uploaded || busyKey === slot.key}
                      onChange={(event) => void changeFit(slot, event.currentTarget.value === "contain" ? "contain" : "cover")}
                      className="mt-1.5 min-h-10 w-full border border-linea bg-white px-2 disabled:bg-chapa-clara disabled:text-acero"
                    >
                      <option value="cover">Recortar para llenar el marco</option>
                      <option value="contain">Mostrar la imagen completa</option>
                    </select>
                  </label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <label className={`btn btn-verde min-h-10 cursor-pointer px-3 py-2 text-sm ${busyKey === slot.key ? "pointer-events-none opacity-60" : ""}`}>
                      {busyKey === slot.key ? "Guardando…" : "Cambiar imagen"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={busyKey === slot.key}
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          event.currentTarget.value = "";
                          if (file) void upload(slot, file);
                        }}
                      />
                    </label>
                    {slot.uploaded && (
                      <button
                        type="button"
                        disabled={busyKey === slot.key}
                        onClick={() => void restore(slot)}
                        className="min-h-10 border border-linea px-3 py-2 text-sm font-semibold hover:border-verde hover:text-verde disabled:opacity-60"
                      >
                        Restaurar original
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {slots.length === 0 && !message && <p className="mt-8 text-acero">No hay ubicaciones de imágenes para mostrar.</p>}
      </main>
    </div>
  );
}
