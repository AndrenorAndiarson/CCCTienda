import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { settings } = useData()
  const loc = useLocation()
  const nav = useNavigate()

  const go = (id, filter) => (e) => {
    e.preventDefault()
    if (loc.pathname !== '/') nav('/', { state: { scrollTo: id, filter } })
    else {
      window.dispatchEvent(new CustomEvent('colonial-filter', { detail: filter || 'Todos' }))
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              CENTRO COMERCIAL COLONIAL<span>DESDE 1980</span>
            </div>
            <p className="footer-desc">
              Moda y accesorios para toda la familia. Un espacio para descubrir productos y conectar directamente con
              nuestros comerciantes.
            </p>
          </div>
          <div className="footer-col">
            <strong>Explora</strong>
            <a href="#tienda" onClick={go('tienda', 'Hombres')}>Hombres</a>
            <a href="#tienda" onClick={go('tienda', 'Mujeres')}>Mujeres</a>
            <a href="#tienda" onClick={go('tienda', 'Niños')}>Niños</a>
            <a href="#tienda" onClick={go('tienda', 'Todos')}>Todos los productos</a>
          </div>
          <div className="footer-col">
            <strong>Atención</strong>
            <a href="#contacto" onClick={go('contacto')}>Contacto</a>
            <a href="#vendedores" onClick={go('vendedores')}>Para comerciantes</a>
            <Link to="/ingresar">Acceso vendedores</Link>
            <p>{settings.address}</p>
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
