import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { money } from '../lib/utils'

const FAV_KEY = 'colonial-favs-v1'
const loadFavs = () => {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
  } catch {
    return []
  }
}

export default function ProductCard({ product, seller }) {
  const { add } = useCart()
  const [fav, setFav] = useState(() => loadFavs().includes(product.id))

  const toggleFav = () => {
    const favs = loadFavs()
    const next = fav ? favs.filter((i) => i !== product.id) : [...favs, product.id]
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next))
    } catch {
      /* ignorar */
    }
    setFav(!fav)
  }

  return (
    <article className="product">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <div className="noimg">{product.name.slice(0, 1)}</div>
        )}
        {product.tag && <span className="tag">{product.tag}</span>}
        <button className="heart" aria-label="Guardar favorito" aria-pressed={fav} onClick={toggleFav}>
          {fav ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3>{product.name}</h3>
        {seller && <div className="seller-name">Vendido por {seller}</div>}
        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {product.old_price ? <span className="oldprice">{money(product.old_price)}</span> : null}
        </div>
        <button className="addbtn" onClick={() => add(product)}>
          AGREGAR AL CARRITO +
        </button>
      </div>
    </article>
  )
}
