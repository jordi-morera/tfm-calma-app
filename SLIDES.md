# Presentación TFM: Calma - Tu espacio de gestión emocional

## Diapositiva 1: Portada
*   **Título**: Calma
*   **Subtítulo**: Plataforma web de gestión emocional y bienestar.
*   **Autor**: Jordi Morera
*   **Máster**: Desarrollo de Aplicaciones con IA
*   **Imagen**: Logo de la App o captura de la Home.

## Diapositiva 2: El Problema
*   **Contexto**: Aumento de la ansiedad y el estrés en la sociedad digital.
*   **Necesidad**: Falta de herramientas accesibles, guiadas y con diseño "calmado" que no sobreestimulen al usuario.
*   **Solución Propuesta**: Una Web App que combina ejercicios terapéuticos validados con una UX minimalista y segura.

## Diapositiva 3: Objetivos del Proyecto
1.  **Accesibilidad**: Herramientas disponibles 24/7 sin barreras técnicas.
2.  **Seguridad**: Protección rigurosa de los datos del usuario (emociones, diario).
3.  **Usabilidad**: Diseño centrado en el usuario (Human-Centered Design).

## Diapositiva 4: Stack Tecnológico (La Solución Técnica)
*   **Frontend**: Next.js 16 (App Router, Server Components y Server Actions).
*   **Estilos**: Tailwind CSS (Diseño mantenible y responsive) + UI Shadcn.
*   **Backend**: Supabase (Backend-as-a-Service escalable).
*   **Base de Datos**: PostgreSQL + RLS (Seguridad a nivel de fila y políticas granulares).
*   **Testing**: Playwright (Pruebas E2E automatizadas).

## Diapositiva 5: Funcionalidades Clave y Arquitectura Segura (Demo)
*   **Catálogo de Ejercicios**: Filtrado por necesidad (Ansiedad, Autoestima).
*   **Experiencia Guiada**: Paso a paso, audios integrados y advertencias de seguridad.
*   **Diario Emocional Privado**: Espacio seguro para el registro diario de emociones.
*   **Autenticación y Perfil Robusto**: Login, registro y validación estricta de contraseñas (reglas de complejidad) ejecutadas en servidor y cliente.
*   **Conexión Profesional**: Directorio de terapeutas.

## Diapositiva 6: Desafíos Técnicos y Soluciones
*   **Desafío**: Manejo de rutas protegidas y estado del usuario en el Servidor (SSR).
    *   *Solución*: Implementación de un Middleware en Next.js gestionando el flujo de sesión y refresco de tokens con Supabase Auth.
*   **Desafío**: Aislamiento y privacidad total de los datos (Diario Emocional).
    *   *Solución*: Implementación de Row Level Security (RLS) en PostgreSQL, garantizando a nivel de base de datos que ni siquiera por error en el código de backend un usuario pueda acceder a datos de otro.
*   **Desafío**: Mutación de datos segura y tipado estricto entre Cliente/Servidor.
    *   *Solución*: Uso de *Server Actions* nativos de Next.js con validación de esquemas **Zod** en servidor. Los datos del formulario se validan con tipos estrictos antes de cualquier operación en base de datos, redirigiendo con mensaje de error en lugar de lanzar excepciones. Los logs no exponen nunca información personal (PII).

## Diapositiva 7: Conclusiones y Futuro
*   **Logros**: MVP funcional, seguro y desplegado.
*   **Próximos Pasos**:
    *   Integración de IA: asistente terapéutico conversacional, análisis de sentimientos del diario, recomendaciones personalizadas de ejercicios y matching con terapeuta.
    *   App móvil nativa (React Native).
    *   Gamificación del progreso.

## Diapositiva 8: Preguntas
*   Espacio para dudas del tribunal.
*   Enlaces de interés: GitHub, Demo URL.
