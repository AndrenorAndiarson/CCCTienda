import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useData } from '../../context/DataContext'

export default function Ajustes() {
  const { settings, reloadSettings } = useData()
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => setForm(settings), [settings])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')
    setBusy(true)
    const rows = ['whatsapp', 'email', 'address'].map((key) => ({ key, value: (form[key] || '').trim() }))
    const { error: err } = await supabase.from('site_settings').upsert(rows)
    setBusy(false)
    if (err) setError(err.message)
    else {
      setMsg('Cambios guardados.')
      reloadSettings()
    }
  }

  return (
    <>
      <div className="panel-bar">
        <div>
          <h2>Ajustes</h2>
          <p className="muted small">Datos de contacto que se muestran en la tienda.</p>
        </div>
      </div>
      <form className="settings-card" onSubmit={save}>
        <label>WhatsApp de la tienda (con código de país)
          <input value={form.whatsapp} onChange={set('whatsapp')} inputMode="tel" placeholder="59179363865" />
          <small className="muted">Aquí llegan los resúmenes de pedidos. Ejemplo Bolivia: 59179363865</small>
        </label>
        <label>Correo de contacto<input type="email" value={form.email} onChange={set('email')} /></label>
        <label>Dirección<input value={form.address} onChange={set('address')} /></label>
        {msg && <p className="okmsg">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'GUARDANDO…' : 'GUARDAR CAMBIOS'}</button>
      </form>
    </>
  )
}
