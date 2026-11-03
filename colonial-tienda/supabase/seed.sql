-- Datos iniciales ilustrativos. No representan inventario real.
insert into public.categorias(slug,nombre,descripcion,orden) values ('hombres','Hombres','Moda masculina',1),('mujeres','Mujeres','Moda femenina',2),('ninos','Niños','Moda infantil',3) on conflict(slug) do nothing;
insert into public.ajustes(clave,valor) values ('tienda','{"nombre":"Centro Comercial Colonial","slogan":"Desde 1980","whatsapp":"59179363865","entrega":"Consultar"}'::jsonb) on conflict(clave) do nothing;
-- Crear el usuario en Supabase > Authentication > Users y luego registrar su UUID:
-- insert into public.admins(user_id,email) values('UUID_DEL_USUARIO','CORREO_DEL_ADMIN') on conflict(user_id) do nothing;
