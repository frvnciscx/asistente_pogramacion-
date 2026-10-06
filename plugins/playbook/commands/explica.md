---
description: Explicar un cambio o diff + una pregunta de comprensión
argument-hint: [commit, archivo o vacío = cambios actuales]
---

Explica un cambio a Paco y aplica la capa de aprendizaje.
Objetivo: $ARGUMENTS (si está vacío: cambios sin commit; si no hay, el último commit).

1. Lee `$PLAYBOOK_HOME/bitacora/PROGRESO.md` para conocer el nivel actual, y
   `${CLAUDE_PLUGIN_ROOT}/skills/playbook-prototipos/references/aprendizaje.md` y `glosario-diseno-codigo.md`.
2. Obtén el diff (`git diff`, `git show <commit>` o el archivo indicado).
3. Responde con este formato, breve:
   - **Qué cambió** (máx. 3 líneas, lenguaje de diseño).
   - **Mapa**: tabla `archivo → para qué sirve en este cambio` (solo los archivos tocados).
   - **Qué llega al navegador**: qué de este cambio termina en el bundle o en assets públicos, y si hay riesgo.
   - **Pregunta**: una sola, del nivel actual, sobre este código.
4. Espera la respuesta. Retroalimentación en máximo 3 líneas.
5. Registra en la bitácora (✅ / ❌ / 🔁). Si se cumple un criterio de nivel, actualiza el nivel y avísalo.

Si Paco escribe "saltar" o "urgente", omite la pregunta y registra el salto con su motivo.
