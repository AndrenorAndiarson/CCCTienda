import { useRef, useState } from 'react'
import TopLine from './components/TopLine.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Benefits from './components/Benefits.jsx'
import Categories from './components/Categories.jsx'
import Products from './components/Products.jsx'
import SellerBand from './components/SellerBand.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import useToast from './hooks/useToast.js'

export default function App() {
  const [cartCount, setCartCount] = useState(0)
  const [filter, setFilter] = useState('Todos')
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const toast = useToast()

  const addToCart = (name) => {
    setCartCount((n) => n + 1)
    toast.show(`${name} agregado al carrito (demo visual).`)
  }

  const focusSearch = () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' })
    searchRef.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <TopLine />
      <Header
        cartCount={cartCount}
        onSearchClick={focusSearch}
        onCartClick={() =>
          toast.show('Tu carrito está listo para probarse en la versión interactiva.')
        }
      />
      <main>
        <Hero />
        <Benefits />
        <Categories onSelect={setFilter} />
        <Products
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          searchRef={searchRef}
          onAdd={addToCart}
        />
        <SellerBand />
        <Contact />
      </main>
      <Footer />
      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}
