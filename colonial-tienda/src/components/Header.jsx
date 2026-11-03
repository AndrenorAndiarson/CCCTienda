export default function Header({ cartCount, onSearchClick, onCartClick }) {
  return (
    <header>
      <div className="wrap head">
        <a className="brand" href="#" aria-label="Centro Comercial Colonial, inicio">
          <div className="brand-name">
            CENTRO COMERCIAL
            <br />
            COLONIAL
          </div>
          <div className="brand-tag">DESDE 1980</div>
        </a>

        <nav className="nav" aria-label="Navegación principal">
          <a href="#categorias">Categorías</a>
          <a href="#tienda">Tienda</a>
          <a href="#vendedores">Vendedores</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="head-actions">
          <button className="iconbtn" aria-label="Buscar" onClick={onSearchClick}>
            ⌕
          </button>
          <button className="cartbtn" onClick={onCartClick}>
            Carrito <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
