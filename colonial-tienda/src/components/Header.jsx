import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()

  // Enlaces a secciones de la página de inicio (funcionan también desde otras páginas)
  const go = (id) => (e) => {
    e.preventDefault()
    setMenu(false)
    if (loc.pathname !== '/') nav('/', { state: { scrollTo: id } })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="topline">
        MODA PARA TODA LA FAMILIA <b>·</b> CENTRO COMERCIAL COLONIAL <b>·</b> DESDE 1980
      </div>
      <header className="site-header">
        <div className="wrap head">
          <Link className="brand" to="/" aria-label="Centro Comercial Colonial, inicio">
            <div className="brand-name">
              CENTRO COMERCIAL
              <br />
              COLONIAL
            </div>
            <div className="brand-tag">DESDE 1980</div>
          </Link>
          <nav className="nav" aria-label="Navegación principal">
            <a href="#categorias" onClick={go('categorias')}>Categorías</a>
            <a href="#tienda" onClick={go('tienda')}>Tienda</a>
            <a href="#vendedores" onClick={go('vendedores')}>Vendedores</a>
            <a href="#contacto" onClick={go('contacto')}>Contacto</a>
          </nav>
          <div className="head-actions">
            <button className="cartbtn" onClick={() => setOpen(true)} aria-label="Abrir carrito">
              <span className="cart-label">Carrito</span>
              <svg className="cart-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6"/></svg>
              <span className="cart-count">{count}</span>
            </button>
            <button className="iconbtn menubtn" onClick={() => setMenu((m) => !m)} aria-label="Menú" aria-expanded={menu}>
              {menu ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {menu && (
          <div className="mobile-menu">
            <a href="#categorias" onClick={go('categorias')}>Categorías</a>
            <a href="#tienda" onClick={go('tienda')}>Tienda</a>
            <a href="#vendedores" onClick={go('vendedores')}>Vendedores</a>
            <a href="#contacto" onClick={go('contacto')}>Contacto</a>
            <Link to="/ingresar" onClick={() => setMenu(false)}>Acceso vendedores</Link>
          </div>
        )}
      </header>
    </>
  )
}
