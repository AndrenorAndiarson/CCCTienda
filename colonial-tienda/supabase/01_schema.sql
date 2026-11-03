-- =====================================================================
--  CENTRO COMERCIAL COLONIAL  -  BASE DE DATOS COMPLETA
--  Pega TODO este archivo en Supabase > SQL Editor > New query > Run.
--  Se ejecuta UNA sola vez. Si lo ejecutas de nuevo no pasa nada malo.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. PERFILES (una fila por cada usuario que puede entrar al panel)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  store_name  text,
  role        text not null default 'pendiente'
              check (role in ('admin', 'vendedor', 'pendiente')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Cada vez que se crea un usuario en Authentication, se crea su perfil
-- (siempre como "pendiente"; el administrador le da el rol desde el panel).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, store_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'store_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Funciones de ayuda para los permisos
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active
  );
$$;

create or replace function public.is_vendedor()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'vendedor' and active
  );
$$;

-- ---------------------------------------------------------------------
-- 2. AJUSTES DE LA TIENDA (WhatsApp, correo, dirección)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  key    text primary key,
  value  text not null default ''
);

insert into public.site_settings (key, value) values
  ('whatsapp', '59179363865'),
  ('email',    'letmedieforever@gmail.com'),
  ('address',  'Calle Esteban Arce 1323, Cochabamba')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- 3. PRODUCTOS
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid references public.profiles(id) on delete set null,
  name         text not null,
  description  text,
  category     text not null check (category in ('Hombres', 'Mujeres', 'Niños')),
  price        numeric(10,2) not null check (price >= 0),
  old_price    numeric(10,2) check (old_price is null or old_price >= 0),
  tag          text check (tag is null or tag in ('Nuevo', 'Popular', 'Oferta')),
  image_url    text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_seller_idx   on public.products (seller_id);

-- Lista pública de tiendas/vendedores (solo el nombre, nada privado)
create or replace view public.tiendas as
  select id, coalesce(nullif(store_name, ''), full_name) as nombre
  from public.profiles
  where role = 'vendedor' and active;

-- ---------------------------------------------------------------------
-- 4. PEDIDOS
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  numero            bigint generated always as identity,
  customer_name     text not null,
  customer_phone    text not null,
  customer_address  text,
  notes             text,
  total             numeric(10,2) not null default 0,
  created_at        timestamptz not null default now()
);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  seller_id     uuid references public.profiles(id) on delete set null,
  product_name  text not null,
  unit_price    numeric(10,2) not null,
  quantity      integer not null check (quantity > 0),
  status        text not null default 'nuevo'
                check (status in ('nuevo', 'confirmado', 'entregado', 'cancelado'))
);
create index if not exists order_items_order_idx  on public.order_items (order_id);
create index if not exists order_items_seller_idx on public.order_items (seller_id);

-- El cliente crea el pedido con esta función (los precios los toma de la
-- base de datos, así nadie puede cambiarlos desde el navegador).
create or replace function public.crear_pedido(
  p_name    text,
  p_phone   text,
  p_address text,
  p_notes   text,
  p_items   jsonb
)
returns table (out_numero bigint, out_total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order  uuid;
  v_num    bigint;
  v_total  numeric := 0;
  v_item   jsonb;
  v_prod   public.products%rowtype;
  v_qty    integer;
begin
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_phone), '') = '' then
    raise exception 'Nombre y teléfono son obligatorios';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío';
  end if;

  insert into public.orders (customer_name, customer_phone, customer_address, notes)
  values (
    trim(p_name),
    trim(p_phone),
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_notes, '')), '')
  )
  returning id, numero into v_order, v_num;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := greatest(1, least(coalesce((v_item ->> 'quantity')::integer, 1), 99));

    select * into v_prod
    from public.products
    where id = (v_item ->> 'product_id')::uuid and active;

    if not found then
      raise exception 'Uno de los productos ya no está disponible';
    end if;

    insert into public.order_items (order_id, product_id, seller_id, product_name, unit_price, quantity)
    values (v_order, v_prod.id, v_prod.seller_id, v_prod.name, v_prod.price, v_qty);

    v_total := v_total + v_prod.price * v_qty;
  end loop;

  update public.orders set total = v_total where id = v_order;

  return query select v_num, v_total;
end;
$$;

grant execute on function public.crear_pedido(text, text, text, text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. PERMISOS (quién puede ver y cambiar qué)
-- ---------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.site_settings  enable row level security;
alter table public.products       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

grant select on public.tiendas to anon, authenticated;

-- profiles: cada uno ve el suyo; el administrador ve y cambia todos
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- site_settings: todos leen, solo el administrador cambia
drop policy if exists settings_select on public.site_settings;
create policy settings_select on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products: el público ve los activos; cada vendedor gestiona los suyos;
-- el administrador gestiona todos
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select to anon, authenticated
  using (active or public.is_admin() or seller_id = auth.uid());

drop policy if exists products_insert on public.products;
create policy products_insert on public.products
  for insert to authenticated
  with check (public.is_admin() or (public.is_vendedor() and seller_id = auth.uid()));

drop policy if exists products_update on public.products;
create policy products_update on public.products
  for update to authenticated
  using (public.is_admin() or (public.is_vendedor() and seller_id = auth.uid()))
  with check (public.is_admin() or (public.is_vendedor() and seller_id = auth.uid()));

drop policy if exists products_delete on public.products;
create policy products_delete on public.products
  for delete to authenticated
  using (public.is_admin() or (public.is_vendedor() and seller_id = auth.uid()));

-- orders / order_items: el administrador ve todo; cada vendedor ve solo
-- los pedidos que incluyen sus productos
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.order_items oi
      where oi.order_id = orders.id and oi.seller_id = auth.uid()
    )
  );

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select to authenticated
  using (public.is_admin() or seller_id = auth.uid());

drop policy if exists order_items_update on public.order_items;
create policy order_items_update on public.order_items
  for update to authenticated
  using (public.is_admin() or seller_id = auth.uid())
  with check (public.is_admin() or seller_id = auth.uid());

-- Los vendedores solo pueden cambiar el estado de un pedido, nada más
revoke update on public.order_items from authenticated;
grant  update (status) on public.order_items to authenticated;

-- ---------------------------------------------------------------------
-- 6. ALMACÉN DE IMÁGENES (bucket público "productos")
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

drop policy if exists productos_public_read on storage.objects;
create policy productos_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'productos');

drop policy if exists productos_staff_insert on storage.objects;
create policy productos_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos' and (public.is_admin() or public.is_vendedor()));

drop policy if exists productos_staff_update on storage.objects;
create policy productos_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'productos' and (public.is_admin() or public.is_vendedor()));

drop policy if exists productos_staff_delete on storage.objects;
create policy productos_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos' and (public.is_admin() or public.is_vendedor()));

-- ---------------------------------------------------------------------
-- 7. PRODUCTOS DE EJEMPLO (solo si la tienda está vacía)
--    Los puedes borrar o editar luego desde el panel.
-- ---------------------------------------------------------------------
insert into public.products (name, category, price, old_price, tag, image_url)
select * from (values
  ('Camisa casual azul', 'Hombres', 125::numeric, null::numeric, 'Nuevo',
     'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'),
  ('Blusa urbana',       'Mujeres', 89::numeric,  null::numeric, 'Popular',
     'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=80'),
  ('Pantalón denim',     'Hombres', 180::numeric, 210::numeric,  null,
     'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'),
  ('Conjunto infantil',  'Niños',   110::numeric, 135::numeric,  'Oferta',
     'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80')
) as demo(name, category, price, old_price, tag, image_url)
where not exists (select 1 from public.products);
