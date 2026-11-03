# Centro Comercial Colonial — Tienda online

Tienda (celular y escritorio) + panel para administrador y vendedores. React + Vite + Supabase, lista para Vercel.

## PASO A PASO (sin tecnicismos)

### A. En Supabase
1. Entra a https://supabase.com y crea un proyecto nuevo (guarda la contraseña de base de datos que te pida).
2. Menú **SQL Editor → New query**. Abre el archivo `supabase/01_schema.sql`, copia TODO, pégalo y pulsa **Run**. Debe decir "Success". Esto crea tablas, permisos y el almacén de imágenes `productos` (público) automáticamente.
3. Menú **Authentication → Users → Add user → Create new user**. Escribe TU correo y TU contraseña y marca **Auto Confirm User**. Ese será el administrador.
4. Menú **Authentication → Sign In / Providers → Email**: apaga **"Confirm email"** y guarda. (Necesario para que puedas crear vendedores desde el panel.)
5. De nuevo **SQL Editor → New query**. Abre `supabase/02_administrador.sql`, cambia `TU_CORREO@gmail.com` por el correo del paso 3, pega y **Run**.
6. Menú **Project Settings → API** (o "API Keys"): copia la **Project URL** y la clave pública (**anon / publishable**). Las usarás en Vercel.
7. (Solo verifica) **Storage**: debe existir un bucket llamado `productos` marcado como público. Si no aparece, créalo con ese nombre exacto y activa **Public bucket**.

### B. En Vercel
1. Sube esta carpeta a un repositorio de GitHub (o usa "Import" con el ZIP descomprimido) y en https://vercel.com elige **Add New → Project** e impórtalo. Vercel detecta Vite solo.
2. Antes de pulsar Deploy, abre **Environment Variables** y agrega:
   - `VITE_SUPABASE_URL` = tu Project URL
   - `VITE_SUPABASE_ANON_KEY` = tu clave pública
   (También puedes usar el botón **Import .env** y subir un archivo `.env` con esas dos líneas; hay un modelo en `.env.example`.)
3. Pulsa **Deploy**. Si agregaste las variables después, haz **Redeploy**.

### C. Usar el sistema
- Entra a `tu-sitio.vercel.app/ingresar` (o "Acceso vendedores" en el pie de página) con el correo y contraseña del administrador.
- **Usuarios → + Nuevo usuario**: crea vendedores (o más administradores) sin volver a Supabase. Cada vendedor ve y edita solo sus productos y pedidos.
- **Productos**: crear, editar, ocultar, eliminar y subir fotos (se achican solas).
- **Pedidos**: ver pedidos y cambiar el estado (Nuevo, Confirmado, Entregado, Cancelado).
- **Ajustes**: WhatsApp, correo y dirección que muestra la tienda.
- El cliente arma su carrito, confirma sus datos, el pedido queda guardado y se abre WhatsApp con el resumen.
- Los 4 productos de ejemplo se pueden eliminar desde el panel.

## Resumen corto
**Supabase:** crear proyecto → ejecutar 01_schema.sql → crear usuario en Authentication → apagar "Confirm email" → ejecutar 02_administrador.sql (con tu correo) → copiar URL y anon key.
**Vercel:** importar proyecto → agregar las 2 variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) → Deploy.
