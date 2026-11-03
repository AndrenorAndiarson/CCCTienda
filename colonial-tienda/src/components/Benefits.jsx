const BENEFITS = [
  { icon: '◇', title: 'Variedad para todos', text: 'Hombres, mujeres y niños' },
  { icon: '♡', title: 'Compra a tu manera', text: 'Carrito o pedido por WhatsApp' },
  { icon: '⌖', title: 'Entrega coordinada', text: 'Consulta con cada vendedor' },
]

export default function Benefits() {
  return (
    <div className="benefits">
      <div className="wrap benefit-grid">
        {BENEFITS.map((b) => (
          <div className="benefit" key={b.title}>
            <div className="benefit-icon">{b.icon}</div>
            <div>
              <strong>{b.title}</strong>
              <small>{b.text}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
