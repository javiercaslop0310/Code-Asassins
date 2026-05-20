# Code-Asassins
# Gestor de Proyectos y Tareas - Prueba Técnica NTT Data

Este repositorio contiene el sistema fullstack de gestión de proyectos y tareas diseñado para la evaluación técnica de NTT Data. El proyecto implementa una arquitectura en tres capas, persistencia de datos relacional, validaciones estrictas y seguridad mediante Spring Security.

---

## 1. Arquitectura y Diseño del Sistema

El backend ha sido desarrollado siguiendo un patrón de arquitectura MVC estructurado en tres capas principales para garantizar la escalabilidad y el mantenimiento del código:

* **Controladores (@RestController):** Gestionan las peticiones HTTP, validan la entrada de datos a través de Jakarta Validation y devuelven las respuestas estructuradas en formato JSON.
* **Servicios (@Service):** Centralizan la lógica de negocio. Se encargan de la asignación automática de fechas, gestión de estados por defecto y procesamiento de filtros de búsqueda.
* **Repositorios (@Repository):** Interfaces basadas en Spring Data JPA que abstraen las operaciones de la base de datos H2.

---

## 2. Stack Tecnológico

**Backend:**
* Java 17 (LTS)
* Spring Boot 3.2.12
* Spring Data JPA & Hibernate
* Spring Security (Basic Authentication)
* Spring Validation (JSR 380)
* Springdoc OpenAPI (Swagger UI)
* Base de datos H2 (In-memory)
* Lombok

**Frontend:**
* Angular 21 (Standalone Components, Signals)
* Node.js & npm

---

## 3. Base de Datos y Persistencia

El sistema utiliza una base de datos relacional en memoria (H2) que se autoconfigura e inicializa mediante el script `gestor_de_tareas.sql` al arrancar la aplicación.

**Modelo Relacional (1:N):**
* **Proyectos:** Entidad principal. Cuenta con eliminación en cascada (`CascadeType.ALL`), lo que significa que al eliminar un proyecto, se eliminan automáticamente todas sus tareas asociadas.
* **Tareas:** Entidad hija. Contiene una clave foránea referenciando al proyecto padre. La serialización JSON está protegida con `@JsonIgnore` para evitar ciclos de recursividad.

---

## 4. Seguridad y Autenticación

La API REST está protegida globalmente mediante Spring Security.

* **Autenticación requerida:** Se utiliza autenticación básica (Basic Auth) para todos los endpoints de negocio (`/api/proyectos` y `/api/tareas`).
* **Credenciales de acceso:** * Usuario: `admin`
    * Contraseña: `admin123`
* **CORS y Accesibilidad:** Las peticiones `OPTIONS` (necesarias para la integración con Angular) y las rutas de documentación de Swagger han sido configuradas como públicas (`permitAll()`).

---

## 5. Manejo Global de Excepciones

El sistema incluye un interceptor global (`@ControllerAdvice`) que formatea los errores del servidor antes de devolverlos al cliente:

* **HTTP 400 (Bad Request):** Lanzado cuando no se superan las validaciones de datos (ej. omitir el nombre obligatorio de un proyecto). Devuelve un JSON detallando el campo y el motivo del error.
* **HTTP 404 (Not Found):** Lanzado cuando se intenta buscar, editar o eliminar un registro cuyo ID no existe en la base de datos.

---

## 6. Documentación de la API (Swagger)

La documentación interactiva de los endpoints se genera automáticamente. Una vez iniciado el servidor backend, se puede acceder a la interfaz gráfica en la siguiente ruta:

* **URL:** `http://localhost:8080/swagger-ui/index.html`

Desde esta interfaz es posible visualizar los contratos de datos y ejecutar peticiones de prueba utilizando las credenciales de administrador mencionadas anteriormente.

---

## 7. Catálogo de Endpoints REST

### Módulo de Proyectos (`/api/proyectos`)

| Método | Ruta | Descripción | Parámetros Query |
|---|---|---|---|
| **GET** | `/api/proyectos` | Lista todos los proyectos. | `nombre`, `estado` (Opcionales) |
| **GET** | `/api/proyectos/{id}` | Muestra el detalle de un proyecto y sus tareas. | Ninguno |
| **POST** | `/api/proyectos` | Crea un nuevo proyecto. | Ninguno |
| **PUT** | `/api/proyectos/{id}` | Actualiza los datos de un proyecto existente. | Ninguno |
| **DELETE** | `/api/proyectos/{id}` | Elimina un proyecto y sus tareas en cascada. | Ninguno |

### Módulo de Tareas (`/api/tareas`)

| Método | Ruta | Descripción |
|---|---|---|
| **POST** | `/api/tareas` | Crea una tarea asignada a un proyecto (requiere `proyecto.id` en el JSON). |
| **PUT** | `/api/tareas/{id}` | Actualiza una tarea. Si el estado es "COMPLETADA", registra la fecha actual. |
| **DELETE** | `/api/tareas/{id}` | Elimina una tarea de forma individual. |

---

## 8. Instrucciones de Arranque Local

### Despliegue del Backend
1. Navegar al directorio del backend: `cd Backend`
2. Ejecutar la aplicación mediante Maven Wrapper:
   * **Windows:** `.\mvnw spring-boot:run`
   * **Linux/macOS:** `./mvnw spring-boot:run`
3. El servidor iniciará en `http://localhost:8080`.

### Despliegue del Frontend
1. Navegar al directorio del frontend: `cd Frontend`
2. Instalar las dependencias del proyecto: `npm install`
3. Iniciar el servidor de desarrollo: `ng serve`
4. Acceder a la aplicación desde el navegador: `http://localhost:4200`