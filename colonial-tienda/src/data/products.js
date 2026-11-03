const img = (id, w, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const FILTERS = ['Todos', 'Hombres', 'Mujeres', 'Niños']

export const CATEGORY_CARDS = [
  {
    name: 'Hombres',
    subtitle: 'Estilo para cada día',
    alt: 'Moda para hombres',
    image: img('1516257984-b1b4d707412e', 800),
  },
  {
    name: 'Mujeres',
    subtitle: 'Encuentra tu esencia',
    alt: 'Moda para mujeres',
    image: img('1483985988355-763728e1935b', 800),
  },
  {
    name: 'Niños',
    subtitle: 'Comodidad y color',
    alt: 'Moda infantil',
    image: img('1519238263530-99bdd11df2ea', 800),
  },
]

// Datos ilustrativos: reemplazar por una API / base de datos real.
export const PRODUCTS = [
  {
    id: 1,
    name: 'Camisa casual azul',
    category: 'Hombres',
    price: 125,
    tag: 'Nuevo',
    image: img('1596755094514-f87e34085b2c', 600),
  },
  {
    id: 2,
    name: 'Blusa urbana',
    category: 'Mujeres',
    price: 89,
    tag: 'Popular',
    image: img('1551163943-3f6a855d1153', 600),
  },
  {
    id: 3,
    name: 'Pantalón denim',
    category: 'Hombres',
    price: 180,
    oldPrice: 210,
    image: img('1542272604-787c3835535d', 600),
  },
  {
    id: 4,
    name: 'Conjunto infantil',
    category: 'Niños',
    price: 110,
    oldPrice: 135,
    tag: 'Oferta',
    image: img('1519238263530-99bdd11df2ea', 600),
  },
]

export const HERO_IMAGES = {
  main: img('1483985988355-763728e1935b', 900, 85),
  side: img('1485968579580-b6d095142e6e', 700, 85),
}

export const CONTACT = {
  email: 'letmedieforever@gmail.com',
  whatsapp: '79363865',
  address: 'Calle Esteban Arce 1323, Cochabamba',
}
