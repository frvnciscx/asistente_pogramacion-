# Glosario: de Figma a Angular + Tailwind

Usa estas equivalencias para explicar. Una analogía por concepto, la primera vez que aparezca.

## Diseño → código

| En Figma | En el código | Nota |
|---|---|---|
| Componente | `@Component` (archivos `.ts` + `.html` + estilos) | Se usa con su selector, p. ej. `<app-tarjeta>` |
| Instancia de un componente | Etiqueta `<app-tarjeta>` en otra plantilla | |
| Propiedades / variantes | `@Input()` | `<app-boton variante="primario">` |
| Interacción "al hacer clic" | Evento `(click)` y `@Output()` | El componente "avisa" al padre que algo pasó |
| Auto layout | `flex` / `grid` de Tailwind | `flex gap-4 items-center` ≈ auto layout horizontal con gap 16 |
| Variables / tokens | `theme.extend` en `tailwind.config.js` | Un color definido una vez, usado en todas partes |
| Estilos de texto | Clases tipográficas (`text-sm font-medium`) o tokens propios | |
| Estados hover / disabled | `hover:` `disabled:` `focus:` | Pseudo-clases de Tailwind |
| Página / frame de pantalla | Componente en `pages/` + una ruta | |
| Flujo de prototipo (conexiones) | Router de Angular (`routerLink`) | |
| Librería de componentes | `shared/components/` | |
| Contenido de ejemplo | `assets/mocks/*.json` + un servicio | |
| Componente que se muestra o no | `*ngIf` | |
| Lista repetida | `*ngFor` | Como repetir una instancia por cada dato |

## Git y despliegue

| Término | Qué es | Analogía |
|---|---|---|
| Repositorio | Carpeta del proyecto con historial completo | Archivo de Figma con historial de versiones |
| Commit | Punto guardado con descripción | Una versión nombrada en el historial |
| Push | Subir tus commits a GitHub | Publicar la versión para el equipo |
| Rama (branch) | Línea paralela de cambios | Duplicar una página para explorar sin tocar la original |
| Build | Convertir el proyecto en archivos que entiende el navegador | Exportar assets finales |
| Bundle | Los archivos JS resultantes del build | El paquete exportado: todo lo que va dentro se puede ver |
| Deploy | Publicar el build en Netlify | Compartir el link del prototipo |
| Variable de entorno | Valor configurado en el servidor, fuera del código | Un dato que no se guarda en el archivo de diseño |
| `.gitignore` | Lista de archivos que nunca se suben | Capas ocultas que no se exportan |
| Hook | Revisión automática antes de una acción | Un checklist que corre solo antes de publicar |
