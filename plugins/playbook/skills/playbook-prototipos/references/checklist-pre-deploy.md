# Checklist pre-deploy (semáforo)

❌ bloquea el push · ⚠️ revisar antes de publicar · ✅ correcto · ℹ️ informativo

| # | Punto | Cómo se verifica | Si falla |
|---|---|---|---|
| 1 | Sin secretos en el repo | `node scripts/escanear-secretos.mjs --todo` | ❌ |
| 2 | Build de producción | `npm run build` sin errores | ❌ |
| 3 | Sin secretos en el bundle | `node scripts/escanear-secretos.mjs --ruta dist` | ❌ |
| 4 | Datos sintéticos | Advertencias del escáner (RFC, CURP, correos reales, términos sensibles) | ⚠️ cada advertencia se confirma o se corrige |
| 5 | `netlify.toml` correcto | Existe, `publish` apunta a la carpeta real del build y tiene `X-Robots-Tag` | ❌ |
| 6 | Control de acceso | Existe `netlify/edge-functions/acceso.ts`; estado actual con `curl` (401 = activo, 200 = inactivo) | ℹ️ Paco decide si va activo |
| 7 | Repo privado | `gh repo view --json visibility` (si `gh` está instalado); si no, pedir confirmación | ❌ si es público |
| 8 | Dependencias | `npm audit --omit=dev` resumido; las heredadas de Angular 16 se marcan como conocidas | ℹ️ |
| 9 | Git limpio | `git status` sin cambios pendientes; último commit con mensaje claro | ⚠️ |
| 10 | Brief cumplido | Criterios de aceptación del brief vigente marcados | ⚠️ |

Formato del resultado: tabla con los 10 puntos y su semáforo, seguida de una línea de veredicto:
"Listo para push" o "No hagas push todavía: <punto> — <qué hacer>".
