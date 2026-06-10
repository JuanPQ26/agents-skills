---
name: arch-design
description: >
  Usa esta skill cuando el usuario quiera generar decisiones de diseño arquitectónico para una
  característica o requerimiento. Se activa con frases como "crear design", "generar diseño
  arquitectónico", "decisiones arquitectónicas", "analizar requerimiento", "diseñar feature",
  "arch design", "qué librerías usar para", o cuando se menciona una ruta como
  docs/specs/<nombre-caracteristica>. También se activa cuando se solicita diseñar a partir de un
  requirements.md existente, o cuando el usuario pregunta cómo debe construirse una característica,
  qué librerías usar, qué servicios externos integrar o qué contratos definir — incluso sin
  mencionar "diseño" o "arquitectura" explícitamente. Siempre usa esta skill antes de generar
  cualquier archivo design.md.
---

# Skill de Diseño Arquitectónico

Esta skill lee el `ARCHITECTURE.md` del proyecto y el `requirements.md` de una característica,
investiga buenas prácticas y librerías actuales mediante búsqueda web, y produce un `design.md`
con directrices arquitectónicas precisas para el desarrollador.

---

## Reglas No Negociables

1. **Sin lógica de negocio.** Solo librerías, servicios externos y contratos — nunca pasos de implementación.
2. **Sin pseudocódigo ni pistas de lógica** para los internos del desarrollador. Solo forma (interfaces, DTOs, eventos).
3. **Toda decisión debe estar justificada** — por qué esta librería/servicio sobre las alternativas.
4. **Investigar antes de decidir** — siempre usar búsqueda web para verificar vigencia y relevancia de las elecciones.
5. **Respetar lo que ya existe** — nunca sugerir reemplazar una librería funcional sin razón sólida.
6. **El estilo arquitectónico viene de ARCHITECTURE.md** — nunca imponer un patrón que el proyecto no haya adoptado.

---

## Flujo de Trabajo

### Paso 1 — Leer `ARCHITECTURE.md`

Localizar y leer el archivo `ARCHITECTURE.md` del proyecto. Este es la única fuente de verdad para:

- Stack (lenguajes, runtimes, frameworks)
- Estilo arquitectónico (Clean Architecture, DDD, capas, monolito modular, microservicios, etc.)
- Librerías existentes y sus roles
- Convenciones y restricciones (nombres, estructura de carpetas, reglas por capa)
- Servicios externos ya integrados

```bash
cat ARCHITECTURE.md
```

Si `ARCHITECTURE.md` no existe, **detener** y notificar al usuario:
> "No encontré un archivo `ARCHITECTURE.md` en la raíz del proyecto. Este archivo es necesario para
> que la skill conozca el stack y las decisiones base del proyecto. ¿Quieres que te ayude a crearlo?"

No continuar sin él.

---

### Paso 2 — Leer `requirements.md`

El archivo de requerimientos de la característica siempre está en:
```
docs/specs/<nombre-caracteristica>/requirements.md
```

Preguntar el nombre de la característica si no fue proporcionado, luego leer el archivo:
```bash
cat docs/specs/<nombre-caracteristica>/requirements.md
```

Si no existe, detener y notificar al usuario con el siguiente mensaje:
> "No encontré un archivo `requirements.md` en `docs/specs/<nombre-caracteristica>/requirements.md`. Para diseñar la arquitectura de la característica, primero se deben definir sus requerimientos de negocio. ¿Quieres que te ayude a generarlos?"

De los requerimientos, extraer:
- **Casos de uso y flujos de negocio** (por ejemplo: registro de cuenta, autenticación de sesión, procesamiento asíncrono de tareas, emisión de reportes).
- **Actores / roles involucrados** (usuarios finales, administradores, servicios automatizados).
- **Necesidades conceptuales de integración con terceros** (por ejemplo: procesamiento de cobros externos, envío de alertas por correo o notificaciones).
- **Entidades de datos de negocio implicadas** (por ejemplo: perfiles de usuario, registros de transacciones, estados de órdenes).
- **Requisitos de calidad / no funcionales** (restricciones de tiempos de respuesta a nivel de negocio, confidencialidad, capacidades sin conexión).
- **Reglas y restricciones de negocio** (políticas de retención, normativas locales, SLAs de entrega, criterios de validación).

