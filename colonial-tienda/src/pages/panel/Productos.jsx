import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { compressImage, money } from '../../lib/utils'

const EMPTY = {
  id: null,
  name: '',
  description: '',
  category: 'Hombres',
  price: '',
  old_price: '',
  tag: '',
  image_url: '',
  active: true,
  seller_id: '',
}

export default function Productos() {
  const { profile, isAdmin } = useAuth()
  const [rows, setRows] = useState([])
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    if (isAdmin) {
      supabase
        .from('profiles')
        .select('id,full_name,store_name,email')
        .eq('role', 'vendedor')
        .then(({ data }) => setSellers(data || []))
    }
  }, [load, isAdmin])

  const sellerName = (id) => {
    if (!id) return 'Tienda Colonial'
    const s = sellers.find((x) => x.id === id)
    return s ? s.store_name || s.full_name || s.email : id === profile.id ? 'Yo' : 'Vendedor'
  }

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const blob = await compressImage(file)
    const path = `${profile.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error: err } = await supabase.storage.from('productos').upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: '31536000',
    })
    setUploading(false)
    e.target.value = ''
    if (err) {
      setError('No se pudo subir la imagen: ' + err.message)
      return
    }
    const { data } = supabase.storage.from('productos').getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    const price = Number(form.price)
    if (!form.name.trim() || !(price >= 0) || form.price === '') {
      setError('Escribe el nombre y el precio del producto.')
      return
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category,
      price,
      old_price: form.old_price === '' ? null : Number(form.old_price),
      tag: form.tag || null,
      image_url: form.image_url || null,
      active: form.active,
      seller_id: isAdmin ? form.seller_id || null : profile.id,
    }
    setBusy(true)
    const { error: err } = form.id
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert(payload)
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setForm(null)
    load()
  }

  const toggle = async (p) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  const del = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    const { error: err } = await supabase.from('products').delete().eq('id', p.id)
    if (err) window.alert(err.message)
    load()
  }

  const edit = (p) =>
    setForm({
      ...EMPTY,
      ...p,
      description: p.description || '',
      price: p.price,
      old_price: p.old_price ?? '',
      tag: p.tag || '',
      image_url: p.image_url || '',
      seller_id: p.seller_id || '',
    })

  return (
    <>
      <div className="panel-bar">
        <div>
          <h2>Productos</h2>
          <p className="muted small">{isAdmin ? 'Todos los productos de la tienda.' : 'Tus productos publicados.'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(''); setForm({ ...EMPTY }) }}>+ Nuevo producto</button>
      </div>

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="muted pad">Aún no hay productos. Crea el primero con “Nuevo producto”.</p>
      ) : (
        <div className="prod-list">
          {rows.map((p) => (
            <div className={'prod-row' + (p.active ? '' : ' off')} key={p.id}>
              <div className="prod-thumb">{p.image_url ? <img src={p.image_url} alt="" onError={(e) => (e.currentTarget.style.display = "none")} /> : <span>{p.name.slice(0, 1)}</span>}</div>
              <div className="prod-main">
                <strong>{p.name}</strong>
                <span className="muted small">
                  {p.category} · {money(p.price)}
                  {p.old_price ? ` (antes ${money(p.old_price)})` : ''}
                  {p.tag ? ` · ${p.tag}` : ''}
                </span>
                {isAdmin && <span className="muted small">Vendedor: {sellerName(p.seller_id)}</span>}
                {!p.active && <span className="badge gray">Oculto</span>}
              </div>
              <div className="prod-actions">
                <button className="btn btn-secondary sm" onClick={() => edit(p)}>Editar</button>
                <button className="btn btn-secondary sm" onClick={() => toggle(p)}>{p.active ? 'Ocultar' : 'Mostrar'}</button>
                <button className="btn btn-danger sm" onClick={() => del(p)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="modal-wrap" role="dialog" aria-modal="true">
          <div className="drawer-backdrop" onClick={() => setForm(null)} />
          <form className="modal" onSubmit={save}>
            <div className="drawer-head">
              <h2>{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button type="button" className="iconbtn" onClick={() => setForm(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className="modal-body">
              <label>Nombre *<input value={form.name} onChange={set('name')} required /></label>
              <label>Descripción<textarea rows={3} value={form.description} onChange={set('description')} /></label>
              <div className="grid2">
                <label>Categoría
                  <select value={form.category} onChange={set('category')}>
                    <option>Hombres</option><option>Mujeres</option><option>Niños</option>
                  </select>
                </label>
                <label>Etiqueta
                  <select value={form.tag} onChange={set('tag')}>
                    <option value="">Ninguna</option><option>Nuevo</option><option>Popular</option><option>Oferta</option>
                  </select>
                </label>
                <label>Precio (Bs) *<input type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={set('price')} required /></label>
                <label>Precio anterior (Bs)<input type="number" min="0" step="0.01" inputMode="decimal" value={form.old_price} onChange={set('old_price')} placeholder="Opcional" /></label>
              </div>
              {isAdmin && (
                <label>Vendedor
                  <select value={form.seller_id} onChange={set('seller_id')}>
                    <option value="">Tienda Colonial (sin vendedor)</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>{s.store_name || s.full_name || s.email}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="imgfield">
                <span className="lbl">Imagen</span>
                <div className="imgrow">
                  <div className="prod-thumb big">{form.image_url ? <img src={form.image_url} alt="" /> : <span>📷</span>}</div>
                  <div>
                    <label className="btn btn-secondary sm filebtn">
                      {uploading ? 'Subiendo…' : form.image_url ? 'Cambiar imagen' : 'Subir imagen'}
                      <input type="file" accept="image/*" onChange={upload} hidden disabled={uploading} />
                    </label>
                    {form.image_url && (
                      <button type="button" className="linkbtn" onClick={() => setForm((f) => ({ ...f, image_url: '' }))}>Quitar</button>
                    )}
                  </div>
                </div>
              </div>
              <label className="check"><input type="checkbox" checked={form.active} onChange={set('active')} /> Visible en la tienda</label>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="drawer-foot row">
              <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
              <button className="btn btn-primary" disabled={busy || uploading}>{busy ? 'GUARDANDO…' : 'GUARDAR'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
