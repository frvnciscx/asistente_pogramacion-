# Plantilla para crear un perfil de stack nuevo

Copia la carpeta `angular16-tailwind-netlify/` con el nombre `<framework><versión>-<estilos>-<hosting>`
(por ejemplo `angular17-tailwind-netlify` o `react18-tailwind-vercel`) y ajusta:

1. **PERFIL.md**: tabla de versiones (con fuente oficial de compatibilidad), comandos, estructura, convenciones, despliegue y problemas conocidos.
2. **plantilla/**: archivos que se copian a cada proyecto.
   - Configuración del hosting (equivalente a `netlify.toml`): build, carpeta publicada, versión de Node, SPA y encabezados `noindex`.
   - Control de acceso del lado servidor/edge (nunca un login dentro del front).
   - `.githooks/pre-commit`, `.env.example`, `gitignore-adicional.txt`, `.nvmrc`, `src/.../mocks/README.md`.
   - `CLAUDE-playbook.md` con el nombre del perfil.
3. Marca el perfil anterior como **legado** en su PERFIL.md (no lo borres: hay prototipos que lo usan).
4. Actualiza la lista de perfiles en el SKILL.md del playbook.

Un perfil está listo cuando un proyecto nuevo creado con él pasa `/playbook:pre-deploy` sin errores.
