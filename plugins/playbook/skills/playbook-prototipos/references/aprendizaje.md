# Capa de aprendizaje

Meta a 90 días: Paco puede explicar cualquier diff de sus prototipos sin ayuda y detectar si hay
riesgo. La capa es ligera a propósito: una pregunta por cambio relevante, integrada al trabajo real.

## Niveles

### Nivel 1 — Mapa del proyecto
Saber dónde vive cada cosa y qué dispara un deploy.
- Carpetas y archivos clave: `src/app`, `assets/mocks`, `angular.json`, `package.json`, `netlify.toml`, `.gitignore`.
- Git básico: commit, push, rama; qué sube al repo y qué no.
- Qué llega al navegador y qué no.

**Criterio para subir:** explica la estructura de un prototipo propio sin ayuda y acierta 5 preguntas de nivel 1 (no necesariamente seguidas) con menos de 2 fallos en las últimas 5.

### Nivel 2 — Leer piezas de Angular
- Componente = `.ts` (lógica) + `.html` (plantilla) + estilos; selector `<app-...>`.
- `@Input()` / `@Output()` (propiedades y eventos de un componente, como en Figma).
- Servicios, `HttpClient` leyendo mocks, `*ngIf` / `*ngFor`, rutas con carga diferida.
- Clases de Tailwind y tokens en `tailwind.config.js`.

**Criterio:** dado un componente, predice qué se ve en pantalla y en qué estados; 5 aciertos de nivel 2.

### Nivel 3 — Leer diffs y riesgos
- Interpretar un diff: qué cambió, qué se agregó y qué se borró.
- Identificar qué termina en el bundle público.
- Detectar riesgos: secretos, datos reales, dependencias nuevas, cambios de versión.
- Leer un error de build y ubicar el archivo y la línea.

**Criterio:** en 3 `/playbook:explica` seguidos detecta correctamente si hay riesgo o confirma que no lo hay.

### Nivel 4 — Cambios propios pequeños
- Paco hace el cambio (texto, clases de Tailwind, un `@Input` nuevo, una ruta) y pide revisión a Claude, no código.
- Claude revisa como lo haría un compañero: qué está bien, qué cambiaría y por qué.

**Criterio:** 3 cambios propios que pasan build y pre-deploy sin que Claude reescriba el código.

## Tipos de pregunta por nivel

| Nivel | Tipo | Ejemplo |
|---|---|---|
| 1 | Ubicación | "Si quieres cambiar los datos de ejemplo de la tabla, ¿qué archivo abres?" |
| 1 | Consecuencia | "Si haces push ahora, ¿qué pasa en Netlify?" |
| 2 | Predicción | "Si la lista llega vacía, ¿qué muestra esta plantilla?" |
| 2 | Analogía | "¿A qué se parece este `@Input()` en un componente de Figma?" |
| 3 | Riesgo | "En este diff, ¿hay algo que termine visible en el navegador y no debería?" |
| 3 | Diagnóstico | "El build falla con este mensaje. ¿En qué archivo empezarías a buscar?" |
| 4 | Revisión | "Antes de que yo lo revise: ¿qué crees que podría romperse con tu cambio?" |

Reglas:
- Una pregunta a la vez; abierta o de opción múltiple corta (máximo 3 opciones).
- Pregunta sobre el código real del proyecto, no ejemplos genéricos.
- Retroalimentación en máximo 3 líneas. Si falla, otra analogía; nunca una clase larga.
- Si acierta con dudas, marca 🔁 (repasar) aunque sea correcto.

## Registro en PROGRESO.md

Agrega una fila por pregunta en la tabla "Registro":
`| AAAA-MM-DD | <proyecto> | <tema> | N<nivel> | ✅ / ❌ / 🔁 | <nota corta> |`

Saltos (Paco dijo "urgente" o "saltar"): fila en "Saltos" con el motivo.
Brechas de los briefs: fila en "Brechas al pedir"; si la brecha ya existe, suma 1 a "Veces".

Cuando se cumpla un criterio de nivel, actualiza "Nivel actual" y anota la fecha en "Criterios cumplidos".
Avisa a Paco del cambio de nivel en una línea, sin celebración exagerada.
