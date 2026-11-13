import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, hasAdminCredentials, isSameOrigin, validateAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!hasAdminCredentials()) {
    return NextResponse.json({ error: "Falta configurar el acceso al panel en las variables de entorno." }, { status: 503 });
  }

  let credentials: { username?: unknown; password?: unknown };
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const username = typeof credentials.username === "string" ? credentials.username : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const session = createAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
    expires: new Date(Number(session.expires) * 1000),
  });
  return response;
}
