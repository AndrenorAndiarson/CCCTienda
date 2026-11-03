export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              CENTRO COMERCIAL COLONIAL<span>DESDE 1980</span>
            </div>
            <p className="footer-desc">
              Moda y accesorios para toda la familia. Un espacio para descubrir productos y
              conectar directamente con nuestros comerciantes.
            </p>
          </div>

          <div className="footer-col">
            <strong>Explora</strong>
            <a href="#categorias">Hombres</a>
            <a href="#categorias">Mujeres</a>
            <a href="#categorias">Niños</a>
            <a href="#tienda">Todos los productos</a>
          </div>

          <div className="footer-col">
            <strong>Atención</strong>
            <a href="#contacto">Contacto</a>
            <a href="#vendedores">Para comerciantes</a>
            <p>
              Calle Esteban Arce 1323
              <br />
              Cochabamba, Bolivia
            </p>
          </div>
        </div>

        <div className="copyright">
          <span>© Centro Comercial Colonial · Desde 1980</span>
          <span>Precios en bolivianos (Bs)</span>
        </div>
      </div>
    </footer>
  )
}
