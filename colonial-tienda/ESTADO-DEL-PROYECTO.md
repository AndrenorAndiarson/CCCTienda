# Estado de esta entrega

Esta versión reemplaza la estructura inicial incompleta e incorpora la tienda pública, detalle de producto con variantes, carrito, registro de pedidos Supabase, autenticación administrativa, catálogo administrativo y seguimiento de pedidos.

## Pendiente antes de producción
- Instalar dependencias con `npm install` y ejecutar `npm run build` en un entorno con acceso al registro npm. En el entorno de preparación de este ZIP, `npm install` agotó el tiempo de espera, por lo que no se certifica aquí una compilación exitosa.
- Ejecutar `supabase/schema.sql` y `supabase/seed.sql` en el proyecto Supabase real.
- Crear la cuenta administradora en Supabase Auth y registrar su UUID en `public.admins`.
- Configurar las dos variables de entorno en `.env.local` y en Vercel.
- Sustituir los productos/fotografías de demostración y confirmar los datos de contacto antes de publicar.
- La edición de productos permite registrar URLs de imágenes; la carga directa de archivos a Storage y el CRUD de categorías aún requieren implementación adicional.
- No se ha conectado ni desplegado ningún proyecto Supabase/Vercel desde esta entrega.
