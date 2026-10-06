---
description: Checklist con semáforo antes de publicar
---

Ejecuta el checklist de `${CLAUDE_PLUGIN_ROOT}/skills/playbook-prototipos/references/checklist-pre-deploy.md`
en la raíz del proyecto actual.

1. Si falta `scripts/escanear-secretos.mjs` en el proyecto, cópialo desde `${CLAUDE_PLUGIN_ROOT}/scripts/`
   (o `$PLAYBOOK_HOME/plugins/playbook/scripts/`) y avisa.
2. Corre los 10 puntos en orden. No te detengas en el primer fallo: Paco necesita la foto completa.
3. Para el punto 6 obtén la URL del sitio de `netlify status` (si la CLI está enlazada) o pídesela a Paco una vez
   y guárdala en el `CLAUDE.md` del proyecto como "URL Netlify".
4. Nunca muestres valores de variables de entorno ni credenciales. Para el acceso basta el código HTTP.
5. Entrega la tabla del semáforo y la línea de veredicto.
6. Si hay ⚠️ o ❌, haz una pregunta de comprensión sobre uno de ellos ("¿por qué crees que esto es un riesgo?")
   y registra en la bitácora, salvo que Paco diga "urgente".

No hagas push tú: el veredicto es para que Paco decida.
