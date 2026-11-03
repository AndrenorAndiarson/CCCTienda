import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { money, waLink } from '../lib/utils'

const EMPTY = { name: '', phone: '', address: '', notes: '' }

export default function CartDrawer() {
  const { items, total, count, open, setOpen, setQty, remove, clear } = useCart()
  const { settings } = useData()
  const [step, setStep] = useState('cart') // cart | form | done
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  if (!open) return null

  const close = () => {
    setOpen(false)
    if (step === 'done') {
      setStep('cart')
      setDone(null)
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Escribe tu nombre y tu número de celular.')
      return
    }
    setBusy(true)
    const { data, error: err } = await supabase.rpc('crear_pedido', {
      p_name: form.name,
      p_phone: form.phone,
      p_address: form.address,
      p_notes: form.notes,
      p_items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
    })
    setBusy(false)
    if (err) {
      setError(err.message || 'No se pudo enviar el pedido. Intenta de nuevo.')
      return
    }
    const row = Array.isArray(data) ? data[0] : data
    const lines = items.map((i) => `• ${i.qty} x ${i.name} — ${money(i.price * i.qty)}`).join('\n')
    const text =
      `Hola Colonial, hice el pedido #${row.out_numero}:\n\n${lines}\n\nTotal: ${money(row.out_total)}\n\n` +
      `Nombre: ${form.name}\nCelular: ${form.phone}` +
      (form.address ? `\nDirección: ${form.address}` : '') +
      (form.notes ? `\nNota: ${form.notes}` : '')
    setDone({ numero: row.out_numero, total: row.out_total, link: waLink(settings.whatsapp, text) })
    clear()
    setForm(EMPTY)
    setStep('done')
  }

  return (
    <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="drawer-backdrop" onClick={close} />
      <aside className="drawer">
        <div className="drawer-head">
          <h2>
            {step === 'done' ? '¡Pedido recibido!' : step === 'form' ? 'Tus datos' : `Tu carrito (${count})`}
          </h2>
          <button className="iconbtn" onClick={close} aria-label="Cerrar">✕</button>
        </div>

        {step === 'cart' && (
          <>
            <div className="drawer-body">
              {items.length === 0 ? (
                <p className="muted center-text">Tu carrito está vacío.<br />Agrega productos desde la tienda.</p>
              ) : (
                items.map((i) => (
                  <div className="cart-row" key={i.id}>
                    <div className="cart-thumb">
                      {i.image_url ? <img src={i.image_url} alt="" /> : <span>{i.name.slice(0, 1)}</span>}
                    </div>
                    <div className="cart-info">
                      <strong>{i.name}</strong>
                      <span className="muted">{money(i.price)}</span>
                      <div className="qty">
                        <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Quitar uno">−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Agregar uno">+</button>
                        <button className="linkbtn" onClick={() => remove(i.id)}>Eliminar</button>
                      </div>
                    </div>
                    <div className="cart-sub">{money(i.price * i.qty)}</div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="drawer-foot">
                <div className="total-row"><span>Total</span><strong>{money(total)}</strong></div>
                <button className="btn btn-primary full" onClick={() => setStep('form')}>CONTINUAR →</button>
              </div>
            )}
          </>
        )}

        {step === 'form' && (
          <form onSubmit={submit} className="drawer-form">
            <div className="drawer-body">
              <label>Nombre completo *<input value={form.name} onChange={set('name')} autoComplete="name" required /></label>
              <label>Celular / WhatsApp *<input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" required /></label>
              <label>Dirección o zona de entrega<input value={form.address} onChange={set('address')} autoComplete="street-address" /></label>
              <label>Nota para el vendedor<textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="Talla, color, horario…" /></label>
              <p className="muted small">Total del pedido: <strong>{money(total)}</strong>. El pago y la entrega se coordinan directamente con el vendedor.</p>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="drawer-foot">
              <button className="btn btn-primary full" disabled={busy}>{busy ? 'ENVIANDO…' : 'CONFIRMAR PEDIDO'}</button>
              <button type="button" className="btn btn-secondary full" onClick={() => setStep('cart')}>← Volver al carrito</button>
            </div>
          </form>
        )}

        {step === 'done' && done && (
          <>
            <div className="drawer-body center-text">
              <div className="done-ico">✓</div>
              <h3>Pedido #{done.numero}</h3>
              <p className="muted">Total: <strong>{money(done.total)}</strong></p>
              <p className="muted">Tu pedido quedó registrado. Para agilizar la atención, envíanos el resumen por WhatsApp.</p>
            </div>
            <div className="drawer-foot">
              <a className="btn btn-wa full" href={done.link} target="_blank" rel="noreferrer">ENVIAR POR WHATSAPP</a>
              <button className="btn btn-secondary full" onClick={close}>Seguir comprando</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
