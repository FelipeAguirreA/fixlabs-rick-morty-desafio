# 🎬 Rick & Morty Explorer

Buscador de personajes de Rick and Morty con integración entre personajes y sus locaciones de origen.

---

## 📋 Requisitos

- Node.js 18 o superior
- npm

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

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
El backend estará disponible en: `http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:3001`

Abre tu navegador en [http://localhost:3001](http://localhost:3001) para ver la aplicación.

---

## 🎯 Decisiones Técnicas

### 1. **Backend: Enriquecimiento Automático de Datos**
**¿Por qué?** Cuando consultas un personaje por ID, el backend automáticamente obtiene información extra de su locación de origen (nombre, tipo, dimensión) y la incluye en la respuesta.

**Beneficio:** El frontend recibe todos los datos en una sola llamada, sin tener que hacer consultas adicionales.

**Ejemplo:** 
```
GET /character/1 
→ Devuelve personaje + datos completos de su ubicación de origen
```

### 2. **Frontend: Búsqueda con Debounce (350ms)**
**¿Por qué?** Cuando se escribe en el buscador, el sistema espera 350ms después de tu última letra antes de buscar.

**Beneficio:** Evita hacer demasiadas peticiones mientras se escribe. Si escribes "Rick", no busca por "R", "Ri", "Ric", "Rick" (4 veces), sino solo una vez cuando terminas de escribir.

**Implementado en:** `SearchBar.tsx`

### 3. **TypeScript Sin 'any'**
**¿Por qué?** Todo el código usa tipos específicos (string, number, interfaces) en lugar del tipo genérico `any`.

**Beneficio:** El editor avisa de errores mientras se escribe código, antes de ejecutar. Es como tener un asistente que revisa el código constantemente.

### 4. **Arquitectura Modular**
**Backend:**
- `Controller` → Recibe las peticiones HTTP
- `Service` → Contiene la lógica del negocio
- `Module` → Organiza y conecta todo

**Frontend:**
- `page.tsx` → Página principal
- Componentes separados → `SearchBar`, `CharacterCard`, `SkeletonCard`

**Beneficio:** Cada archivo tiene una responsabilidad clara. Si algo falla, sabes dónde buscar.

### 5. **Tailwind CSS**
**¿Por qué?** Framework de CSS que usa clases utility (ej: `bg-blue-500`, `p-4`, `rounded-lg`).

**Beneficio:** Se escriben estilos rápidamente sin salir del HTML. Fácil de mantener.

### 6. **Manejo de Errores**
**Backend:**
- Si el personaje no existe → Error 404
- Si la API externa falla → Error 500

**Frontend:**
- Muestra mensajes amigables al usuario
- Muestra "skeletons" (placeholders animados) mientras carga

---

## 📁 Estructura Simplificada

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

## 🔌 ¿Cómo Funciona?

1. **Buscas un personaje** → El frontend busca en la API de Rick & Morty y muestra resultados
2. **Seleccionas un personaje** → El frontend llama a tu backend `GET /character/:id`
3. **EL backend:**
   - Obtiene datos del personaje
   - Si tiene una ubicación de origen, la consulta automáticamente
   - Devuelve todo junto al frontend
4. **El frontend muestra** la tarjeta completa con toda la información

---


**¡A explorar el multiverso de Rick & Morty!** 🚀
