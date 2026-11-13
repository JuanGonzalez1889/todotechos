import { NextResponse } from "next/server";

const MAX_ARCHIVOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const FORMATOS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".dwg"];

/**
 * Recibe la consulta del formulario.
 * PENDIENTE (segunda etapa): enviar el correo al buzón corporativo
 * (Resend / SMTP) y guardar la consulta. Hoy valida y registra en el log
 * del servidor, sin enviar nada.
 */
export async function POST(request: Request) {
  let datos: FormData;
  try {
    datos = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Formato inválido" }, { status: 400 });
  }

  // Campo trampa: si viene completo es un bot. Respondemos ok sin procesar.
  if (String(datos.get("sitio") ?? "")) return NextResponse.json({ ok: true });

  const txt = (k: string) => String(datos.get(k) ?? "").trim().slice(0, 4000);
  const consulta = {
    nombre: txt("nombre"),
    empresa: txt("empresa"),
    telefono: txt("telefono"),
    email: txt("email"),
    localidad: txt("localidad"),
    servicio: txt("servicio"),
    descripcion: txt("descripcion"),
    superficie: txt("superficie"),
  };

  const faltan =
    consulta.nombre.length < 3 ||
    consulta.telefono.replace(/\D/g, "").length < 8 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consulta.email) ||
    !consulta.localidad ||
    !consulta.servicio ||
    consulta.descripcion.length < 15 ||
    !datos.get("privacidad");
  if (faltan) return NextResponse.json({ ok: false, error: "Datos incompletos" }, { status: 422 });

  const archivos = datos.getAll("archivos").filter((a): a is File => a instanceof File && a.size > 0);
  const archivoInvalido =
    archivos.length > MAX_ARCHIVOS ||
    archivos.some((a) => a.size > MAX_BYTES || !FORMATOS.some((x) => a.name.toLowerCase().endsWith(x)));
  if (archivoInvalido) return NextResponse.json({ ok: false, error: "Archivos no permitidos" }, { status: 422 });

  console.info("[contacto] nueva consulta", {
    ...consulta,
    archivos: archivos.map((a) => `${a.name} (${Math.round(a.size / 1024)} KB)`),
  });

  return NextResponse.json({ ok: true });
}
