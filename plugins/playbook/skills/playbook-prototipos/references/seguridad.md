# Seguridad de prototipos

## Modelo de riesgo (proporcional)

Situación actual: repos privados, solo Paco tiene acceso a GitHub y Netlify, y las URLs las conocen
dos personas del equipo. El riesgo no es un ataque sofisticado; es una filtración accidental:

| Riesgo | Cómo pasa | Defensa del playbook |
|---|---|---|
| Secreto en el repo | Claude o Paco pegan una llave en el código | Hook de Claude Code + pre-commit de git |
| Secreto en el navegador | Una llave en `environment.ts` termina en el bundle | Escaneo de `dist/` en pre-deploy |
| Datos reales expuestos | Se copian datos del sistema real a los mocks | Reglas de mocks + advertencias del escáner |
| Link reenviado | Alguien comparte la URL fuera del equipo | Control de acceso (Edge Function) |
| Indexación | Un buscador encuentra el sitio | `X-Robots-Tag: noindex` en todas las respuestas |

## Datos sintéticos

- Correos: dominios reservados `example.com`, `.test`, `.invalid`. RFC genérico: `XAXX010101000`.
- Nombres de personas y empresas: inventados. Nunca nombres de clientes reales en mocks.
- Términos a vigilar: agrégalos a `.playbook-sensibles.txt` (raíz del proyecto, no se sube).
- Incluye casos borde a propósito: el prototipo sirve para descubrir problemas de diseño.

## Angular y los "secretos"

Todo lo que el navegador ejecuta se puede leer: `environment.ts`, servicios, constantes y JSON de
`assets/`. Una llave en el front no está escondida, solo está ofuscada. Si un prototipo necesitara una
API con llave, eso requiere una función del lado servidor y se discute antes; no es parte de la v1.

## Control de acceso (Edge Function)

**Cómo funciona.** `netlify/edge-functions/acceso.ts` se ejecuta en el servidor de Netlify antes de
entregar cualquier archivo. Si `ACCESO_ACTIVO=true`, pide usuario y contraseña (diálogo nativo del
navegador). Sin credenciales válidas no se entrega ni el HTML, ni el JS, ni los mocks.

**Variables (en Netlify → Site configuration → Environment variables):**
- `ACCESO_ACTIVO`: `true` o `false`.
- `ACCESO_USUARIOS`: `usuario:clave` separados por comas, uno por persona. Las claves no pueden contener comas.
  Asegúrate de que el alcance (scope) de las variables incluya funciones.

**Reglas:**
- Un usuario por persona: permite revocar a alguien sin cambiarle la clave a todos.
- Paco escribe las claves directamente en Netlify o en su terminal. Claude no las ve ni las guarda.
- Las credenciales se comparten por un canal distinto al link (link por correo, clave por mensaje, o en persona).
- Después de cambiar variables, redeploy (Deploys → Trigger deploy) para asegurar que apliquen.
- Verificación: `curl -s -o /dev/null -w "%{http_code}" https://<sitio>.netlify.app/` → `401` = protegido, `200` = abierto.

**Límites (dilo cuando aplique):**
- Es autenticación básica: suficiente para prototipos con datos sintéticos, no para datos reales.
- El navegador recuerda las credenciales durante la sesión; en equipos compartidos, ventana privada.
- Cada visita consume créditos de edge functions del plan Free. Con pocos usuarios debería ser marginal; se mide en el piloto.

**Escalamiento (solo si cambia el riesgo):**
- Clientes externos o más usuarios → Cloudflare Access (login por código al correo, gratis hasta 50 usuarios; requiere el dominio en el DNS de Cloudflare).
- Un cliente paga el proyecto → protección con contraseña nativa de Netlify (plan Pro).

## Si se filtró un secreto

1. **Rota primero**: genera una llave nueva y revoca la anterior en el servicio que la emitió. Borrar el
   commit no basta: alguien pudo haberla copiado y el historial conserva copias.
2. Después quita el valor del código y muévelo a una variable de entorno.
3. Registra en la bitácora qué pasó y qué regla lo habría evitado.

## Falsos positivos

Si el escáner marca algo que no es secreto (p. ej. un ID largo de prueba), agrega en esa línea un
comentario con `escaneo:permitir` y explica por qué en el mensaje del commit. Nunca uses `--no-verify`.
