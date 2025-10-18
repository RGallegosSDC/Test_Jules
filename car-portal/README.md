# Portal de Venta de Autos con IA (Versión Final)

Este es el repositorio de un portal de venta de autos multicliente, moderno y potenciado por IA. El proyecto está completo y listo para producción, integrando tecnologías de vanguardia para ofrecer una experiencia de usuario revolucionaria.

## Características Principales

*   **Arquitectura Multicliente Robusta:**
    *   **Super Administrador:** Panel de control centralizado para gestionar clientes (crear, editar, eliminar), supervisar todos los autos de la plataforma y visualizar estadísticas clave. Incluye integración con el dashboard de Stripe para una gestión de facturación completa.
    *   **Clientes (Concesionarios):** Cada cliente tiene un portal de autoservicio para gestionar su inventario, generar contenido de marketing y administrar su suscripción.

*   **Portal Público Interactivo:**
    *   **Listado Avanzado:** Página principal con búsqueda por palabras clave y filtros por precio y año.
    *   **Páginas de Detalle Enriquecidas:** Cada auto tiene una página optimizada para SEO con una galería de imágenes y contenido único generado por IA.

*   **Inteligencia Artificial Integrada (Google Gemini):**
    *   **Análisis Automático de Modelos:** Al añadir un auto de un modelo nuevo, la IA genera y guarda automáticamente datos curiosos ("Sabías que..."), comentarios positivos y estadísticas relevantes.
    *   **Generación de Contenido de Marketing:** Los clientes pueden usar la IA para crear borradores de publicaciones atractivas para redes sociales con un solo clic.
    *   **Optimización SEO Automática:** La IA sugiere títulos y descripciones optimizados para motores de búsqueda para cada vehículo.

*   **Sistema de Suscripciones y Pagos (Stripe):**
    *   **Modelo de Suscripción:** Los clientes deben tener una suscripción activa para poder añadir autos, asegurando el modelo de negocio.
    *   **Checkout Seguro:** Integración con Stripe Checkout para un proceso de pago fácil y seguro.
    *   **Portal de Cliente de Stripe:** Los clientes pueden gestionar sus suscripciones, métodos de pago y facturas directamente.
    *   **Webhooks Automatizados:** Sincronización en tiempo real del estado de las suscripciones entre Stripe y la aplicación.

*   **Gestión de Inventario Profesional:**
    *   **CRUD Completo de Autos:** Los clientes pueden crear, ver, editar y eliminar sus listados de autos.
    *   **Carga de Imágenes a la Nube:** Sistema de carga de archivos robusto que sube las imágenes a un servicio de almacenamiento en la nube (Vercel Blob), optimizando el rendimiento y los costes.

## Stack Tecnológico

*   **Framework:** Next.js (App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **ORM:** Prisma
*   **Autenticación:** NextAuth.js
*   **Base de Datos:** PostgreSQL (compatible con Neon)
*   **IA:** Google Gemini
*   **Pagos:** Stripe
*   **Almacenamiento de Archivos:** Vercel Blob

---

## Cómo Empezar (Setup Local)

### 1. Prerrequisitos
- Node.js y npm
- Una cuenta gratuita en [Neon](https://neon.tech/) para la base de datos PostgreSQL.
- Una cuenta de desarrollador en [Stripe](https://dashboard.stripe.com/register).
- Una clave de API de [Google AI Studio](https://aistudio.google.com/) para Gemini.

### 2. Instalación
1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd car-portal
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto. Copia el contenido de `.env.example` (si existe, o usa la siguiente plantilla) y rellena las variables:

```env
# Base de Datos (Neon)
# Asegúrate de que la URL incluye ?sslmode=require&pgbouncer=true
DATABASE_URL="TU_URL_DE_CONEXION_DE_NEON"

# Autenticación
NEXTAUTH_SECRET="GENERA_UN_SECRETO_ALEATORIO"
NEXTAUTH_URL="http://localhost:3000"

# IA (Google Gemini)
GEMINI_API_KEY="TU_API_KEY_DE_GEMINI"

# Stripe
STRIPE_SECRET_KEY="TU_CLAVE_SECRETA_DE_STRIPE"
STRIPE_WEBHOOK_SECRET="TU_SECRETO_DEL_WEBHOOK"
NEXT_PUBLIC_STRIPE_PRICE_ID="ID_DEL_PRECIO_DE_TU_PRODUCTO_EN_STRIPE"

# Vercel Blob (para subida de imágenes)
BLOB_READ_WRITE_TOKEN="TU_TOKEN_DE_VERCEL_BLOB"
```

### 4. Base de Datos y Datos de Prueba
Aplica las migraciones de la base de datos y puebla con datos de prueba:
```bash
npx prisma migrate deploy
npm run db:seed
```

### 5. Inicia el Servidor
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

**Credenciales de Prueba:**
*   **Super Admin:** `superadmin@example.com` / `superadmin_password`
*   **Cliente 1:** `admin@automundo.com` / `client1_password`
*   **Cliente 2:** `admin@carrosdelsol.com` / `client2_password`
---

## Posibles Mejoras Futuras

El proyecto actual es una base sólida y completa. Las siguientes características podrían implementarse para expandir aún más la plataforma:

*   **Personalización de Temas:** Permitir que el superadministrador personalice la apariencia visual del portal.
*   **Analíticas Avanzadas:** Integrar un dashboard de analíticas más detallado sobre el comportamiento de los usuarios.
*   **Sistema de Comentarios Públicos:** Permitir que los visitantes dejen comentarios y valoraciones en los autos.

Este proyecto es una demostración completa de cómo construir una aplicación web moderna, escalable y rica en funcionalidades utilizando las mejores herramientas del ecosistema de JavaScript.