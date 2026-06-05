# Ejemplo de uso

Este archivo muestra una ejecución completa del skill para **una característica**: la entrada del usuario y el documento de requerimientos que se genera a partir de ella. Úsalo como referencia del nivel de detalle y formato esperados.

El documento resultante se guardaría en `docs/specs/autenticacion-de-usuarios/requirements.md`.

---

## Entrada del usuario

> "Necesito una app donde los usuarios puedan registrarse con correo y contraseña y recuperar su clave."

## Salida generada

```markdown
# Requerimiento — Autenticación de usuarios

| Campo | Valor |
|-------|-------|
| Característica | Autenticación de usuarios |
| Versión | 1.0 |
| Fecha | 2026-06-05 |
| Autor(es) | Equipo de desarrollo |
| Estado | Borrador |

---

## 1. Introducción

### 1.1 Propósito
Permitir que los usuarios creen una cuenta con correo y contraseña, inicien sesión y recuperen el acceso cuando olvidan su clave.

### 1.2 Alcance
Incluye el registro de cuentas, el inicio de sesión y la recuperación de contraseña. No incluye la gestión de roles y permisos ni la autenticación con proveedores externos (Google, etc.), que se documentarían como características aparte.

### 1.3 Dependencias
- Requiere un servicio de envío de correo para los enlaces de recuperación.
- Las características que exijan usuario autenticado dependen de esta.

---

## 2. Requerimientos

### 2.1 Requisitos funcionales

| ID | Requisito | Descripción |
|------|-----------|-------------|
| RF-01 | Registro de usuario | El sistema permite registrarse con un correo y una contraseña. |
| RF-02 | Inicio de sesión | El sistema permite autenticarse con las credenciales registradas. |
| RF-03 | Solicitud de recuperación | El sistema permite solicitar la recuperación de contraseña indicando el correo. |
| RF-04 | Restablecimiento de contraseña | El sistema permite definir una nueva contraseña mediante un enlace de recuperación. |

### 2.2 Requisitos no funcionales

| ID | Requisito | Descripción |
|-------|-----------|-------------|
| RNF-01 | Seguridad de credenciales | Las contraseñas se almacenan de forma cifrada e irreversible, nunca en texto plano. |
| RNF-02 | Caducidad del enlace | El enlace de recuperación expira a los 30 minutos y es de un solo uso. |
| RNF-03 | Política de contraseña | La contraseña exige un mínimo de 8 caracteres con al menos una letra y un número. |

### 2.3 Historias de usuario

#### HU-01 — Registro de cuenta

> **Como** visitante,
> **quiero** crear una cuenta con mi correo y contraseña,
> **para** acceder a las funciones de la aplicación.

**Requisitos relacionados:** RF-01, RNF-01, RNF-03

**Criterios de aceptación:**

\```gherkin
Escenario: Registro exitoso
  Dado que estoy en la pantalla de registro
  Cuando ingreso un correo válido y una contraseña que cumple la política
  Entonces el sistema crea la cuenta y me redirige al inicio de sesión

Escenario: Correo ya registrado
  Dado que existe una cuenta con el correo "ana@correo.com"
  Cuando intento registrarme con ese mismo correo
  Entonces el sistema muestra un error indicando que el correo ya está en uso

Escenario: Contraseña débil
  Dado que estoy en la pantalla de registro
  Cuando ingreso una contraseña que no cumple la política
  Entonces el sistema rechaza el registro e indica los requisitos de la contraseña
\```

#### HU-02 — Recuperar el acceso

> **Como** usuario registrado,
> **quiero** restablecer mi contraseña cuando la olvido,
> **para** recuperar el acceso a mi cuenta.

**Requisitos relacionados:** RF-03, RF-04, RNF-02

**Criterios de aceptación:**

\```gherkin
Escenario: Envío del enlace de recuperación
  Dado que tengo una cuenta con el correo "ana@correo.com"
  Cuando solicito recuperar mi contraseña con ese correo
  Entonces el sistema envía un enlace de recuperación a ese correo

Escenario: Restablecimiento con enlace válido
  Dado que recibí un enlace de recuperación vigente
  Cuando defino una nueva contraseña que cumple la política
  Entonces el sistema actualiza la contraseña y permite iniciar sesión con ella

Escenario: Enlace expirado
  Dado que mi enlace de recuperación tiene más de 30 minutos
  Cuando intento usarlo para cambiar la contraseña
  Entonces el sistema rechaza la operación e invita a solicitar uno nuevo
\```

---
```
