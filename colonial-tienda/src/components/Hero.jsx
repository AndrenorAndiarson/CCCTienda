import SafeImage from './SafeImage.jsx'
import { HERO_IMAGES } from '../data/products.js'

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Tu mercado de moda</div>
          <h1>
            Tu estilo,
            <br />
            tu lugar.
          </h1>
          <p>
            Descubre ropa y accesorios para toda la familia en un solo lugar. Explora las
            propuestas de nuestros comerciantes y encuentra algo hecho para ti.
          </p>
          <div className="btnrow">
            <a className="btn btn-primary" href="#tienda">
              EXPLORAR TIENDA <span>→</span>
            </a>
            <a className="btn btn-secondary" href="#categorias">
              Ver categorías
            </a>
          </div>
          <div className="hero-note">
            <span>✓</span> Compra fácil · Atención directa con vendedores
          </div>
        </div>

        <div className="hero-photos">
          <div className="photo photo-main">
            <SafeImage src={HERO_IMAGES.main} alt="Personas explorando prendas de moda" />
            <div className="photo-label">Moda para cada estilo</div>
          </div>
          <div className="photo photo-side">
            <SafeImage src={HERO_IMAGES.side} alt="Selección de ropa contemporánea" />
            <div className="photo-label">Encuentra tu look</div>
          </div>
        </div>
      </div>
    </section>
  )
}
