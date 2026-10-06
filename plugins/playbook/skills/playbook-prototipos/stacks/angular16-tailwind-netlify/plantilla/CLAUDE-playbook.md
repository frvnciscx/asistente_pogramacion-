<!-- Sección del Playbook de prototipos. /playbook:nuevo-prototipo la agrega al CLAUDE.md del proyecto
     (o crea CLAUDE.md si no existe). No reemplaces lo que ya tenga el archivo. -->

## Playbook de prototipos

- **Perfil de stack:** `angular16-tailwind-netlify`
- **Proyecto:** NOMBRE_PROYECTO — un sitio de Netlify; cada módulo es una ruta (`/modulo`).
- **Quién dirige:** Paco (diseñador UI/UX). Claude construye y explica; Paco decide.

### Reglas no negociables
1. Datos 100% sintéticos en `src/assets/mocks/`. Nada copiado de sistemas reales.
2. Cero secretos en el código. `environment.ts` termina en el navegador: es público.
3. Nunca `--no-verify` ni cambios a `core.hooksPath`. Si el escáner marca algo, se corrige.
4. No cambiar versiones de Angular, Node o Tailwind fuera de `/playbook:actualizar-stack`.
5. Commits pequeños, uno por paso del brief, con mensaje en español que diga qué y por qué.

### Flujo
`/playbook:brief` → construir por rebanadas → `/playbook:explica` → `/playbook:pre-deploy` → push.

### Briefs
Se guardan en `docs/briefs/`. El brief vigente de cada módulo es la fuente de verdad del alcance.
