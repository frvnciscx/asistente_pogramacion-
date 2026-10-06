# Perfil de stack: angular16-tailwind-netlify

Estado: **activo** (v1). Alineado con el stack del equipo. Cambiarlo solo con `/playbook:actualizar-stack`.

## Versiones

| Pieza | Versión | Nota |
|---|---|---|
| Angular / CLI | 16.x | Fuera de soporte LTS. Se mantiene por compatibilidad con el equipo. |
| Node.js | 18 (`.nvmrc`) | Angular 16 acepta `^16.14.0` o `^18.10.0`. Con Node 20+ funciona con advertencias, pero no está soportado. |
| TypeScript | >=4.9.3 <5.2 | Lo fija el CLI al crear el proyecto. No subirlo a mano. |
| RxJS | 7.x | |
| Tailwind CSS | 3.x | Angular 16 lo integra vía PostCSS al detectar `tailwind.config.js`. |
| Hosting | Netlify (plan Free) | Un sitio por proyecto. |

Fuente de compatibilidad: https://angular.dev/reference/versions

## Comandos

| Acción | Comando |
|---|---|
| Crear proyecto | `npx -p @angular/cli@16 ng new NOMBRE --routing --style=css --defaults` |
| Servidor local | `npm start` (abre en http://localhost:4200) |
| Build de producción | `npm run build` → `dist/NOMBRE/` |
| Generar módulo con ruta | `npx ng g module modulos/NOMBRE --route NOMBRE --module app.module` |
| Generar componente | `npx ng g component modulos/MODULO/components/NOMBRE` |
| Generar servicio | `npx ng g service core/services/NOMBRE` |
| Instalar Tailwind 3 | `npm i -D tailwindcss@3 postcss autoprefixer` y `npx tailwindcss init` |

Usa siempre `npx ng` dentro del proyecto para que corra el CLI 16 local y no uno global de otra versión.

## Estructura de carpetas

```
src/app/
  core/services/            servicios compartidos (lectura de mocks, estado)
  shared/components/        componentes reutilizables (equivalente a la librería de Figma)
  modulos/<modulo>/         un módulo por sección del producto, con carga diferida (lazy)
    components/             piezas propias del módulo
    pages/                  pantallas (lo que en Figma es un frame de página)
    <modulo>-routing.module.ts
src/assets/mocks/           datos sintéticos en JSON (uno por entidad)
docs/briefs/                briefs aprobados
netlify/edge-functions/     control de acceso
scripts/                    escáner de secretos
```

## Convenciones

- **NgModules por defecto** (no standalone), salvo que el equipo use standalone: revisa el repo del equipo y alinéate.
- Cada módulo se carga de forma diferida desde `app-routing.module.ts` (`loadChildren`).
- Los datos se leen de `assets/mocks/*.json` con `HttpClient` desde un servicio en `core/services`. Los componentes nunca leen archivos directamente.
- Estilos con clases de Tailwind en la plantilla. Colores, tipografía y espaciados se definen como tokens en `tailwind.config.js` (theme.extend), no como valores sueltos.
- Nombres de archivos en kebab-case; nombres de clases en PascalCase. Textos de interfaz en español.
- Estados obligatorios en cada pantalla con datos: cargando, vacío, error y con datos.

## Tailwind (configuración base)

`tailwind.config.js`:
```js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: [],
};
```
`src/styles.css` (al inicio):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Despliegue

- `netlify.toml` de la plantilla: build, `publish = dist/NOMBRE`, Node 18, SPA y encabezados `noindex`.
- Control de acceso: `netlify/edge-functions/acceso.ts`, encendido con `ACCESO_ACTIVO`.
- El deploy se dispara con cada push a la rama conectada en Netlify.

## Problemas conocidos

- `npm audit` reportará vulnerabilidades heredadas de Angular 16. `/playbook:pre-deploy` las informa, pero no bloquea por ellas.
- Si Netlify rechaza `NODE_VERSION = "18"`, prueba con una versión exacta de la línea 18 (p. ej. `18.20.4`) y anótalo aquí.
- Al migrar a Angular 17 o superior cambia la carpeta de salida del build (el builder nuevo publica en `dist/NOMBRE/browser`). Es el primer punto a revisar en `/playbook:actualizar-stack`.
