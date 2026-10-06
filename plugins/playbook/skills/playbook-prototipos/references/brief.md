# Brief: cómo pedirle a Claude un prototipo

## Por qué existe

Claude rellena con suposiciones todo lo que el pedido no dice. Un pedido corto ("haz la pantalla de
actividades") produce código que *parece* terminado pero no tiene estados vacíos, ni errores, ni el
comportamiento que el diseño implicaba. El brief obliga a decir lo que el diseño ya sabe.

## Anatomía de un buen pedido

| Pieza | Pregunta que responde | Si falta… |
|---|---|---|
| Objetivo | ¿Qué problema resuelve y para quién? | Claude optimiza para lo que imagina |
| Alcance | ¿Qué pantallas y flujos entran? | Crece sin control o se queda corto |
| Fuera de alcance | ¿Qué NO se hace ahora? | Claude agrega cosas no pedidas |
| Referencia visual | ¿Qué frame/componente de Figma? | Diseño inventado |
| Estados | ¿Cargando, vacío, error, éxito, sin permisos? | Solo existe el "caso feliz" |
| Interacciones | ¿Qué pasa al hacer clic, filtrar, navegar? | Botones decorativos |
| Datos | ¿Qué campos, cuántos registros, qué casos borde? | Mocks irreales que esconden problemas de layout |
| Criterios de aceptación | ¿Cómo sé que está terminado? | "Terminado" según Claude |
| Restricciones | ¿Stack, componentes a reutilizar, responsive, accesibilidad? | Código que no encaja con el equipo |

## Brechas comunes (revísalas en cada pedido de Paco)

1. Solo describe el caso feliz (faltan estados).
2. No dice qué pasa en móvil.
3. No define el volumen de datos (¿3 registros o 300?).
4. Pide "igual que Figma" sin decir qué frame ni qué componentes ya existen.
5. Mezcla varias pantallas en un solo pedido.
6. No dice qué queda fuera.
7. No define cómo se verifica que está terminado.

## Plantilla

Guarda cada brief en `docs/briefs/AAAA-MM-DD-<modulo>.md` dentro del proyecto.

```markdown
# Brief: <Módulo o pantalla>
Proyecto: <nombre> · Perfil: <perfil de stack> · Fecha: <AAAA-MM-DD> · Ruta: /<modulo>

## 1. Objetivo
<Qué problema resuelve y para quién. 2-3 líneas.>

## 2. Alcance
- <Pantalla/flujo 1>
- <Pantalla/flujo 2>

## 3. Fuera de alcance
- <Lo que explícitamente no se hace en esta versión>

## 4. Referencia visual
- Figma: <link o nombre del frame>
- Componentes existentes a reutilizar: <lista o "ninguno">
- Tokens: <colores, tipografía, espaciados relevantes>

## 5. Estados
| Pantalla | Cargando | Vacío | Error | Con datos | Otros |
|---|---|---|---|---|---|

## 6. Interacciones
- <Acción> → <resultado esperado>

## 7. Datos (100% sintéticos)
- Archivo: `src/assets/mocks/<entidad>.json`
- Campos: <campo: tipo, ejemplo>
- Volumen: <n registros>
- Casos borde incluidos: <texto largo, cero, vacío, fecha vencida…>

## 8. Criterios de aceptación
- [ ] <Verificable a simple vista o con una acción concreta>
- [ ] Compila sin errores (`npm run build`)
- [ ] Pasa `/playbook:pre-deploy`

## 9. Restricciones técnicas
- Responsive: <móvil/tablet/escritorio>
- Accesibilidad: <foco visible, labels, contraste>
- Otras: <…>

## 10. Plan por rebanadas
1. <Paso pequeño que compila y se puede ver>
2. <…>
```

## Reglas al generar el brief

- Haz como máximo 3 preguntas, solo sobre huecos que cambian el resultado. Para lo demás, propone un
  default razonable y márcalo como "(supuesto)".
- Si hay herramientas de Figma disponibles (MCP), úsalas para extraer componentes, variables/tokens y
  una captura del frame antes de preguntar.
- Termina con "📌 Lo que faltaba en tu pedido": lista corta de las brechas que tuviste que cubrir.
  Es la parte de aprendizaje del brief.
- El plan por rebanadas debe tener pasos de 15-30 minutos de trabajo de Claude, cada uno visible en el navegador.
