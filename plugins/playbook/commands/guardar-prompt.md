---
description: Guardar en la biblioteca un prompt o brief que funcionó
argument-hint: [título corto]
---

Guarda en la biblioteca de prompts el pedido que funcionó bien en esta sesión.
Título sugerido: $ARGUMENTS

1. Si no es obvio cuál prompt o brief guardar, pregunta a Paco cuál (una sola pregunta).
2. Crea `$PLAYBOOK_HOME/bitacora/prompts/<categoria>/<AAAA-MM-DD>-<slug>.md`.
   Categorías: `briefs`, `componentes`, `datos`, `estilos`, `depuracion`, `deploy`, `otros`.
3. Contenido:
   ```markdown
   # <Título>
   Fecha: · Proyecto: · Perfil de stack:
   ## Contexto
   <qué se necesitaba, en 2 líneas>
   ## Prompt
   <el texto exacto que funcionó, sin datos reales ni secretos>
   ## Por qué funcionó
   <qué piezas del pedido marcaron la diferencia>
   ## Resultado
   <qué produjo y qué se tuvo que corregir>
   ```
4. Agrega una fila al índice `$PLAYBOOK_HOME/bitacora/prompts/README.md`.
5. Haz commit y push de la bitácora con el procedimiento del skill.

Revisa antes de guardar que el prompt no contenga nombres reales de clientes, datos reales ni credenciales.
