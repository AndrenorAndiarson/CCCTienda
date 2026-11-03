import { useCallback, useEffect, useState } from 'react'
import { supabase, createAuxClient } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const EMPTY = { full_name: '', email: '', password: '', role: 'vendedor', store_name: '', phone: '' }
const ROLE_LABEL = { admin: 'Administrador', vendedor: 'Vendedor', pendiente: 'Sin rol' }

export default function Usuarios() {
  const { profile: me } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [okMsg, setOkMsg] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const create = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setBusy(true)
    // 1) Crear el usuario (sin cerrar la sesión del administrador)
    const aux = createAuxClient()
    const { data, error: err } = await aux.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { full_name: form.full_name, store_name: form.store_name, phone: form.phone } },
    })
    if (err || !data.user) {
      setBusy(false)
      setError(err?.message || 'No se pudo crear el usuario.')
      return
    }
    if (data.user.identities && data.user.identities.length === 0) {
      setBusy(false)
      setError('Ese correo ya está registrado.')
      return
    }
    // 2) Asignar el rol
    const patch = {
      role: form.role,
      active: true,
      full_name: form.full_name || null,
      store_name: form.store_name || null,
      phone: form.phone || null,
    }
    let res = await supabase.from('profiles').update(patch).eq('id', data.user.id).select('id')
    if (!res.data?.length) {
      await new Promise((r) => setTimeout(r, 800))
      res = await supabase.from('profiles').update(patch).eq('id', data.user.id).select('id')
    }
    setBusy(false)
    if (res.error || !res.data?.length) {
      setError('El usuario se creó, pero no pude asignarle el rol. Cámbialo desde la lista.')
      load()
      return
    }
    setOkMsg(`Usuario ${form.email} creado como ${ROLE_LABEL[form.role].toLowerCase()}.`)
    setForm(null)
    load()
  }

  const update = async (id, patch) => {
    const { error: err } = await supabase.from('profiles').update(patch).eq('id', id)
    if (err) window.alert(err.message)
    load()
  }

  return (
    <>
      <div className="panel-bar">
        <div>
          <h2>Usuarios</h2>
          <p className="muted small">Crea cuentas para vendedores o más administradores.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(''); setOkMsg(''); setForm({ ...EMPTY }) }}>+ Nuevo usuario</button>
      </div>
      {okMsg && <p className="okmsg">{okMsg}</p>}

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="user-list">
          {rows.map((u) => (
            <div className={'user-row' + (u.active ? '' : ' off')} key={u.id}>
              <div className="user-main">
                <strong>{u.full_name || u.email}</strong>
                <span className="muted small">{u.email}</span>
                {u.store_name && <span className="muted small">Tienda: {u.store_name}</span>}
                {u.phone && <span className="muted small">📱 {u.phone}</span>}
              </div>
              <div className="user-actions">
                <select
                  value={u.role}
                  disabled={u.id === me.id}
                  onChange={(e) => update(u.id, { role: e.target.value })}
                  aria-label="Rol"
                >
                  <option value="admin">Administrador</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="pendiente">Sin rol</option>
                </select>
                <button
                  className={'btn sm ' + (u.active ? 'btn-secondary' : 'btn-primary')}
                  disabled={u.id === me.id}
                  onClick={() => update(u.id, { active: !u.active })}
                >
                  {u.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="modal-wrap" role="dialog" aria-modal="true">
          <div className="drawer-backdrop" onClick={() => setForm(null)} />
          <form className="modal" onSubmit={create}>
            <div className="drawer-head">
              <h2>Nuevo usuario</h2>
              <button type="button" className="iconbtn" onClick={() => setForm(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className="modal-body">
              <label>Nombre completo<input value={form.full_name} onChange={set('full_name')} required /></label>
              <label>Correo electrónico<input type="email" value={form.email} onChange={set('email')} required autoComplete="off" /></label>
              <label>Contraseña (mín. 6 caracteres)<input type="text" value={form.password} onChange={set('password')} required autoComplete="off" /></label>
              <label>Rol
                <select value={form.role} onChange={set('role')}>
                  <option value="vendedor">Vendedor (gestiona sus productos y pedidos)</option>
                  <option value="admin">Administrador (acceso total)</option>
                </select>
              </label>
              {form.role === 'vendedor' && (
                <>
                  <label>Nombre de la tienda / puesto<input value={form.store_name} onChange={set('store_name')} placeholder="Ej. Moda Andina" /></label>
                  <label>Celular<input value={form.phone} onChange={set('phone')} inputMode="tel" /></label>
                </>
              )}
              <p className="muted small">Entrégale al usuario su correo y contraseña; podrá entrar desde “Acceso vendedores”.</p>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="drawer-foot row">
              <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
              <button className="btn btn-primary" disabled={busy}>{busy ? 'CREANDO…' : 'CREAR USUARIO'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
