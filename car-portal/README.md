# Portal de Venta de Autos con IA (Versión Inicial)

Este es el repositorio para un portal de venta de autos multicliente, moderno y potenciado por IA. Esta es una versión inicial que sienta las bases de la arquitectura del proyecto.

## Características Implementadas

*   **Plataforma Multicliente:** El sistema soporta dos tipos de roles:
    *   **Super Administrador:** Tiene acceso a un panel privado para ver todos los clientes y todos los autos de la plataforma.
    *   **Administrador de Cliente:** Cada cliente (concesionario) tiene sus propios usuarios administradores que pueden gestionar su inventario.
*   **Portal Público:** Una página de inicio que muestra todos los autos y páginas de detalle para cada vehículo.
*   **Contenido Enriquecido (Prueba de Concepto):** La página de detalle del auto muestra información adicional como "Sabías que...", comentarios positivos y estadísticas. Actualmente, estos datos se cargan desde la base de datos (a partir del script de seeding).
*   **Autenticación Segura:** Sistema de inicio de sesión robusto implementado con NextAuth.js.
*   **Panel de Cliente:** Un dashboard protegido donde los clientes pueden ver y añadir nuevos autos a su inventario.
*   **Funcionalidad de Eliminar Autos:** Tanto los clientes como el superadministrador pueden eliminar listados de autos.

## Stack Tecnológico

*   **Framework:** Next.js (con App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **ORM:** Prisma
*   **Autenticación:** NextAuth.js
*   **Base de Datos:** PostgreSQL (diseñado y probado con Neon)

---

## Cómo Empezar (Setup)

Sigue estos pasos para poner en marcha el proyecto localmente.

### 1. Clona el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd car-portal
```

### 2. Instala las Dependencias

```bash
npm install
```

### 3. Configura la Base de Datos en Neon

Este proyecto está diseñado para funcionar con una base de datos PostgreSQL gratuita de Neon.

1.  **Crea una cuenta en Neon:** Ve a [Neon](https://neon.tech/) y regístrate para obtener una cuenta gratuita.
2.  **Crea un nuevo proyecto:** Sigue las instrucciones para crear un nuevo proyecto. Neon te proporcionará una base de datos PostgreSQL.
3.  **Obtén la URL de conexión:** En el dashboard de tu proyecto en Neon, busca la URL de conexión de la base de datos. Se verá algo así como:
    ```
    postgresql://user:password@ep-ancient-sound-a2bcdefg.eu-central-1.aws.neon.tech/dbname?sslmode=require
    ```
    **Importante:** Asegúrate de que la URL que uses para Prisma **incluya `?pgbouncer=true`** para un pooling de conexiones eficiente. Deberás añadir `&schema=public` al final si no está presente. Tu URL final debería parecerse a esto:
    ```
    postgresql://user:password@...aws.neon.tech/dbname?sslmode=require&pgbouncer=true&schema=public
    ```

### 4. Configura las Variables de Entorno

Crea un archivo llamado `.env` en la raíz del directorio `car-portal`. Copia y pega el siguiente contenido, reemplazando los valores con tus propias credenciales.

```env
# URL de la base de datos que obtuviste de Neon
DATABASE_URL="TU_URL_DE_CONEXION_DE_NEON"

# Un secreto aleatorio para NextAuth.js. Puedes generar uno aquí: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="TU_SECRETO_PARA_NEXTAUTH"
```

### 5. Aplica las Migraciones y Puebla la Base de Datos

Estos comandos prepararán tu base de datos Neon y la llenarán con los datos de prueba (superadmin, clientes y autos).

```bash
npx prisma migrate deploy
npm run db:seed
```
*`migrate deploy` es el comando recomendado para aplicar migraciones en entornos de producción y staging.*

### 6. Inicia el Servidor de Desarrollo

```bash
npm run dev
```

¡Y listo! La aplicación debería estar corriendo en `http://localhost:3000`.

**Credenciales de Prueba:**
*   **Super Admin:** `superadmin@example.com` / `superadmin_password`
*   **Cliente 1:** `admin@automundo.com` / `client1_password`
*   **Cliente 2:** `admin@carrosdelsol.com` / `client2_password`

---

## Próximos Pasos y Tareas Pendientes (TODO)

Esta es una base sólida, pero la visión completa del proyecto es mucho más grande. Los siguientes pasos lógicos son:

*   **[TODO] Conectar una IA Real:** Integrar un modelo de lenguaje (como GPT-4, Llama, etc.) para generar dinámicamente el contenido de `CarModelInfo` cuando se añade un nuevo tipo de auto.
*   **[TODO] Implementar Funcionalidad de Editar:** Añadir los formularios y la lógica para que los clientes puedan editar sus listados de autos.
*   **[TODO] Herramientas de Marketing y SEO:** Desarrollar las funcionalidades automáticas de generación de estrategias SEO y contenido para redes sociales.
*   **[TODO] Sistema de Subida de Imágenes:** Reemplazar las URLs de imágenes por un sistema de subida de archivos real a un servicio de almacenamiento (como S3, Cloudinary, etc.).
*   **[TODO] Funcionalidades de Super Admin:** Expandir el panel de administración para incluir la gestión de clientes (crear, editar, suspender) y el sistema de cobros.