---

### Paso 3 — Investigar (siempre hacerlo)

Antes de hacer cualquier recomendación de librería o servicio, investigar de forma obligatoria. No dependas únicamente del conocimiento de entrenamiento, ya que las versiones de las librerías o el estado del ecosistema pueden estar desactualizados.

#### Flujo de Consulta de Documentación Integrada
Para validar la sintaxis de APIs, firmas de funciones, opciones de configuración o ejemplos reales de código de las librerías/SDKs candidatas, utiliza el **mecanismo de consulta de documentación técnica integrada del entorno**:
1. **Resolución de la biblioteca**: Consulta la biblioteca utilizando el resolutor de nombres del entorno para obtener su identificador único en el formato `/org/proyecto` (y versión específica si es necesario).
2. **Obtención de documentación**: Usa el identificador obtenido para consultar la documentación técnica actual, changelogs y ejemplos de código reales.
*Nota:* Si el mecanismo de consulta del entorno reporta un error de cuota o indisponibilidad, notifícalo detalladamente al usuario y utiliza tu conocimiento de entrenamiento advirtiendo explícitamente que los datos podrían no reflejar cambios recientes del ecosistema.

#### Objetivos clave de investigación:
- **Librería óptima**: Buscar la mejor librería actual para el problema específico en el stack detectado, verificando releases recientes, cambios breaking o deprecaciones de alternativas.
- **Servicios externos**: Buscar guías de integración y SDKs oficiales para el stack detectado.
- **Pitfalls y Seguridad**: Investigar problemas conocidos, avisos de seguridad (CVEs) y licencias (evitar licencias incompatibles como AGPL).
- **Adopción**: Verificar que la librería esté activamente mantenida (evitar recomendar librerías sin lanzamientos en los últimos 18 meses o en modo de solo mantenimiento).

---

### Paso 4 — Aplicar reglas arquitectónicas

Leer `references/reglas-arquitectura.md` para aplicar los límites de capa correctos, patrones
prohibidos y reglas de diseño de contratos según el estilo arquitectónico encontrado en `ARCHITECTURE.md`.

---

### Paso 5 — Escribir `design.md`

Leer la plantilla base desde `assets/plantilla-design.md` y usarla como estructura del archivo
de salida. Reemplazar todos los marcadores `{{...}}` con los valores reales.

Escribir el output en:
```
docs/specs/<nombre-caracteristica>/design.md
```

**Reglas de adaptación:**
- Reemplazar `{{NOMBRE_CARACTERISTICA}}`, `{{STACK}}`, `{{ESTILO_ARQUITECTONICO}}` y `{{FECHA}}` con los valores reales.
- Reemplazar `{{VERSION_REQUERIMIENTOS}}` con la versión del `requirements.md` (leída en el Paso 2).
- En la tabla de Librerías y Dependencias, completar la columna "Requisitos Relacionados (RF/RNF)" vinculando cada librería añadida a los IDs de los requisitos que solventa.
- En la sección de Contratos (DTOs e Interfaces), comentar qué DTOs e Interfaces resuelven cuáles IDs de Requisitos Funcionales (`RF-NN`) o Historias de Usuario (`HU-NN`).
- En cada bloque ADR, completar el campo `Requisitos Relacionados` indicando qué requisitos de negocio (`RF-NN` / `RNF-NN`) fundamentan o se ven afectados por la decisión.
- Omitir las secciones marcadas con `<!-- Omitir -->` si no aplican a esta característica.
- Agregar filas a las tablas según lo que requiera el diseño — nunca dejar filas vacías en el output final.
- Duplicar el bloque ADR tantas veces como decisiones significativas existan.
- Nunca escribir código de implementación ni lógica de negocio.

---

## Archivos de Referencia

| Archivo | Cuándo leer |
|---------|-------------|
| `references/reglas-arquitectura.md` | Paso 4 — para reglas de límites de capa y diseño de contratos |
| `assets/plantilla-design.md` | Paso 5 — leer antes de escribir el design.md; usar como base del output |
