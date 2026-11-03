import { NavLink, Outlet, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PanelLayout() {
  const { session, profile, loading, canAccessPanel, isAdmin, signOut } = useAuth()

  if (loading) return <div className="panel-loading">Cargando…</div>
  if (!session || !canAccessPanel) return <Navigate to="/ingresar" replace />

  const cls = ({ isActive }) => 'ptab' + (isActive ? ' active' : '')

  return (
    <div className="panel">
      <header className="panel-top">
        <div className="wrap panel-top-in">
          <Link to="/panel" className="panel-brand">
            COLONIAL <span>PANEL</span>
          </Link>
          <div className="panel-user">
            <span className="who">
              {profile.full_name || profile.email}
              <em>{isAdmin ? 'Administrador' : 'Vendedor'}</em>
            </span>
            <Link className="btn btn-secondary sm" to="/">Ver tienda</Link>
            <button className="btn btn-secondary sm" onClick={signOut}>Salir</button>
          </div>
        </div>
        <nav className="wrap ptabs">
          <NavLink end to="/panel" className={cls}>Productos</NavLink>
          <NavLink to="/panel/pedidos" className={cls}>Pedidos</NavLink>
          {isAdmin && <NavLink to="/panel/usuarios" className={cls}>Usuarios</NavLink>}
          {isAdmin && <NavLink to="/panel/ajustes" className={cls}>Ajustes</NavLink>}
        </nav>
      </header>
      <main className="wrap panel-main">
        <Outlet />
      </main>
    </div>
  )
}
