import { CONTACT } from '../data/products.js'

const CARDS = [
  { icon: '✉', title: 'Correo electrónico', text: CONTACT.email },
  { icon: '◉', title: 'WhatsApp', text: `${CONTACT.whatsapp} · Consulta con nosotros` },
  { icon: '⌖', title: 'Visítanos', text: CONTACT.address },
]

export default function Contact() {
  return (
    <section id="contacto">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-kicker">Estamos para ayudarte</div>
            <h2>Conecta con Colonial</h2>
          </div>
        </div>

        <div className="contact-grid">
          {CARDS.map((c) => (
            <div className="contact-card" key={c.title}>
              <div className="contact-icon">{c.icon}</div>
              <strong>{c.title}</strong>
              <span className="contact-text">{c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
