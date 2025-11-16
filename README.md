# FindPaws - Aplicación de Reporte y Adopción de Mascotas

FindPaws es una aplicación web diseñada para ayudar a la comunidad a reportar mascotas perdidas o encontradas, así como a publicar mascotas disponibles para adopción. El objetivo es centralizar la información y facilitar el reencuentro de las mascotas con sus dueños o la búsqueda de un nuevo hogar.

## Características Principales

-   **Mapa Interactivo**: Visualiza los reportes en un mapa en tiempo real con pines de colores según el estado de la mascota.
-   **Autenticación de Usuarios**: Sistema de registro e inicio de sesión seguro con contraseñas cifradas y tokens JWT.
-   **Reportes Detallados**: Formularios para crear reportes de mascotas perdidas, encontradas o en adopción.
-   **Perfiles de Usuario**: Cada usuario tiene un perfil donde puede ver su información y cerrar sesión.
-   **Diseño Responsivo**: Pensado para funcionar como una aplicación móvil en su versión web.

---

## Tecnologías Utilizadas

Este proyecto está construido con una arquitectura moderna separando el frontend del backend.

### Frontend (Cliente)

-   **React.js**: Librería principal para construir la interfaz de usuario.
-   **Vite**: Herramienta de desarrollo y empaquetado de alta velocidad.
-   **Tailwind CSS**: Framework de CSS para un diseño rápido y personalizable.
-   **Axios**: Cliente HTTP para realizar peticiones a la API del backend.
-   **JavaScript (ES6+)**: Lenguaje de programación principal con sintaxis JSX.

### Backend (Servidor)

-   **Node.js**: Entorno de ejecución para JavaScript en el servidor.
-   **Express.js**: Framework para construir la API REST.
-   **MongoDB**: Base de datos NoSQL para almacenar toda la información de usuarios y mascotas.
-   **Mongoose**: Librería de modelado de objetos (ODM) para interactuar con MongoDB de forma estructurada.
-   **JSON Web Tokens (JWT)**: Para manejar sesiones y proteger rutas de la API.
-   **Bcrypt.js**: Para el cifrado seguro de las contraseñas de los usuarios.
-   **CORS**: Middleware para permitir la comunicación entre el frontend y el backend.
-   **Dotenv**: Para la gestión de variables de entorno y claves secretas.

---

## Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

-   Node.js y npm instalados.
-   MongoDB Community Server instalado y corriendo en tu máquina.

### Instalación

1.  Clona el repositorio en tu máquina local.
2.  Instala las dependencias del frontend (en la carpeta raíz `findpaws`):
    ```bash
    npm install
    ```
3.  Instala las dependencias del backend (navega a la carpeta `findpaws/public/backend`):
    ```bash
    npm install
    ```

### Ejecución

1.  **Iniciar el Backend**: En la terminal ubicada en `findpaws/public/backend`, ejecuta:
    ```bash
    npm start
    ```
    El servidor correrá en `http://localhost:5001`.

2.  **Iniciar el Frontend**: En otra terminal, desde la raíz del proyecto (`findpaws`), ejecuta:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

