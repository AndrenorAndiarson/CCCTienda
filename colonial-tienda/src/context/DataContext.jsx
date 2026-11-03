import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

const DEFAULTS = {
  whatsapp: '59179363865',
  email: 'letmedieforever@gmail.com',
  address: 'Calle Esteban Arce 1323, Cochabamba',
}

export function DataProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [tiendas, setTiendas] = useState({})

  const reloadSettings = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase.from('site_settings').select('key,value')
    if (data?.length) {
      const next = { ...DEFAULTS }
      data.forEach((r) => (next[r.key] = r.value))
      setSettings(next)
    }
  }, [])

  useEffect(() => {
    reloadSettings()
    if (!supabase) return
    supabase
      .from('tiendas')
      .select('id,nombre')
      .then(({ data }) => {
        const map = {}
        ;(data || []).forEach((t) => (map[t.id] = t.nombre))
        setTiendas(map)
      })
  }, [reloadSettings])

  return (
    <DataContext.Provider value={{ settings, tiendas, reloadSettings }}>
      {children}
    </DataContext.Provider>
  )
}
