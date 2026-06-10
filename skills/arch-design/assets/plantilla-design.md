# Diseñó: {{NOMBRE_CARACTERISTICA}}

> **Stack:** {{STACK}}
> **Estilo arquitectónico:** {{ESTILO_ARQUITECTONICO}}
> **Estado:** Borrador
> **Fecha:** {{FECHA}}
> **Basado en:** docs/specs/{{NOMBRE_CARACTERISTICA}}/requirements.md (Versión: {{VERSION_REQUERIMIENTOS}})

---

## 1. Alcance y Límites

Qué cubre esta característica arquitectónicamente. Qué capas se tocan y cuáles no.
Declarar explícitamente qué está FUERA del alcance de este diseño.

---

## 2. Responsabilidades por Capa

Mapear cada capa tocada a su responsabilidad en esta característica.
NO escribir código ni lógica — solo qué posee cada capa.

| Capa | Responsabilidad en esta característica |
|------|---------------------------------------|
| | |

---

## 3. Librerías y Dependencias

Solo las librerías que el desarrollador debe usar para esta característica. Para cada una:
propósito, por qué sobre las alternativas y los requisitos relacionados. Referenciadas con los hallazgos de investigación.

| Librería / Paquete | Versión | Propósito | Por qué sobre las alternativas | Requisitos Relacionados (RF/RNF) |
|--------------------|---------|-----------|-------------------------------|----------------------------------|
| | | | | |

> ⚠️ No agregar ninguna librería no listada aquí sin revisión arquitectónica previa.
> Las librerías ya existentes en el proyecto (del ARCHITECTURE.md) se listan solo si tienen
> un rol en esta característica.

---

## 4. Servicios Externos e Integraciones

<!-- Omitir esta sección si la característica no interactúa con sistemas externos -->

| Servicio | Rol | Método de integración | SDK / cliente | Notas |
|----------|-----|-----------------------|--------------|-------|
| | | | | |

---

## 5. Contratos

Formas de datos e interfaces únicamente. Sin implementación.

### DTOs de Entrada / Salida

```
// Entrada - Mapear a los RF-NN correspondientes (p. ej., RF-01)
{{NOMBRE_CARACTERISTICA}}Request {
  campo: tipo  // descripción
}

// Salida - Mapear a los RF-NN correspondientes (p. ej., RF-01)
{{NOMBRE_CARACTERISTICA}}Response {
  campo: tipo  // descripción
}
```

### Interfaces / Puertos

```
// Define los métodos e interfaces de negocio (vincular a HU-NN / RF-NN correspondientes)
interface I{{NOMBRE_CARACTERISTICA}} {
  nombreMetodo(params): TipoRetorno
}
```

### Eventos / Mensajes

<!-- Omitir esta sección si la característica no produce eventos de dominio -->

```
{{NOMBRE_EVENTO}} {
  campo: tipo
}
```

---

## 6. Registros de Decisiones Arquitectónicas (ADRs)

<!-- Un ADR por cada decisión significativa. Duplicar el bloque según sea necesario. -->

### ADR-01: {{TITULO_DECISION}}

- **Contexto:** Por qué fue necesaria esta decisión
- **Requisitos Relacionados:** [p. ej., RF-02, RNF-01]
- **Decisión:** Qué se eligió
- **Justificación:** Por qué esto, respaldado por los hallazgos de investigación
- **Compromisos:** Qué se gana / qué se acepta

---

## 7. Restricciones y Advertencias

- ⚠️ <!-- Restricción de runtime o integración -->
- 🔒 <!-- Restricción de seguridad o cumplimiento normativo -->
- 🚫 <!-- Qué NO debe hacer el desarrollador en esta característica -->
- 📌 <!-- Nota de fijación de versión de dependencia si es relevante -->
