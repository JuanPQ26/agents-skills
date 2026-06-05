---
name: requirements-generator
description: Genera documentos de requerimientos de software en formato Markdown (.md), un archivo por cada característica o funcionalidad del proyecto. Usa este skill siempre que el usuario pida crear, redactar o estructurar un "documento de requerimientos", "especificación de requisitos", "spec", "requisitos funcionales y no funcionales", "historias de usuario" o "criterios de aceptación" para una característica o feature, incluso si no menciona la palabra "plantilla". Cada documento se enfoca en una sola característica, sigue una estructura fija (Introducción → Requerimientos → Historias de usuario), separa requisitos funcionales y no funcionales con IDs, y detalla cada historia hasta sus criterios de aceptación en formato Gherkin.
---

# Generador de documentos de requerimientos

Este skill convierte la descripción de una característica o funcionalidad en un documento de requerimientos estructurado en Markdown, listo para versionar en un repositorio.

**Principio clave: un archivo por característica.** Cada `requirements.md` documenta **una sola característica** del proyecto, no el proyecto completo. A medida que el proyecto crece, se van agregando carpetas independientes bajo `docs/specs/`, una por cada característica nueva. Por eso la introducción, los requisitos y las historias de cada archivo se acotan al ámbito de **esa** característica.

**Principio clave: el documento NO toma decisiones técnicas.** Un documento de requerimientos describe **qué** debe hacer la característica y **por qué**, nunca **cómo** se construye. No menciona ni decide lenguajes, frameworks, librerías, paquetes, SDKs (ni sus versiones), proveedores concretos, bases de datos, infraestructura, rutas de archivos, nombres de clases/variables del código, identificadores de configuración ni formas de endpoints. Esas decisiones pertenecen a la fase de diseño/arquitectura y van en otro documento. Si la descripción del usuario incluye detalles técnicos, **tradúcelos a la capacidad o comportamiento de negocio que persiguen** en lugar de copiarlos al documento.

## Flujo de trabajo

1. **Lee la descripción que da el usuario y delimita la característica.** Identifica de qué característica concreta se trata, su propósito, los actores/roles implicados, las acciones que deben poder realizar y cualquier restricción técnica o de calidad mencionada. Si la descripción abarca varias características distintas, sugiere al usuario separarlas en documentos independientes (una carpeta por característica).

2. **No asumas información que falte.** Si la descripción no alcanza para llenar una sección con seguridad (por ejemplo, no hay roles claros, no se sabe el alcance, o faltan datos para escribir un criterio de aceptación concreto), **pregunta al usuario** antes de generar. Haz preguntas puntuales y agrupadas. Es preferible una pregunta breve a inventar un requisito que el usuario no pidió.

   **Las preguntas deben ser solo sobre alcance, comportamiento, reglas de negocio o expectativas de calidad — nunca sobre implementación técnica.** No preguntes qué lenguaje, framework, librería, paquete, SDK, proveedor, base de datos o infraestructura usar; esas decisiones no son parte de este documento. Una pregunta de seguridad o calidad expresada de forma genérica sí es válida (p. ej. "¿la validación debe ser confiable en un entorno servidor en vez de confiar solo en el dispositivo?"), pero "¿qué librería usarás?" no lo es.

3. **Genera el archivo** siguiendo exactamente la plantilla de `assets/template.md`. Guárdalo como un archivo real (no solo lo muestres en el chat) dentro del proyecto, dando a cada requerimiento su propia carpeta:

   ```
   docs/specs/<nombre-del-requerimiento>/requirements.md
   ```

   - `<nombre-del-requerimiento>` es el nombre de la carpeta y coincide con el nombre de la característica en *kebab-case* (minúsculas, sin tildes ni espacios; separa palabras con guiones). Ejemplo: característica "Autenticación de usuarios" → `docs/specs/autenticacion-de-usuarios/requirements.md`.
   - El archivo siempre se llama `requirements.md`. La carpeta por característica deja espacio para añadir después material relacionado (diagramas, mockups, notas) sin mezclarlo con otras características.
   - Si las carpetas `docs/specs/` o `docs/specs/<nombre-del-requerimiento>/` no existen, créalas antes de escribir el archivo.
   - Si ya existe un `requirements.md` en esa carpeta, avisa al usuario antes de sobrescribir.

## Reglas de la plantilla

Respeta esta estructura sin reordenar las secciones:

```
# Requerimiento — <Característica>
(tabla de metadatos: característica, versión, fecha, autor, estado)

## 1. Introducción
   ### 1.1 Propósito        (qué resuelve esta característica)
   ### 1.2 Alcance          (qué incluye y qué NO incluye esta característica)
   ### 1.3 Dependencias     (otras características o capacidades de negocio de las que depende, en términos funcionales; sin rutas de archivo, clases ni librerías)

## 2. Requerimientos
   ### 2.1 Requisitos funcionales      (tabla con IDs RF-NN)
   ### 2.2 Requisitos no funcionales   (tabla con IDs RNF-NN)
   ### 2.3 Historias de usuario        (HU-NN + criterios de aceptación)
```

