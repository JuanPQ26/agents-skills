# Reglas de Arquitectura

Este archivo define reglas universales para límites de capa, contratos y anti-patrones.
Estas reglas son **agnósticas al stack** — aplican independientemente de si el proyecto usa
.NET, Flutter, Node.js, Python, Go u otro stack.

El estilo arquitectónico específico (Clean Architecture, DDD, Hexagonal, etc.) se lee del
`ARCHITECTURE.md`. Aplicar solo las reglas relevantes al estilo detectado.

---

## Tabla de Contenidos

1. [Reglas Universales de Capa](#1-reglas-universales-de-capa)
2. [Clean Architecture](#2-clean-architecture)
3. [Domain-Driven Design (DDD)](#3-domain-driven-design-ddd)
4. [Arquitectura Hexagonal (Puertos y Adaptadores)](#4-arquitectura-hexagonal-puertos-y-adaptadores)
5. [Monolito Modular](#5-monolito-modular)
6. [Microservicios](#6-microservicios)
7. [Reglas de Diseño de Contratos](#7-reglas-de-diseño-de-contratos)
8. [Anti-Patrones Universales](#8-anti-patrones-universales)

---

## 1. Reglas Universales de Capa

Estas aplican a **todo** estilo arquitectónico:

- **La dirección de dependencia siempre es hacia adentro** — las capas externas dependen de las internas, nunca al revés.
- **La infraestructura siempre es la más externa** — bases de datos, clientes HTTP, brokers de mensajes, sistemas de archivos.
- **Las reglas de negocio nunca tocan I/O directamente** — siempre a través de una abstracción (interfaz, puerto, repositorio).
- **Los contratos (DTOs, interfaces, eventos) se definen en los límites** — no enterrados dentro de implementaciones.
- **Una librería por responsabilidad por capa** — no usar dos ORMs, dos clientes HTTP ni dos validadores.

---

## 2. Clean Architecture

Se detecta cuando `ARCHITECTURE.md` menciona: Clean Architecture, Casos de Uso, capa de Entidades, Interactors.

```
Presentación → Aplicación → Dominio ← Infraestructura
```

### La capa de Dominio posee:
- Entidades (objetos de negocio con identidad)
- Objetos de Valor (inmutables, igualdad por valor)
- Eventos de Dominio (levantados por agregados)
- Interfaces de Repositorio (definidas aquí, implementadas en Infraestructura)
- Servicios de Dominio (reglas de negocio puras, sin estado, sin I/O)
- Raíces de Agregado

**Prohibido en Dominio:**
- ❌ Referencias a frameworks
- ❌ Operaciones de I/O (DB, HTTP, archivos)
- ❌ DTOs de capas externas
- ❌ Contenedores de inyección de dependencias

### La capa de Aplicación posee:
- Casos de Uso / Interactors (uno por operación de negocio)
- Objetos Command / Query
- Servicios de Aplicación (orquestación, no reglas de negocio)
- Interfaces de puerto para infraestructura (IEmailSender, IFileStorage, IEventBus)
- Mapeo entre entidades de Dominio y DTOs

**Prohibido en Aplicación:**
- ❌ Acceso directo a DB (solo a través de interfaces de repositorio)
- ❌ Llamadas HTTP directas (solo a través de interfaces de puerto)
- ❌ Preocupaciones de UI/framework

### La capa de Infraestructura posee:
- Implementaciones de Repositorio
- Clientes y SDKs de APIs externas
- Clientes de mensajería (Kafka, RabbitMQ, SQS, etc.)
- Adaptadores de almacenamiento de archivos
- Servicios de Email / SMS
- Integraciones de proveedores de autenticación
- Esquema de DB / migraciones

**Prohibido en Infraestructura:**
- ❌ Lógica de negocio
- ❌ Ser referenciada directamente por Dominio o Aplicación

### La capa de Presentación posee:
- Controladores / Endpoints / Rutas / Handlers
- Validación de requests
- Serialización de respuestas
- Middleware de autenticación
- Documentación de API
- Componentes UI / pantallas / vistas

**Prohibido en Presentación:**
- ❌ Lógica de negocio en controladores
- ❌ Llamadas directas a repositorios o DB

---

## 3. Domain-Driven Design (DDD)

Se detecta cuando `ARCHITECTURE.md` menciona: DDD, Bounded Context, Aggregate, Domain Event, Ubiquitous Language.

Reglas adicionales sobre Clean Architecture:

- **Agregados**: definen el límite transaccional. Solo una raíz de agregado por transacción.
- **Bounded Contexts**: cada contexto tiene su propio modelo. Nunca compartir objetos de dominio entre contextos — usar ACL (Anti-Corruption Layer) para traducir.
- **Eventos de Dominio**: levantados dentro de los agregados tras el cambio de estado; despachados por Aplicación después de la persistencia.
- **Repositorio por Raíz de Agregado**: un repositorio por agregado, no por entidad.
- **Lenguaje Ubicuo**: los nombres en el código (clases, métodos, campos) deben coincidir con el lenguaje del dominio de los requerimientos.

### Preguntas clave a extraer de los requerimientos cuando el estilo es DDD:
- ¿Cuáles son los agregados? (unidades transaccionales)
- ¿Cuáles son los bounded contexts? (¿cruzan contextos?)
- ¿Qué eventos de dominio produce esta característica?
- ¿Cuál es el lenguaje ubicuo de esta característica?

---

## 4. Arquitectura Hexagonal (Puertos y Adaptadores)

Se detecta cuando `ARCHITECTURE.md` menciona: Hexagonal, Ports and Adapters, adaptadores driving/driven.

```
[Adaptadores Conductores] → [Puertos] → [Núcleo de Aplicación] → [Puertos] → [Adaptadores Conducidos]
```

- **Puertos**: interfaces definidas por el Núcleo de Aplicación.
  - Puertos conductores: llamados por actores externos (API, CLI, UI)
  - Puertos conducidos: llamados por el núcleo para alcanzar sistemas externos (DB, servicios)
- **Adaptadores**: implementaciones de puertos.
  - Adaptadores conductores: controladores REST, handlers CLI, consumidores de eventos
  - Adaptadores conducidos: repositorios de DB, clientes HTTP, publicadores de mensajes

**Regla de diseño**: toda dependencia externa — DB, HTTP, mensajería, sistema de archivos — debe estar detrás de un puerto conducido.

---

## 5. Monolito Modular

Se detecta cuando `ARCHITECTURE.md` menciona: Modular Monolith, módulos, límites de módulo.

- Cada módulo es **autocontenido**: su propio dominio, aplicación, infraestructura y código de presentación.
- Los módulos se comunican solo a través de **interfaces públicas** o **eventos internos** — nunca importando internos.
- **Kernel compartido**: solo preocupaciones transversales verdaderamente compartidas (logging, primitivos de auth, errores base) van en un kernel compartido.
- **Sin tablas de base de datos compartidas** entre módulos — cada módulo posee su esquema.

---

## 6. Microservicios

Se detecta cuando `ARCHITECTURE.md` menciona: microservicios, service mesh, API gateway, inter-service.

- **Cada servicio posee sus datos** — sin base de datos compartida.
- **Comunicación síncrona**: REST o gRPC — usar solo para necesidades de tiempo real y baja latencia.
- **Comunicación asíncrona**: broker de mensajes (Kafka, RabbitMQ, SQS) — preferir para consistencia eventual.
- **Contratos de servicio**: definir contratos de API (OpenAPI, Protobuf) como la interfaz entre servicios — no DTOs internos.
- **Patrón Saga** para transacciones distribuidas:
  - Orquestación: un servicio coordinador llama a otros en secuencia
  - Coreografía: los servicios reaccionan a eventos publicados por otros
- **Circuit breaker**: requerido para cualquier llamada síncrona entre servicios.

---

## 7. Reglas de Diseño de Contratos

Estas aplican universalmente independientemente del estilo arquitectónico.

### DTOs
- Nunca exponer entidades de dominio directamente como DTOs — mapear en el límite.
- Los DTOs son solo contenedores de datos — sin comportamiento, sin métodos.
- Los DTOs de entrada llevan exactamente lo que necesita el caso de uso, nada más.
- Los DTOs de salida llevan exactamente lo que necesita el consumidor, nada más.

### Interfaces / Puertos
- Definidos en la capa más interna que los necesita (Dominio o Aplicación).
- Implementados en la capa más externa que puede cumplirlos (Infraestructura).
- Nombrar interfaces por lo que representan, no por cómo se implementan (`IUserRepository`, no `ISqlUserRepository`).
- Mantener interfaces enfocadas — una responsabilidad por interfaz (Principio de Segregación de Interfaces).

### Eventos / Mensajes
- Los eventos son inmutables — todos los campos se establecen en la creación, sin setters.
- Los eventos se nombran en tiempo pasado (`UsuarioRegistrado`, `PagoFallido`, `PedidoEnviado`).
- Los eventos llevan solo los datos que necesitan los consumidores — no embeber entidades completas.
- Los eventos deben versionarse si cruzan límites de servicio.

### Contratos de API (REST / gRPC / GraphQL)
- Definir formas de request/response explícitamente.
- Validar la entrada en el límite de presentación — nunca confiar en la entrada del exterior.
- Retornar formas de error consistentes en todos los endpoints.

---

## 8. Anti-Patrones Universales

Marcar estos en la sección de Restricciones y Advertencias del diseño si los requerimientos sugieren riesgo.

| Anti-Patrón | Descripción | Enfoque correcto |
|---|---|---|
| Modelo de Dominio Anémico | Entidades sin comportamiento; toda la lógica en servicios | Mover el comportamiento a las entidades |
| Controlador Gordo | Lógica de negocio en controladores | Mover a casos de uso / servicios de aplicación |
| Abstracción con Fugas | Tipos ORM / conceptos de DB visibles en capas internas | Usar tipos de dominio; mapear en el límite de infraestructura |
| Servicio Dios | Un servicio/clase haciendo todo | Dividir por caso de uso o concepto de dominio |
| Cirugía de Escopeta | Un cambio requiere ediciones en muchos lugares no relacionados | Agrupar por cohesión, no por tipo |
| Estado Mutable Compartido | Múltiples capas/servicios escribiendo en los mismos datos sin coordinación | Definir propiedad clara; usar eventos para actualizaciones entre límites |
| Llamada Directa a Infraestructura | Aplicación o Dominio llamando directamente a DB/HTTP | Introducir repositorio o interfaz de puerto |
| Obsesión por Primitivos | Usar primitivos (string, int) para conceptos de dominio | Introducir Objetos de Valor |
