import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import { waLink, waNumber } from '../lib/utils'

const IMG = {
  hero1: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
  hero2: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=85',
  Hombres: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
  Mujeres: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  Niños: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
}
const CATS = [
  { name: 'Hombres', sub: 'Estilo para cada día' },
  { name: 'Mujeres', sub: 'Encuentra tu esencia' },
  { name: 'Niños', sub: 'Comodidad y color' },
]

const hideOnError = (e) => (e.currentTarget.style.display = 'none')

export default function Home() {
  const { settings, tiendas } = useData()
  const loc = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [q, setQ] = useState('')

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setFailed(true)
        else setProducts(data || [])
        setLoading(false)
      })
  }, [])

  // Navegación desde el pie de página u otras páginas
  useEffect(() => {
    const st = loc.state
    if (st?.filter) setFilter(st.filter)
    if (st?.scrollTo) setTimeout(() => document.getElementById(st.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [loc.state])

  useEffect(() => {
    const h = (e) => setFilter(e.detail)
    window.addEventListener('colonial-filter', h)
    return () => window.removeEventListener('colonial-filter', h)
  }, [])

  const chooseCategory = (c) => {
    setFilter(c)
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' })
  }

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return products.filter(
      (p) => (filter === 'Todos' || p.category === filter) && (!term || p.name.toLowerCase().includes(term))
    )
  }, [products, filter, q])

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Tu mercado de moda</div>
            <h1>Tu estilo,<br />tu lugar.</h1>
            <p>
              Descubre ropa y accesorios para toda la familia en un solo lugar. Explora las propuestas de nuestros
              comerciantes y encuentra algo hecho para ti.
            </p>
            <div className="btnrow">
              <a className="btn btn-primary" href="#tienda" onClick={(e) => { e.preventDefault(); chooseCategory('Todos') }}>
                EXPLORAR TIENDA <span>→</span>
              </a>
              <a className="btn btn-secondary" href="#categorias">Ver categorías</a>
            </div>
            <div className="hero-note"><span>✓</span> Compra fácil · Atención directa con vendedores</div>
          </div>
          <div className="hero-photos">
            <div className="photo photo-main">
              <img src={IMG.hero1} alt="Personas explorando prendas de moda" onError={hideOnError} />
              <div className="photo-label">Moda para cada estilo</div>
            </div>
            <div className="photo photo-side">
              <img src={IMG.hero2} alt="Selección de ropa contemporánea" onError={hideOnError} />
              <div className="photo-label">Encuentra tu look</div>
            </div>
          </div>
        </div>
      </section>

      <div className="benefits">
        <div className="wrap benefit-grid">
          <div className="benefit"><div className="benefit-icon">◇</div><div><strong>Variedad para todos</strong><small>Hombres, mujeres y niños</small></div></div>
          <div className="benefit"><div className="benefit-icon">♡</div><div><strong>Compra a tu manera</strong><small>Carrito o pedido por WhatsApp</small></div></div>
          <div className="benefit"><div className="benefit-icon">⌖</div><div><strong>Entrega coordinada</strong><small>Consulta con cada vendedor</small></div></div>
        </div>
      </div>

      <section id="categorias">
        <div className="wrap">
          <div className="section-head">
            <div><div className="section-kicker">Explora la colección</div><h2>Compra por categoría</h2></div>
            <a className="textlink" href="#tienda" onClick={(e) => { e.preventDefault(); chooseCategory('Todos') }}>Ver todos los productos →</a>
          </div>
          <div className="categories">
            {CATS.map((c) => (
              <a key={c.name} className="category" href="#tienda" onClick={(e) => { e.preventDefault(); chooseCategory(c.name) }}>
                <img src={IMG[c.name]} alt={`Moda para ${c.name.toLowerCase()}`} onError={hideOnError} />
                <div className="category-caption">
                  <div><strong>{c.name}</strong><small>{c.sub}</small></div>
                  <span className="roundarrow">↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section" id="tienda">
        <div className="wrap">
          <div className="section-head">
            <div><div className="section-kicker">Selección Colonial</div><h2>Descubre tus favoritos</h2></div>
            <a className="textlink" href="#contacto">¿Buscas algo especial? →</a>
          </div>
          <div className="toolbar">
            <div className="filters">
              {['Todos', 'Hombres', 'Mujeres', 'Niños'].map((c) => (
                <button key={c} className={'chip' + (filter === c ? ' active' : '')} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
            <input
              id="buscar"
              type="search"
              className="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="muted pad">Cargando productos…</p>
          ) : failed ? (
            <p className="muted pad">No pudimos cargar los productos. Revisa tu conexión e intenta de nuevo.</p>
          ) : shown.length === 0 ? (
            <p className="muted pad">No encontramos productos con esos criterios.</p>
          ) : (
            <div className="product-grid">
              {shown.map((p) => (
                <ProductCard key={p.id} product={p} seller={p.seller_id ? tiendas[p.seller_id] : null} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="seller-band" id="vendedores">
        <div className="wrap">
          <div className="seller-inner">
            <div>
              <h2>¿Eres comerciante de Colonial?</h2>
              <p>Forma parte de nuestro catálogo digital, presenta tus productos y gestiona tus pedidos desde tu propio acceso de vendedor.</p>
            </div>
            <a
              className="btn"
              href={waLink(settings.whatsapp, 'Hola, soy comerciante y quiero formar parte del catálogo digital de Centro Comercial Colonial.')}
              target="_blank"
              rel="noreferrer"
            >
              Conocer más <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <section id="contacto">
        <div className="wrap">
          <div className="section-head">
            <div><div className="section-kicker">Estamos para ayudarte</div><h2>Conecta con Colonial</h2></div>
          </div>
          <div className="contact-grid">
            <a className="contact-card" href={`mailto:${settings.email}`}>
              <div className="ci">✉</div><strong>Correo electrónico</strong><span>{settings.email}</span>
            </a>
            <a className="contact-card" href={waLink(settings.whatsapp, 'Hola, quiero hacer una consulta.')} target="_blank" rel="noreferrer">
              <div className="ci">◉</div><strong>WhatsApp</strong><span>{waNumber(settings.whatsapp).replace(/^591/, '')} · Consulta con nosotros</span>
            </a>
            <div className="contact-card">
              <div className="ci">⌖</div><strong>Visítanos</strong><span>{settings.address}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
