import SafeImage from './SafeImage.jsx'
import { CATEGORY_CARDS } from '../data/products.js'

export default function Categories({ onSelect }) {
  return (
    <section id="categorias">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-kicker">Explora la colección</div>
            <h2>Compra por categoría</h2>
          </div>
          <a className="textlink" href="#tienda" onClick={() => onSelect('Todos')}>
            Ver todos los productos →
          </a>
        </div>

        <div className="categories">
          {CATEGORY_CARDS.map((c) => (
            <a
              className="category"
              href="#tienda"
              key={c.name}
              onClick={() => onSelect(c.name)}
            >
              <SafeImage src={c.image} alt={c.alt} />
              <div className="category-caption">
                <div>
                  <strong>{c.name}</strong>
                  <small>{c.subtitle}</small>
                </div>
                <span className="roundarrow">↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
