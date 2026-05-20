# Code-Assassins — Gestor de Proyectos y Tareas

Sistema fullstack de gestión de proyectos y tareas desarrollado para la prueba técnica de NTT Data. Implementa una arquitectura en tres capas con persistencia relacional, autenticación Basic Auth y un frontend moderno en Angular 21 con Signals.

---

## Stack tecnológico

**Backend**
- Java 17 · Spring Boot 3.2 · Spring Data JPA · Hibernate
- Spring Security (Basic Auth) · Spring Validation (JSR 380)
- Springdoc OpenAPI (Swagger UI)
- Base de datos H2 en memoria (inicializada con `gestor_de_tareas.sql`)

**Frontend**
- Angular 21 — Standalone Components, Signals, Control Flow (`@for`, `@if`)
- FormsModule (`ngModel`) · HttpClient
- CSS custom (sin librerías de UI externas)

---

## Arranque local

### 1. Backend

```bash
cd Backend

# Windows
.\mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

El servidor arranca en `http://localhost:8080`.

> **Credenciales de acceso a la API:**
> - Usuario: `admin`
> - Contraseña: `admin123`

### 2. Frontend

```bash
cd Frontend
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

> El backend debe estar corriendo antes de usar el frontend.

---

## Arquitectura del proyecto

```
Code-Assassins/
├── Backend/
│   └── src/main/java/com/codeAssasins/gestor_tareas/
│       ├── controller/       # TareaController, ProyectoController
│       ├── service/          # TareaService, ProyectoService
│       ├── repository/       # TareaRepository, ProyectoRepository
│       ├── model/            # Tarea, Proyecto
│       ├── config/           # SecurityConfig, SwaggerConfig
│       └── exception/        # GlobalExceptionHandler
└── Frontend/
    └── src/app/
        ├── app.ts            # Componente raíz, lógica principal
        ├── app.html          # Template del dashboard
        ├── app.css           # Estilos globales
        ├── task-modal/       # Modal de creación de tareas
        │   ├── task-modal.component.ts
        │   ├── task-modal.component.html
        │   └── task-modal.component.css
        ├── services/
        │   ├── tarea.ts
        │   └── proyecto.ts
        └── models/
            └── interfaces.ts
```

---

## Modelo de datos

### Relación entre entidades

```
Proyecto (1) ──────── (N) Tarea
```

Un proyecto puede tener múltiples tareas. Al eliminar un proyecto, sus tareas se eliminan en cascada (`CascadeType.ALL`).

### Proyecto

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | Generado automáticamente |
| `nombre` | String | Obligatorio |
| `descripcion` | String | Opcional |
| `estado` | String | Ej: `ACTIVO`, `PAUSADO`, `FINALIZADO` |
| `fechaInicio` | String | Opcional |
| `fechaFin` | String | Opcional |

### Tarea

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | Generado automáticamente |
| `titulo` | String | Obligatorio |
| `descripcion` | String | Opcional |
| `estado` | String | `PENDIENTE`, `EN PROGRESO`, `COMPLETADA` |
| `prioridad` | String | `BAJA`, `MEDIA`, `ALTA`, `URGENTE` |
| `fechaLimite` | String | Opcional |
| `completadaEn` | String | Se asigna automáticamente al pasar a `COMPLETADA` |
| `proyecto.id` | Long | Obligatorio — referencia al proyecto padre |

---

## Endpoints REST

### Proyectos — `/api/proyectos`

| Método | Ruta | Descripción | Query params |
|---|---|---|---|
| GET | `/api/proyectos` | Lista todos los proyectos | `nombre`, `estado` (opcionales) |
| GET | `/api/proyectos/{id}` | Detalle de un proyecto con sus tareas | — |
| POST | `/api/proyectos` | Crea un nuevo proyecto | — |
| PUT | `/api/proyectos/{id}` | Actualiza un proyecto existente | — |
| DELETE | `/api/proyectos/{id}` | Elimina el proyecto y sus tareas en cascada | — |

### Tareas — `/api/tareas`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tareas` | Lista todas las tareas |
| GET | `/api/tareas/{id}` | Detalle de una tarea |
| POST | `/api/tareas` | Crea una tarea (requiere `proyectoId` en el body) |
| PUT | `/api/tareas/{id}` | Actualiza una tarea |
| DELETE | `/api/tareas/{id}` | Elimina una tarea |

**Body de ejemplo para POST `/api/tareas`:**
```json
{
  "titulo": "Implementar endpoint GET",
  "descripcion": "Revisar controlador de tareas",
  "estado": "PENDIENTE",
  "prioridad": "ALTA",
  "proyectoId": 1
}
```

---

## Seguridad

Todos los endpoints bajo `/api/**` requieren autenticación Basic Auth. Las rutas de Swagger y las peticiones `OPTIONS` (preflight CORS) son públicas.

| Ruta | Acceso |
|---|---|
| `/api/**` | Requiere `admin` / `admin123` |
| `/swagger-ui/**` | Público |
| `/v3/api-docs/**` | Público |
| `OPTIONS /**` | Público (CORS preflight) |

---

## Documentación interactiva (Swagger)

Con el backend arrancado, accede a:

```
http://localhost:8080/swagger-ui/index.html
```

Usa las credenciales `admin` / `admin123` para autenticarte y probar los endpoints directamente desde el navegador.

---

## Base de datos

La BD H2 se inicializa automáticamente al arrancar con el script `Backend/src/main/resources/gestor_de_tareas.sql`.

Consola web H2 disponible en `http://localhost:8080/h2-console` con:
- JDBC URL: `jdbc:h2:mem:gestordb`
- Usuario: `sa`
- Contraseña: *(vacía)*

---

## Funcionalidades del frontend

- **Dashboard** con contadores en tiempo real de tareas totales, en progreso, completadas y pendientes
- **Panel de tareas** con búsqueda por título y filtro por estado
- **Panel de proyectos** con listado de proyectos y tareas asociadas
- **Modal de nueva tarea** — se abre sobre el `<body>` para evitar conflictos con `backdrop-filter`; carga los proyectos disponibles dinámicamente y requiere seleccionar uno antes de guardar
- **Indicador de progreso** visual por tarea según su estado
- Diseño responsive con soporte para móvil y tablet

---

## Manejo de errores

El backend incluye un `@ControllerAdvice` global que devuelve respuestas estructuradas:

| Código | Causa |
|---|---|
| `400 Bad Request` | Validación fallida (campo obligatorio ausente, formato incorrecto) |
| `404 Not Found` | Recurso inexistente por ID |
| `500 Internal Server Error` | Error inesperado del servidor |