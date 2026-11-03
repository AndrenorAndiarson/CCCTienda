import { useState } from 'react'

// Si la imagen falla al cargar, no se muestra (igual que el onerror del HTML original).
export default function SafeImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}
