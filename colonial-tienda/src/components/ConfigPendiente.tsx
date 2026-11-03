export function ConfigPendiente() {
  return (
    <main className="page-container" style={{ paddingBlock: 72 }}>
      <p style={{ color: "var(--color-accent)", fontWeight: 800, letterSpacing: ".12em" }}>
        CENTRO COMERCIAL COLONIAL
      </p>
      <h1 style={{ color: "var(--color-primary)", maxWidth: 680 }}>
        Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
      </h1>
      <p className="muted" style={{ maxWidth: 620, lineHeight: 1.8 }}>
        Copia el archivo .env.example como .env.local y agrega la URL del proyecto
        Supabase y su clave pública anon. Luego reinicia el servidor de desarrollo.
      </p>
    </main>
  );
}