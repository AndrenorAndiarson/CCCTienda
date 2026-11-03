# Centro Comercial Colonial — Desde 1980

Tienda online responsive para catálogo de ropa y accesorios, pedidos y panel de administración.

## Requisitos
- Node.js 20 o superior recomendado.
- Proyecto Supabase.

## 1. Instalar
```bash
npm install
```
Copia `.env.example` como `.env.local` y completa las dos variables:
```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_PUBLIC_KEY
```
No subas `.env.local` a GitHub.

## 2. Preparar Supabase
1. Abre el SQL Editor del proyecto.
2. Ejecuta `supabase/schema.sql`.
3. Ejecuta `supabase/seed.sql`.
4. En Authentication > Users crea el usuario administrador con su correo y contraseña.
5. Copia el UUID del usuario y ejecuta: `insert into public.admins(user_id,email) values('UUID','correo@dominio.com');`.
6. En Authentication > URL Configuration agrega la URL local y luego la URL de Vercel.

El bucket público `productos` se crea desde `schema.sql`. Las políticas permiten lectura pública de imágenes y escritura solo a administradores.

## 3. Ejecutar localmente
```bash
npm run dev
```
Abre la URL indicada por Vite. El panel está en `/admin`.

## 4. Publicar en Vercel
1. Sube el proyecto a GitHub.
2. En Vercel importa el repositorio (preset Vite, build `npm run build`, salida `dist`).
3. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Settings > Environment Variables.
4. Despliega y registra la URL de Vercel en Supabase Authentication > URL Configuration.
5. Si cambias variables, crea un nuevo deployment.

`vercel.json` incluye la reescritura SPA para que las rutas internas funcionen al recargar.

## Funciones incluidas
- Inicio con ofertas/tendencias, categorías y productos destacados.
- Catálogo con búsqueda y detalle de producto.
- Selección de color, talla y cantidad.
- Carrito persistente en el navegador y registro de pedidos en Supabase.
- Acceso administrativo protegido por sesión y tabla `admins`.
- Gestión de productos, visibilidad y estado de pedidos.
- Diseño adaptable a escritorio, tablet y móvil.

## Importante
- Los productos visibles sin configurar Supabase son datos de demostración y deben reemplazarse.
- Los datos de contacto y dirección están centralizados en `src/config/tienda.ts`; confirma que sigan vigentes antes de publicar.
- El pedido público permite insertar pedidos nuevos; lectura y actualización están restringidas a administradores mediante RLS.
- No se procesa pago en línea. La entrega y el pago se coordinan con el comerciante.
