import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "todo_techos_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHmac("sha256", "compare").update(left).digest();
  const rightHash = createHmac("sha256", "compare").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function hasAdminCredentials() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    hasAdminCredentials() &&
    constantTimeEqual(username, process.env.ADMIN_USERNAME!) &&
    constantTimeEqual(password, process.env.ADMIN_PASSWORD!)
  );
}

function signature(expires: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(expires).digest("hex");
}

export function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { token: `${expires}.${signature(expires)}`, expires, maxAge: SESSION_SECONDS };
}

export function isAdminSessionValid(request: Request) {
  if (!hasAdminCredentials()) return false;
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  const token = cookie?.slice(ADMIN_COOKIE.length + 1);
  if (!token) return false;

  const [expires, providedSignature, ...extra] = token.split(".");
  if (!expires || !providedSignature || extra.length || Number(expires) <= Date.now() / 1000) return false;

  return constantTimeEqual(providedSignature, signature(expires));
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
