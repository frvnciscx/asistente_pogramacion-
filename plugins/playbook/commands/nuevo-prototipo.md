---
description: Crear proyecto con la plantilla del perfil, o adoptar uno existente
argument-hint: <nombre-del-proyecto> | adoptar
---

Prepara un proyecto con el perfil `angular16-tailwind-netlify`.
Argumentos: $ARGUMENTS

Rutas: plantilla en `${CLAUDE_PLUGIN_ROOT}/skills/playbook-prototipos/stacks/angular16-tailwind-netlify/plantilla/`
y escáner en `${CLAUDE_PLUGIN_ROOT}/scripts/escanear-secretos.mjs`. Si la variable no se expandió, usa
`$PLAYBOOK_HOME/plugins/playbook/` (por defecto `~/playbook-prototipos/plugins/playbook/`).
Lee `PERFIL.md` del perfil antes de empezar.

## A. Proyecto nuevo (argumento = nombre en kebab-case)
1. Verifica `node --version`. Si no es 18.x, avisa y sugiere `nvm use 18` (o nvm-windows). No continúes sin confirmación de Paco.
2. `npx -p @angular/cli@16 ng new <nombre> --routing --style=css --defaults` y entra a la carpeta.
3. Tailwind 3: `npm i -D tailwindcss@3 postcss autoprefixer`, `npx tailwindcss init`, configura `content`
   y agrega las directivas `@tailwind` a `src/styles.css` (ver PERFIL.md).
4. Continúa con la sección C.

## B. Adoptar un proyecto existente (argumento = `adoptar`)
1. Confirma que estás en la raíz de un proyecto Angular (existe `angular.json`) y lee su versión real
   en `package.json`. Si no es 16.x, detente y avisa: el perfil no coincide.
2. Revisa qué ya existe (`netlify.toml`, `.gitignore`, `CLAUDE.md`, mocks). No sobrescribas nada sin
   mostrar a Paco la diferencia y pedir confirmación.
3. Continúa con la sección C.

## C. Aplicar la plantilla
1. Copia de la plantilla: `netlify.toml`, `.nvmrc`, `.env.example`, `.githooks/pre-commit`,
   `netlify/edge-functions/acceso.ts`, `src/assets/mocks/README.md`. Crea `docs/briefs/`.
2. Copia `escanear-secretos.mjs` a `scripts/` del proyecto.
3. En `netlify.toml` reemplaza `NOMBRE_PROYECTO` por el nombre real de la carpeta de salida (revisa
   `outputPath` en `angular.json`).
4. Agrega el contenido de `gitignore-adicional.txt` al final de `.gitignore` (sin duplicar líneas).
5. Agrega a `package.json` el script `"prepare": "node scripts/escanear-secretos.mjs --instalar"` y
   corre `npm install` para activar el hook de git. Verifica con `git config core.hooksPath` (debe decir `.githooks`).
6. `CLAUDE.md`: si no existe, créalo con `CLAUDE-playbook.md`; si existe, agrega esa sección al final.
   Reemplaza `NOMBRE_PROYECTO`.
7. Corre `node scripts/escanear-secretos.mjs --todo` y `npm run build`. Ambos deben pasar.
8. Commit: `chore: aplicar plantilla del playbook (seguridad, deploy, mocks)`.

## D. Publicación (lo hace Paco; tú guías)
1. Repo privado en GitHub: si `gh` está instalado, `gh repo create <nombre> --private --source=. --push`;
   si no, indica los pasos en github.com. Verifica que quede **privado**.
2. En Netlify: Add new site → Import from Git → el repo. Netlify lee `netlify.toml`.
3. En Environment variables crea `ACCESO_ACTIVO=false` por ahora. Para activarlo, `/playbook:acceso on`.

## E. Aprendizaje (nivel 1)
Muestra el árbol de carpetas principal y explica en una línea cada carpeta clave con el glosario.
Haz una pregunta de nivel 1 sobre la estructura y registra el resultado en la bitácora.
