# Playbook de prototipos (v0.1.0)

Plugin de Claude Code para dirigir a Claude en prototipos funcionales, aprender a leer lo que construye
y publicarlo sin exponer secretos ni datos reales.

- **Saber pedir:** `/playbook:brief` convierte una idea o un frame de Figma en un brief completo y te dice qué le faltaba a tu pedido.
- **Saber leer:** después de cada cambio relevante, una pregunta de comprensión según tu nivel (1 a 4), registrada en la bitácora.
- **Seguridad:** escáner de secretos en dos capas (hook de Claude Code + pre-commit de git), datos sintéticos y control de acceso opcional en el plan gratuito de Netlify.
- **Stack v1:** Angular 16 + TypeScript + Tailwind 3 + Netlify. Otros stacks se agregan como perfiles.

## Contenido del repo

```
.claude-plugin/marketplace.json        marketplace local "paco-local"
plugins/playbook/
  .claude-plugin/plugin.json
  commands/                            8 comandos /playbook:*
  hooks/hooks.json                     guardia de secretos (PreToolUse → Bash)
  scripts/escanear-secretos.mjs        escáner único (hook, pre-commit, pre-deploy)
  skills/playbook-prototipos/
    SKILL.md                           reglas, flujo y capa de aprendizaje
    references/                        brief, seguridad, aprendizaje, glosario, checklist
    stacks/angular16-tailwind-netlify/ PERFIL.md + plantilla/ (netlify.toml, Edge Function, hooks…)
bitacora/
  PROGRESO.md                          nivel, registro, saltos, brechas
  prompts/                             biblioteca de prompts que funcionaron
```

## Requisitos

- Claude Code, git y Node 18 (recomendado con nvm o nvm-windows; el proyecto trae `.nvmrc`).
- Cuenta de GitHub. Opcionales: GitHub CLI (`gh`) y Netlify CLI (`netlify`).

## Instalación

### Una sola vez: subir el repo a GitHub (privado)

```bash
cd playbook-prototipos
git init && git add . && git commit -m "playbook v0.1.0"
gh repo create playbook-prototipos --private --source=. --push
# sin gh: crea el repo privado en github.com y sigue sus instrucciones de "push an existing repository"
```

### En cada equipo

1. Clona el repo en tu carpeta de usuario:
   ```bash
   git clone https://github.com/<tu-usuario>/playbook-prototipos.git ~/playbook-prototipos
   ```
2. Si lo clonaste en otra ruta, define `PLAYBOOK_HOME` en `~/.claude/settings.json`:
   ```json
   { "env": { "PLAYBOOK_HOME": "C:/Users/<tu-usuario>/ruta/playbook-prototipos" } }
   ```
3. En Claude Code (con la ruta absoluta del clon):
   ```
   /plugin marketplace add /ruta/absoluta/a/playbook-prototipos
   /plugin install playbook@paco-local
   ```
4. Reinicia Claude Code y verifica que `/help` muestre los comandos `/playbook:*`.
5. Valida el plugin: `claude plugin validate /ruta/absoluta/a/playbook-prototipos`.

### Actualizar

Edita siempre la copia del clon. Si cambiaste algo del plugin (comandos, skill, scripts, plantillas),
**sube la versión** en `plugins/playbook/.claude-plugin/plugin.json` y en `.claude-plugin/marketplace.json`
(p. ej. 0.1.0 → 0.1.1): Claude Code guarda una copia en caché por versión. Haz commit y push.
En los demás equipos: `git -C ~/playbook-prototipos pull`, luego `/plugin marketplace update paco-local`
y reinicia Claude Code. Los cambios solo de `bitacora/` no requieren subir versión.

## Comandos

