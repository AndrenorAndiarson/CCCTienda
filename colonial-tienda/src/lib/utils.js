export function money(n) {
  const v = Number(n || 0)
  return 'Bs ' + (Number.isInteger(v) ? v : v.toFixed(2))
}

export function onlyDigits(s) {
  return String(s || '').replace(/\D/g, '')
}

// Si el número tiene 8 dígitos (Bolivia) le agrega el 591
export function waNumber(s) {
  const d = onlyDigits(s)
  return d.length === 8 ? '591' + d : d
}

export function waLink(number, text) {
  return `https://wa.me/${waNumber(number)}?text=${encodeURIComponent(text || '')}`
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

// Reduce las fotos del celular (que pesan varios MB) antes de subirlas
export async function compressImage(file, maxSide = 1200, quality = 0.82) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
    const w = Math.round(bmp.width * scale)
    const h = Math.round(bmp.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(bmp, 0, 0, w, h)
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality))
    return blob || file
  } catch {
    return file
  }
}
