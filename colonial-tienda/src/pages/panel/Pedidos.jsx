import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatDate, money, waLink } from '../../lib/utils'

const STATUS = [
  ['nuevo', 'Nuevo'],
  ['confirmado', 'Confirmado'],
  ['entregado', 'Entregado'],
  ['cancelado', 'Cancelado'],
]

export default function Pedidos() {
  const { isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(150)
    if (err) setError(err.message)
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (itemId, status) => {
    setOrders((prev) =>
      prev.map((o) => ({ ...o, order_items: o.order_items.map((i) => (i.id === itemId ? { ...i, status } : i)) }))
    )
    const { error: err } = await supabase.from('order_items').update({ status }).eq('id', itemId)
    if (err) {
      setError(err.message)
      load()
    }
  }

  return (
    <>
      <div className="panel-bar">
        <div>
          <h2>Pedidos</h2>
          <p className="muted small">{isAdmin ? 'Todos los pedidos de la tienda.' : 'Pedidos que incluyen tus productos.'}</p>
        </div>
        <button className="btn btn-secondary" onClick={load}>↻ Actualizar</button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Cargando…</p>
      ) : orders.length === 0 ? (
        <p className="muted pad">Todavía no hay pedidos.</p>
      ) : (
        <div className="orders">
          {orders.map((o) => {
            const subtotal = o.order_items.reduce((a, i) => a + i.unit_price * i.quantity, 0)
            return (
              <article className="order" key={o.id}>
                <div className="order-head">
                  <strong>Pedido #{o.numero}</strong>
                  <span className="muted small">{formatDate(o.created_at)}</span>
                </div>
                <div className="order-cust">
                  <div><b>{o.customer_name}</b></div>
                  <a href={waLink(o.customer_phone, `Hola ${o.customer_name}, te escribimos por tu pedido #${o.numero} en Centro Comercial Colonial.`)} target="_blank" rel="noreferrer">
                    📱 {o.customer_phone}
                  </a>
                  {o.customer_address && <div className="muted small">📍 {o.customer_address}</div>}
                  {o.notes && <div className="muted small">📝 {o.notes}</div>}
                </div>
                <div className="order-items">
                  {o.order_items.map((i) => (
                    <div className="oi" key={i.id}>
                      <span>{i.quantity} × {i.product_name}</span>
                      <span>{money(i.unit_price * i.quantity)}</span>
                      <select className={'st st-' + i.status} value={i.status} onChange={(e) => setStatus(i.id, e.target.value)} aria-label="Estado">
                        {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  {isAdmin ? 'Total del pedido' : 'Tu parte'}: <strong>{money(isAdmin ? o.total : subtotal)}</strong>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
