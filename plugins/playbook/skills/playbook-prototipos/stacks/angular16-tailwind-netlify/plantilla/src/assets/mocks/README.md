# Mocks — datos 100% sintéticos

Todo lo que está en esta carpeta se publica y cualquiera con acceso al sitio puede descargarlo.
Por eso aquí solo van datos inventados.

| Dato | Úsalo así | Nunca |
|---|---|---|
| Correos | `nombre@example.com` | correos reales de personas o clientes |
| RFC | `XAXX010101000` (genérico) | RFC de personas o empresas reales |
| Teléfonos | `55 0000 0000` | números reales |
| Empresas | nombres inventados ("Constructora Andamio") | nombres de clientes reales |
| Montos | cifras redondas o aleatorias | cifras copiadas de un sistema real |

Reglas:
- No copies exportaciones reales (Excel, CSV, capturas del ERP) aunque "solo sea para probar".
- Incluye casos borde a propósito: listas vacías, textos muy largos, montos en cero, fechas vencidas.
- Un archivo por entidad (`actividades.json`, `usuarios.json`), con 5 a 30 registros.
- Si algún dato real debe evitarse, agrega su nombre a `.playbook-sensibles.txt` (raíz del repo, no se sube) y el escáner te avisará si aparece.