### Identificadores

- Requisitos funcionales: `RF-01`, `RF-02`, … (qué debe **hacer** el sistema).
- Requisitos no funcionales: `RNF-01`, `RNF-02`, … (cualidades: rendimiento, seguridad, usabilidad, disponibilidad, mantenibilidad, etc.).
- Historias de usuario: `HU-01`, `HU-02`, …
- Numera siempre con dos dígitos y de forma correlativa. No saltes números.
- Los IDs son **locales a cada archivo de característica**: cada `requirements.md` empieza su numeración en `RF-01`, `RNF-01` y `HU-01`. No es necesario que sean únicos entre características distintas.

### Separar funcionales vs no funcionales

Antes de escribir, clasifica cada requisito: si describe **una acción o comportamiento** del sistema → funcional (RF). Si describe **cómo de bien** debe comportarse (límites, calidad, restricciones) → no funcional (RNF). Si un requisito mezcla ambos, divídelo.

### Historias de usuario

Cada historia usa el formato:

> **Como** \<rol\>, **quiero** \<acción\>, **para** \<beneficio\>.

Incluye `Requisitos relacionados:` enlazando los IDs `RF-NN` que la historia satisface, para mantener la coherencia con la sección 2.1.

### Criterios de aceptación (Gherkin)

Detalla **cada** historia hasta sus criterios de aceptación usando bloques ```gherkin``` en español:

```gherkin
Escenario: <nombre del escenario>
  Dado <contexto inicial>
  Cuando <acción que desencadena>
  Entonces <resultado verificable>
```

- Escribe al menos un escenario por historia; añade más para casos límite o de error cuando la descripción lo justifique (camino feliz + caso de error es un buen mínimo).
- Los `Entonces` deben ser **verificables** (algo observable o medible), no vagos.
- Puedes encadenar pasos con `Y` cuando sea necesario.

## Neutralidad técnica (regla estricta)

El documento describe necesidades, no soluciones. Antes de escribir cada línea, comprueba que no estás decidiendo nada técnico.

**No incluyas nunca:**
- Lenguajes, frameworks o runtimes (Flutter, React, .NET, etc.).
- Librerías, paquetes o SDKs y sus versiones (p. ej. nombres de paquetes, "StoreKit 2", "Billing Library 7.x").
- Proveedores o herramientas concretas como solución (servicios, consolas, plataformas de un fabricante).
- Bases de datos, esquemas, infraestructura o detalles de despliegue.
- Rutas de archivos, nombres de clases, métodos o variables del código.
- Identificadores de configuración, claves de producto o formas concretas de endpoints/APIs.
- Versiones mínimas de sistema operativo o de dependencias.

**Sí puedes incluir** (es problema de negocio, no solución): roles y capacidades, reglas de negocio, datos que el usuario maneja en términos conceptuales, restricciones de calidad expresadas de forma genérica (seguridad, rendimiento con métricas, disponibilidad, consistencia, manejo de errores), y el alcance de producto (p. ej. "debe funcionar en móviles").

**Traduce lo técnico a la necesidad que persigue.** Ejemplos:
- "Usar el paquete `in_app_purchase` / StoreKit / Google Play Billing" → "El sistema permite comprar suscripciones a través del flujo de pago integrado de la plataforma móvil."
- "Validar el receipt en el backend con la API de Apple/Google" → "La compra se valida en un entorno de confianza (servidor); el sistema no confía únicamente en lo que reporta el dispositivo."
- "Modificar `PaywallBottomSheet` y eliminar el formulario de tarjeta" → "El sistema no solicita datos de tarjeta dentro de la app; el cobro ocurre en el flujo de pago nativo de la plataforma."
- "Extender `UserModel` con campos de suscripción" → "El sistema registra y consulta el estado de suscripción del usuario."

Si dudas si algo es técnico, pregúntate: *¿esto restringe **cómo** se construye?* Si la respuesta es sí, déjalo fuera (irá en el documento de diseño).

## Buenas prácticas de redacción

- Un requisito = una idea. Frases en presente y en voz activa ("El sistema permite…", "El sistema valida…").
- Evita ambigüedades como "rápido", "fácil" o "intuitivo" sin una métrica; conviértelas en RNF medibles cuando sea posible (p. ej. "responde en menos de 2 s").
- Si el usuario no especificó metadatos (versión, autor, estado), usa valores razonables (`1.0`, fecha actual, `Borrador`) y déjalos visibles para que los ajuste.

## Ejemplo de uso

Para ver una ejecución completa (la misma entrada de usuario desarrollada hasta el documento final), consulta `references/ejemplo.md`. Léelo cuando necesites una referencia concreta del nivel de detalle y formato esperados antes de generar.
