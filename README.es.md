# Calma - Tu espacio de gestión emocional (TFM)

*[Read in English](README.md)*

> **Trabajo de Fin de Máster - Desarrollo de Aplicaciones Web**

**Calma** es una aplicación web diseñada con un enfoque humanista para acompañar a los usuarios en la gestión de sus emociones. Ofrece herramientas prácticas para situaciones de ansiedad, estrés o baja autoestima, facilitando el autoconocimiento y la conexión con terapeutas especializados.

---

## 📌 1. Descripción General
Este proyecto integra tecnologías modernas de desarrollo web con principios de "Calm Technology" (diseño no intrusivo). Su objetivo es proporcionar un espacio seguro y accesible donde los usuarios puedan:
*   Realizar ejercicios guiados de gestión emocional (respiración, mindfulness).
*   Mantener un **Diario Emocional** privado y seguro.
*   Registrar su progreso y hábitos.
*   Consultar un **Directorio de Terapeutas** profesionales.

## 🌟 2. Funcionalidades Principales
Para cumplir con los objetivos del proyecto, la aplicación ofrece las siguientes características clave:
*   **Autenticación y Seguridad:** Registro, inicio de sesión y recuperación de contraseñas. Acceso protegido a áreas privadas mediante Supabase Auth y RLS.
*   **Catálogo de Ejercicios Guiados:** Biblioteca de ejercicios categorizados (ansiedad, estrés, autoestima) con instrucciones paso a paso.
*   **Diario Emocional Privado:** Espacio seguro donde el usuario puede registrar diariamente su estado emocional y pensamientos íntimos.
*   **Área de Perfil y Progreso:** Seguimiento del historial de ejercicios completados y gestión de datos personales.
*   **Directorio de Profesionales:** Listado de terapeutas verificados para facilitar la búsqueda de ayuda profesional si el usuario lo requiere.

## 🛠️ 3. Stack Tecnológico
*   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Server Components).
*   **Lenguaje**: TypeScript (Tipado estricto para mayor robustez).
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/) (Diseño accesible y responsive).
*   **Backend / Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Auth Helpers, RLS).
*   **Validación**: [Zod](https://zod.dev/) (Validación de formularios en servidor con tipado estricto).
*   **Testing**: [Playwright](https://playwright.dev/) (Pruebas E2E).
*   **Extras**: Soporte PWA (Manifest), SEO optimizado, i18n (Código comentado en español).
*   **Despliegue**: Vercel.

## 🔒 4. Seguridad y Arquitectura
La seguridad es un pilar fundamental en **Calma**, dado el tratamiento de datos sensibles:
*   **Middleware**: Protección de rutas privadas (`/profile`, `/journal`) mediante `src/middleware.ts`, asegurando que solo usuarios autenticados accedan.
*   **Row Level Security (RLS)**: Políticas de base de datos en PostgreSQL que garantizan que cada usuario solo pueda leer/escribir su propio progreso (`user_progress`), perfil (`profiles`) y solicitudes de contacto (`contact_requests`).
*   **Validación en Servidor**: Esquemas Zod centralizados en `src/lib/schemas.ts` validan todos los formularios antes de interactuar con la base de datos. Los logs nunca exponen PII (emails, nombres de usuario).
*   **Autenticación**: Gestión de sesiones segura vía Supabase Auth (JWT).

## 🚀 5. Instalación y Ejecución

### Requisitos Previos
*   Node.js (v18 o superior).
*   Cuenta en Supabase (y proyecto creado).

### Pasos
1.  **Clonar el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd tfm-calma-app
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    Crea un archivo `.env.local` en la raíz:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anon
    ```

4.  **Base de Datos**:
    Ejecuta los scripts de la carpeta `migrations/` en orden numérico en el SQL Editor de Supabase para crear tablas y políticas.

5.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```
    Visita [http://localhost:3000](http://localhost:3000).

## ✅ 6. Testing
El proyecto cuenta con una suite de pruebas End-to-End (E2E) con Playwright para verificar los flujos críticos (Navegación, Auth, Carga).

Ejecutar tests:
```bash
npx playwright test
```

## 📁 7. Estructura del Proyecto
*   `src/app`: Rutas y páginas (App Router).
    *   `(auth)`: Login/Register.
    *   `exercises`: Catálogo y detalle (con lógica de completado).
    *   `journal`: Diario emocional privado (protegido por RLS).
    *   `profile`: Área privada del usuario.
    *   `therapists`: Directorio de profesionales.
*   `src/components`: UI Kit reutilizable (Navbar, Cards, Alerts).
*   `src/lib`: Esquemas de validación Zod centralizados (`schemas.ts`).
*   `src/utils`: Clientes Supabase (servidor, cliente, middleware).
*   `src/middleware.ts`: Barrera de seguridad para rutas protegidas.
*   `migrations/`: Scripts SQL ordenados para aplicar el esquema en Supabase.
*   `tests/`: Tests E2E.

## 📄 8. Presentación
El guion y esquema de la presentación para la defensa del TFM se encuentra en el archivo [SLIDES.md](./SLIDES.md).

## 🌐 9. Despliegue
URL de producción (Demo): [https://tfm-calma-app.vercel.app](https://tfm-calma-app.vercel.app)
