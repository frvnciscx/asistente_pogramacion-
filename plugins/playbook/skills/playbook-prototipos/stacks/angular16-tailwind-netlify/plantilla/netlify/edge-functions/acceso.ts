// =============================================================================
// Control de acceso del prototipo — Netlify Edge Function (plan gratuito)
// -----------------------------------------------------------------------------
// Pide usuario y contraseña ANTES de entregar cualquier archivo del sitio
// (HTML, JS, mocks). Por eso sí protege, a diferencia de un login en Angular.
//
// Se controla con variables de entorno en Netlify (nunca en el repo):
//   ACCESO_ACTIVO   = "true" | "false"        → encender / apagar
//   ACCESO_USUARIOS = "ana:clave1,luis:clave2" → un usuario por persona
//
// Después de cambiar una variable, haz un redeploy para asegurar que aplique.
// Cada visita consume créditos de edge functions del plan Free: mídelo en el piloto.
// =============================================================================

declare const Netlify: { env: { get(nombre: string): string | undefined } };

function igualSeguro(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferencia === 0;
}

const SIN_INDEXAR = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const activo = (Netlify.env.get("ACCESO_ACTIVO") ?? "false").trim().toLowerCase() === "true";
  if (!activo) return context.next();

  const usuarios = (Netlify.env.get("ACCESO_USUARIOS") ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u.includes(":"));

  if (usuarios.length === 0) {
    return new Response("Acceso activado, pero no hay usuarios configurados.", {
      status: 503,
      headers: SIN_INDEXAR,
    });
  }

  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    let credencial = "";
    try {
      credencial = atob(auth.slice(6).trim());
    } catch {
      credencial = "";
    }
    if (usuarios.some((u) => igualSeguro(u, credencial))) return context.next();
  }

  return new Response("Acceso restringido.", {
    status: 401,
    headers: { ...SIN_INDEXAR, "WWW-Authenticate": 'Basic realm="Prototipo", charset="UTF-8"' },
  });
};

export const config = { path: "/*" };
