import { useState } from 'react'
import SafeImage from './SafeImage.jsx'

export default function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="product">
      <div className="product-image">
        <SafeImage src={product.image} alt={product.name} />
        {product.tag && <span className="tag">{product.tag}</span>}
        <button
          className={`heart${liked ? ' active' : ''}`}
          aria-label="Guardar favorito"
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3>{product.name}</h3>
        <div className="price-row">
          <span className="price">Bs {product.price}</span>
          {product.oldPrice && <span className="oldprice">Bs {product.oldPrice}</span>}
        </div>
        <button className="addbtn" onClick={() => onAdd(product.name)}>
          AGREGAR AL CARRITO +
        </button>
      </div>
    </article>
  )
}
