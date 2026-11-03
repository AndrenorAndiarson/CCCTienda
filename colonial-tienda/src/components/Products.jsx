import { useMemo } from 'react'
import ProductCard from './ProductCard.jsx'
import { FILTERS, PRODUCTS } from '../data/products.js'

export default function Products({ filter, onFilter, query, onQuery, searchRef, onAdd }) {
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter(
      (p) =>
        (filter === 'Todos' || p.category === filter) && p.name.toLowerCase().includes(q)
    )
  }, [filter, query])

  return (
    <section className="products-section" id="tienda">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-kicker">Selección Colonial</div>
            <h2>Descubre tus favoritos</h2>
          </div>
          <a className="textlink" href="#contacto">
            ¿Buscas algo especial? →
          </a>
        </div>

        <div className="shop-toolbar">
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`chip${filter === f ? ' active' : ''}`}
                onClick={() => onFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            ref={searchRef}
            className="search"
            type="search"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>

        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="empty">No encontramos productos con esos criterios.</p>
        )}

        <p className="disclaimer">
          Precios, productos e imágenes de esta vista previa son ilustrativos y se
          reemplazarán con datos reales.
        </p>
      </div>
    </section>
  )
}
