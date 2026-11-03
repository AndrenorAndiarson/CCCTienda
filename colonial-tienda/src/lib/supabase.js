import { createClient } from '@supabase/supabase-js'

// Las dos únicas variables de conexión. Se leen del archivo .env
// (o de las "Environment Variables" de Vercel). No se escriben en el código.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured = Boolean(url && key)

export const supabase = configured ? createClient(url, key) : null

// Cliente auxiliar que NO guarda sesión. Sirve para que el administrador
// cree usuarios nuevos sin que se cierre su propia sesión.
export function createAuxClient() {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'colonial-aux-auth',
    },
  })
}
