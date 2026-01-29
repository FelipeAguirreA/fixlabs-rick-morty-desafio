# 🎬 Rick & Morty Explorer

Buscador de personajes de Rick and Morty con integración entre personajes y sus locaciones de origen.

---

## 📋 Requisitos

- Node.js 18 o superior
- npm

---

## 🧱 Arquitectura General

Repositorio monorepo con dos proyectos independientes:

### Backend
- NestJS + TypeScript
- Consume la API pública de Rick and Morty
- Expone el endpoint:
  - `GET /character/:id`
- Enriquece automáticamente la información del personaje con los datos de su locación de origen
- Manejo de errores (404 / errores de servicio)
- CORS habilitado para comunicación con el frontend

### Frontend
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Funcionalidades:
  - Búsqueda por nombre con **debounce (350ms)**
  - Filtro por estado (Alive / Dead / Unknown)
  - Carga de detalle desde el backend
  - Skeleton loading
  - Interfaz responsive
- Tipado estricto (sin uso de `any`)

---

## 📦 Instalación de Dependencias

### Backend (NestJS)
```bash
cd backend
npm install
```

### Frontend (Next.js)
```bash
cd frontend
npm install
```

---

## ▶️ Ejecutar en Modo Desarrollo

Necesitas abrir **dos terminales** (una para backend, otra para frontend):

### Terminal 1 – Backend
```bash
cd backend
npm run start:dev
```

Servidor disponible en: `http://localhost:3000`

Prueba rápida: `http://localhost:3000/character/1`

### Terminal 2 – Frontend
```bash
cd frontend
npm run dev
```

Aplicación disponible en: `http://localhost:3001`

---

## ⚙️ Variables de Entorno (Frontend)

Crear el archivo `frontend/.env.local` con el siguiente contenido:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

Esta variable indica la URL del backend desde donde el frontend obtiene el detalle del personaje.

---

## 🔌 Flujo de Funcionamiento

1. El usuario busca un personaje por nombre.
2. El frontend consulta la API pública de Rick and Morty (con debounce).
3. Se muestran los resultados filtrables por estado.
4. Al seleccionar un personaje:
   - El frontend llama al backend `GET /character/:id`
   - El backend obtiene y enriquece los datos (incluyendo locación de origen).
   - El frontend muestra la información completa del personaje.

---

## 🎯 Decisiones Técnicas

### Backend: Enriquecimiento Automático de Datos

Cuando se consulta un personaje por ID, el backend obtiene automáticamente la información de su locación de origen (nombre, tipo y dimensión).

**Beneficio:** el frontend recibe toda la información en una sola llamada, sin depender de múltiples requests.

### Frontend: Búsqueda con Debounce

La búsqueda espera 350ms desde la última pulsación antes de ejecutar la consulta.

**Beneficio:** reduce llamadas innecesarias a la API y mejora el rendimiento.

### TypeScript sin `any`

Todo el proyecto utiliza tipado explícito.

**Beneficio:** mayor seguridad, mejor mantenibilidad y detección temprana de errores.

### Arquitectura Modular

**Backend**
- Controller: manejo de rutas HTTP
- Service: lógica de negocio
- Module: organización y dependencias

**Frontend**
- page.tsx: página principal
- Componentes reutilizables (SearchBar, CharacterCard, SkeletonCard)

Cada archivo tiene una responsabilidad clara.

### Tailwind CSS

Uso de clases utility para estilado rápido y consistente.

**Beneficio:** estilos claros, mantenibles y sin CSS adicional innecesario.

### Manejo de Errores

**Backend**
- Personaje inexistente → 404
- Fallos de la API externa → error de servicio

**Frontend**
- Mensajes claros al usuario
- Skeletons visibles durante la carga

---

## 📁 Estructura del Proyecto

```
fixlabs-rm-api/
│
├── backend/                         # API con NestJS
│   ├── src/
│   │   └── rick-morty/
│   │       ├── rick-morty.controller.ts   ← Define la ruta GET /character/:id
│   │       ├── rick-morty.service.ts      ← Lógica: consulta API + enriquece datos
│   │       └── rick-morty.module.ts       ← Conecta controller + service
│   └── package.json
│
└── frontend/                        # Interfaz con Next.js
    ├── src/app/
    │   ├── page.tsx                 ← Página principal (búsqueda + filtros)
    │   └── components/
    │       ├── SearchBar.tsx        ← Input con debounce
    │       ├── CharacterCard.tsx    ← Tarjeta del personaje
    │       └── SkeletonCard.tsx     ← Animación de carga
    └── package.json
```

---
