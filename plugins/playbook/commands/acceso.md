---
description: Encender, apagar o revisar el control de acceso
argument-hint: on | off | estado | usuarios | rotar
---

Gestiona el control de acceso del sitio (Edge Function `netlify/edge-functions/acceso.ts`).
Acción: $ARGUMENTS (si está vacío, usa `estado`).

Reglas: las contraseñas nunca pasan por ti. No las pidas, no las generes en tu salida, no las escribas
en archivos. Paco las teclea en Netlify o en su propia terminal.

Antes de cualquier acción, confirma que el proyecto tiene `netlify/edge-functions/acceso.ts`; si no,
ofrece aplicarlo con `/playbook:nuevo-prototipo adoptar`. Lee la "URL Netlify" del `CLAUDE.md`.

- **estado**: `curl -s -o /dev/null -w "%{http_code}" <URL>/` → `401` activo, `200` inactivo, `503` activo sin usuarios.
- **on**:
  1. Verifica que existan usuarios (pregunta a Paco si ya configuró `ACCESO_USUARIOS`; no leas su valor).
     Si no, ejecuta primero la acción `usuarios`.
  2. Si la CLI de Netlify está enlazada (`netlify status`): `netlify env:set ACCESO_ACTIVO true`.
     Si no, indica la ruta en el panel: Site configuration → Environment variables.
  3. Pide a Paco hacer redeploy (Deploys → Trigger deploy) y luego verifica con `estado`.
- **off**: igual que `on` con `false`. Verifica que responda `200`.
- **usuarios**: explica el formato `usuario:clave,usuario2:clave2` (un usuario por persona, sin comas en las claves).
  Paco lo captura en el panel de Netlify o con `netlify env:set ACCESO_USUARIOS "<valor>"` en **su** terminal.
  Para una clave aleatoria, que corra él: `node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))"`.
- **rotar**: igual que `usuarios`, reemplazando la clave de quien corresponda; después redeploy y `estado`.

Al terminar, recuerda en una línea: el link y la clave se comparten por canales distintos.
