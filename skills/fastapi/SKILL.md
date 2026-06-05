---
name: fastapi
description: >
  Use this skill whenever the user asks to create, scaffold, or structure a
  FastAPI project. Applies to: async endpoints, SQLModel integration, Pydantic
  schemas, dependency injection, Alembic migrations, project layout, or any
  FastAPI best-practice question.
---

# FastAPI — Best Practices

## Stack estándar

- **FastAPI** + **SQLModel** (async)
- **Alembic** para migraciones
- **PostgreSQL** como base de datos principal
- **Pydantic v2** para schemas

## Estructura de proyecto

```
app/
├── api/
│   ├── deps.py          # dependencias inyectables
│   └── v1/
│       └── routes/
├── core/
│   ├── config.py        # Settings con pydantic-settings
│   └── security.py
├── models/              # SQLModel table models
├── schemas/             # Pydantic request/response schemas
├── services/            # lógica de negocio
└── main.py
```

## Convenciones

1. Todos los endpoints deben ser `async def`.
2. Usar `AsyncSession` de SQLAlchemy (no el de SQLModel directamente).
3. Separar `Table` models de `Schema` models — no mezclar.
4. Responses siempre tipadas con schema explícito.
5. Nunca exponer el modelo de BD directamente en la response.

## Ejemplo base

```python
# app/api/deps.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import async_session_maker

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session
```

```python
# app/api/v1/routes/items.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_session
from app.schemas.item import ItemCreate, ItemRead
from app.services.item_service import create_item

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemRead)
async def create(payload: ItemCreate, db: AsyncSession = Depends(get_session)):
    return await create_item(db, payload)
```

## Errores comunes a evitar

- No usar `session.exec()` con `AsyncSession` de SQLAlchemy — usar `session.execute()`.
- No importar `AsyncSession` desde `sqlmodel` — importar desde `sqlalchemy.ext.asyncio`.
- No definir relaciones bidireccionales sin `lazy="selectin"` en modo async.
