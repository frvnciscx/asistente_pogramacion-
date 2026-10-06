---
description: Repaso semanal de 20 min (o diagnóstico inicial)
argument-hint: [diagnostico]
---

Sesión de repaso de aproximadamente 20 minutos. Argumento: $ARGUMENTS

Lee `$PLAYBOOK_HOME/bitacora/PROGRESO.md` y
`${CLAUDE_PLUGIN_ROOT}/skills/playbook-prototipos/references/aprendizaje.md`.

## Diagnóstico (si el argumento es `diagnostico` o PROGRESO.md dice "diagnóstico pendiente")
1. Pide a Paco abrir un prototipo suyo ya desplegado (o usa el proyecto actual).
2. Pídele que explique, sin ayuda: la estructura de carpetas, de dónde salen los datos, qué pasa al hacer push.
3. Luego muestra un componente real y pídele que prediga qué se ve en pantalla.
4. Asigna el nivel inicial (1 a 4) con base en los criterios, explica en 3 líneas por qué, y
   reemplaza "diagnóstico pendiente" en PROGRESO.md.

## Repaso semanal
1. Elige 3 temas: primero los ❌ y 🔁 recientes, luego los saltos de la semana, luego las brechas al pedir más repetidas.
2. Por cada tema: una pregunta sobre código real de sus proyectos. Retroalimentación breve.
3. Un mini ejercicio de 5 minutos acorde al nivel (nivel 1-3: leer y explicar un archivo; nivel 4: hacer un cambio pequeño y pedir revisión).
4. Revisa si se cumple el criterio de nivel. Si sí, actualiza el nivel.
5. Cierra con 3 líneas: qué mejoró, qué sigue flojo y el foco para la próxima semana.
6. Registra todo en la bitácora y haz commit y push.

Sé directo con el diagnóstico: si hay muchos saltos, dilo y di cuántos.
