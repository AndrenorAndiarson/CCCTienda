import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import { useCart } from '../context/CartContext'

export default function Layout({ children }) {
  const { toast } = useCart()
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">{toast}</div>
    </>
  )
}