| Comando | Para qué |
|---|---|
| `/playbook:brief <idea o link de Figma>` | Brief listo para construir + "lo que faltaba en tu pedido" |
| `/playbook:nuevo-prototipo <nombre>` | Proyecto Angular 16 nuevo con la plantilla aplicada |
| `/playbook:nuevo-prototipo adoptar` | Aplicar la plantilla a un prototipo que ya existe |
| `/playbook:explica [commit]` | Qué cambió, qué llega al navegador y una pregunta |
| `/playbook:pre-deploy` | Semáforo de 10 puntos antes del push |
| `/playbook:acceso on/off/estado/usuarios/rotar` | Control de acceso del sitio |
| `/playbook:guardar-prompt [título]` | Guardar un prompt que funcionó |
| `/playbook:repaso [diagnostico]` | Repaso semanal de 20 min o diagnóstico inicial |
| `/playbook:actualizar-stack <versión>` | Migrar el perfil cuando el equipo cambie de Angular |

Si ningún otro plugin usa el mismo nombre, también funcionan sin prefijo (`/brief`, `/explica`…).

## Primeros pasos recomendados

1. **Diagnóstico:** `/playbook:repaso diagnostico` sobre un prototipo tuyo ya desplegado. Define tu nivel real.
2. **Adoptar un prototipo existente:** `/playbook:nuevo-prototipo adoptar` en el repo del módulo que estés trabajando.
3. **Primer brief real:** `/playbook:brief` con el siguiente módulo o pantalla.
4. **Probar la guardia de secretos** (en un repo de prueba, nunca en uno real):
   ```bash
   node -e "console.log('const t = \"ghp_' + 'A'.repeat(36) + '\";')" > prueba.ts
   git add prueba.ts && git commit -m prueba     # debe bloquearse
   git reset prueba.ts && rm prueba.ts
   ```

## Control de acceso: piloto para medir fricción

El control es opcional y se enciende o apaga con la variable `ACCESO_ACTIVO`, sin tocar código.

1. Publica con `ACCESO_ACTIVO=false` (estado actual, sin cambios para el equipo).
2. Configura `ACCESO_USUARIOS` con un usuario por persona (tú más las 2 personas del equipo).
3. `/playbook:acceso on`, redeploy y verifica con `/playbook:acceso estado` (debe dar 401 sin credenciales).
4. Pide al equipo abrirlo en escritorio y en móvil. El navegador pide usuario y clave una vez por sesión.
5. Tras una semana, revisa en Netlify el consumo de créditos y pregunta al equipo si generó fricción.
6. Decide si se queda activo y anótalo en el `CLAUDE.md` del proyecto.

Si en el futuro entran clientes externos, el siguiente paso es Cloudflare Access (gratis hasta 50 usuarios).
Si un cliente paga el proyecto, la protección nativa de Netlify Pro.

## Límites de la v1

**Incluye:**
- Un solo usuario, Paco. El equipo no instala nada: solo recibe URLs y, si aplica, credenciales.
- Prototipos de front con datos 100% sintéticos.
- Un perfil de stack: `angular16-tailwind-netlify`. Un sitio de Netlify por proyecto, con cada módulo como ruta.

**Fuera de la v1:**
- Backend, APIs reales, autenticación de producción y datos reales.
- Otros stacks, versión para claude.ai, CI/CD y tests automatizados.
- Uso del plugin por el equipo.

**Lo que el escáner no hace:** no es una auditoría de seguridad. Detecta patrones comunes de llaves y
datos que parecen reales. Puede tener falsos positivos (se marcan con `escaneo:permitir`) y no detecta
todo.

## Pendientes de validar en el piloto

- El consumo real de créditos de la Edge Function en el plan Free.
- Que Netlify acepte `NODE_VERSION = "18"`. Si no, fija una versión exacta de la línea 18 y anótala en `PERFIL.md`.
- Si después de cambiar una variable de entorno el cambio aplica sin redeploy. Por ahora el flujo siempre hace redeploy.
- En Windows, que el hook de Claude Code se dispare con su herramienta de terminal. El pre-commit de git cubre el caso de todos modos.
# asistente_pogramacion-
