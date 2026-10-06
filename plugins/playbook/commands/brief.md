---
description: Idea o frame de Figma → brief listo para construir
argument-hint: <idea, módulo o link de Figma>
---

Convierte el pedido de Paco en un brief completo antes de escribir cualquier código.

Pedido: $ARGUMENTS

1. Lee `${CLAUDE_PLUGIN_ROOT}/skills/playbook-prototipos/references/brief.md` (plantilla, anatomía y brechas comunes).
   Si la variable no se expandió, usa `$PLAYBOOK_HOME/plugins/playbook/...` (por defecto `~/playbook-prototipos/`).
2. Lee el `CLAUDE.md` del proyecto para conocer el perfil de stack y los módulos existentes.
3. Si el pedido incluye un link o frame de Figma y hay herramientas de Figma disponibles, extrae
   estructura, componentes, variables/tokens y una captura antes de preguntar nada.
4. Identifica los huecos. Pregunta como máximo 3 cosas, solo las que cambian el resultado.
   Para el resto propone un default y márcalo "(supuesto)".
5. Escribe el brief con la plantilla y guárdalo en `docs/briefs/AAAA-MM-DD-<modulo>.md`.
6. Cierra con:
   - **📌 Lo que faltaba en tu pedido**: 2-5 brechas concretas, en una línea cada una.
   - La primera rebanada del plan, lista para empezar si Paco confirma.
7. Registra las brechas en `$PLAYBOOK_HOME/bitacora/PROGRESO.md` (tabla "Brechas al pedir"),
   siguiendo el procedimiento de bitácora del skill.

No empieces a construir hasta que Paco apruebe el brief (basta un "va").
