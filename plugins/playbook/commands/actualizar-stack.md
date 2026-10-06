---
description: Migrar el perfil cuando el equipo cambie de versión
argument-hint: <nueva versión de Angular, p. ej. 17>
---

El equipo migró de versión y hay que actualizar el playbook. Nueva versión: $ARGUMENTS

Rutas: los perfiles están en `$PLAYBOOK_HOME/plugins/playbook/skills/playbook-prototipos/stacks/`.
Edita SIEMPRE la copia del repo en `$PLAYBOOK_HOME` (no la del caché de plugins), porque es la que se versiona.

1. Confirma con Paco que el equipo ya usa esa versión en su proyecto real y pregunta (una vez) si cambió algo
   más: Node, Tailwind, standalone vs NgModules, hosting.
2. Consulta las fuentes oficiales antes de escribir nada: https://angular.dev/reference/versions (Node y
   TypeScript compatibles) y https://angular.dev/update-guide (pasos de migración). Si no tienes acceso web,
   dilo y pide a Paco que las abra; no inventes versiones.
3. Copia el perfil vigente como `angular<N>-tailwind-netlify` y actualiza:
   - `PERFIL.md`: versiones, comandos (`@angular/cli@<N>`), convenciones y problemas conocidos.
   - `plantilla/netlify.toml`: `NODE_VERSION` y `publish`. Desde Angular 17 con el builder nuevo la salida
     suele ser `dist/<nombre>/browser`: verifícalo con un build real.
   - `plantilla/.nvmrc` y `plantilla/CLAUDE-playbook.md` (nombre del perfil).
4. Marca el perfil anterior como **legado** en su PERFIL.md. No lo borres.
5. Actualiza la lista de perfiles en el `SKILL.md`.
6. Para cada prototipo existente que deba migrar: `npx ng update @angular/core@<N> @angular/cli@<N>`,
   una versión mayor a la vez (nunca saltar versiones), luego `npm run build` y `/playbook:pre-deploy`.
   Cambia la línea "Perfil de stack" en su `CLAUDE.md`.
7. Sube la versión del plugin (parche, p. ej. 0.1.0 → 0.1.1) en `plugins/playbook/.claude-plugin/plugin.json`
   y en `.claude-plugin/marketplace.json`. Commit y push en `$PLAYBOOK_HOME`. Recuerda a Paco ejecutar
   `/plugin marketplace update paco-local` y reiniciar Claude Code en cada equipo.
8. Aprendizaje: una pregunta sobre qué cambió entre versiones y por qué importa para el deploy.
