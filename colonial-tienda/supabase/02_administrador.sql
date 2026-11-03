-- =====================================================================
--  DEJAR AL USUARIO COMO ADMINISTRADOR
--  Antes de ejecutar:
--    1) Crea tu usuario en Supabase > Authentication > Users > Add user
--       (con tu correo y tu contraseña, marcando "Auto Confirm User").
--    2) Cambia el correo de la línea de abajo por ESE MISMO correo.
--    3) Pega todo en SQL Editor > Run.
-- =====================================================================

do $$
declare
  v_email text := 'letmedieforever@gmail.com';   -- <<< CAMBIA SOLO ESTO
  n integer;
begin
  insert into public.profiles (id, email, full_name, role, active)
  select id, email, 'Administrador', 'admin', true
  from auth.users
  where lower(email) = lower(v_email)
  on conflict (id) do update set role = 'admin', active = true;

  get diagnostics n = row_count;

  if n = 0 then
    raise exception 'No encontré el correo % en Authentication > Users. Créalo primero y vuelve a ejecutar.', v_email;
  end if;
end;
$$;
