import { ArrowRight, Search, ShoppingCart, Truck, MessageCircle, Shirt } from "lucide-react";
import { tienda } from "../config/tienda";

const categories = [
  { name: "Hombres", note: "Estilo para cada día", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80" },
  { name: "Mujeres", note: "Encuentra tu esencia", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" },
  { name: "Niños", note: "Comodidad y color", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80" },
];

export function Inicio() {
  return (
    <>
      <div className="topline">MODA PARA TODA LA FAMILIA <span>·</span> {tienda.slogan.toUpperCase()}</div>
      <header className="site-header">
        <div className="page-container header-inner">
          <a className="brand" href="/" aria-label={`${tienda.nombre}, inicio`}>
            <strong>{tienda.nombre.toUpperCase()}</strong><small>{tienda.slogan.toUpperCase()}</small>
          </a>
          <nav aria-label="Navegación principal">
            <a href="/">Inicio</a><a href="/tienda">Tienda</a><a href="#categorias">Categorías</a>
            <a href="/nosotros">Nosotros</a><a href="/contacto">Contacto</a>
          </nav>
          <div className="header-actions">
            <Search size={19} aria-label="Buscar" />
            <a className="cart-link" href="/carrito"><ShoppingCart size={18} /> Carrito</a>
          </div>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="page-container hero-grid">
            <div>
              <span className="eyebrow">Tu mercado de moda</span>
              <h1>Tu estilo,<br />tu lugar.</h1>
              <p>Descubre ropa y accesorios para toda la familia. Explora las propuestas de nuestros comerciantes y encuentra algo hecho para ti.</p>
              <div className="hero-actions"><a className="primary-button" href="/tienda">EXPLORAR TIENDA <ArrowRight size={16} /></a><a className="secondary-button" href="#categorias">Ver categorías</a></div>
              <div className="hero-note"><span>✓</span> Compra fácil · Atención directa con vendedores</div>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Personas explorando prendas de moda" />
              <div className="image-label">{tienda.slogan} · Moda para cada estilo</div>
            </div>
          </div>
        </section>
        <section className="benefits">
          <div className="page-container benefits-grid">
            <div><Shirt /><span><strong>Variedad para todos</strong><small>Hombres, mujeres y niños</small></span></div>
            <div><MessageCircle /><span><strong>Compra a tu manera</strong><small>Carrito o pedido por WhatsApp</small></span></div>
            <div><Truck /><span><strong>Entrega coordinada</strong><small>Consulta con cada vendedor</small></span></div>
          </div>
        </section>
        <section id="categorias" className="page-container categories-section">
          <div className="section-heading"><div><small>EXPLORA LA COLECCIÓN</small><h2>Compra por categoría</h2></div><a href="/tienda">Ver todos los productos <ArrowRight size={15} /></a></div>
          <div className="category-grid">
            {categories.map((category) => (
              <a className="category-card" href={`/categoria/${category.name.toLowerCase()}`} key={category.name}>
                <img src={category.image} alt={`Moda para ${category.name.toLowerCase()}`} loading="lazy" />
                <span><strong>{category.name}</strong><small>{category.note}</small></span><b>↗</b>
              </a>
            ))}
          </div>
        </section>
        <section className="offers">
          <div className="page-container">
            <div className="section-heading"><div><small>SELECCIÓN COLONIAL</small><h2>Ofertas y tendencias</h2></div><a href="/tienda">Explorar tienda <ArrowRight size={15} /></a></div>
            <div className="placeholder-grid">
              <div><span>OFERTAS</span><h3>Precios especiales</h3><p>Pronto encontrarás promociones de nuestros comerciantes.</p></div>
              <div><span>TENDENCIAS</span><h3>Lo que se lleva</h3><p>Novedades y prendas destacadas en un solo lugar.</p></div>
              <div><span>PARA TI</span><h3>Descubre nuevos estilos</h3><p>Explora categorías y encuentra tus próximos favoritos.</p></div>
            </div>
          </div>
        </section>
        <section className="seller-cta"><div className="page-container"><div><h2>¿Eres comerciante de Colonial?</h2><p>Presenta tus productos y gestiona pedidos desde tu propio acceso de vendedor.</p></div><a className="yellow-button" href="/contacto">Conocer más <ArrowRight size={15} /></a></div></section>
      </main>
      <footer><div className="page-container footer-inner"><div><strong>{tienda.nombre.toUpperCase()}</strong><small>{tienda.slogan.toUpperCase()}</small></div><p>{tienda.direccion}<br />{tienda.email} · {tienda.whatsapp}</p><span>© {new Date().getFullYear()} {tienda.nombre}</span></div></footer>
    </>
  );
}