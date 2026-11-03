import { Routes, Route, Navigate } from 'react-router-dom'
import { configured } from './lib/supabase'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import PanelLayout from './pages/panel/PanelLayout'
import Productos from './pages/panel/Productos'
import Pedidos from './pages/panel/Pedidos'
import Usuarios from './pages/panel/Usuarios'
import Ajustes from './pages/panel/Ajustes'

function SetupNotice() {
  return (
    <div className="setup-notice">
      <div className="setup-card">
        <h1>Falta conectar Supabase</h1>
        <p>
          La tienda está instalada, pero todavía no tiene las dos variables de conexión.
        </p>
        <ol>
          <li>En Vercel entra a <b>Settings → Environment Variables</b>.</li>
          <li>Agrega <code>VITE_SUPABASE_URL</code> con la <b>Project URL</b> de tu proyecto.</li>
          <li>Agrega <code>VITE_SUPABASE_ANON_KEY</code> con la clave pública (<b>anon / publishable</b>).</li>
          <li>Haz un <b>Redeploy</b>.</li>
        </ol>
        <p className="muted">(En tu computadora: copia <code>.env.example</code> como <code>.env</code> y llena los dos valores.)</p>
      </div>
    </div>
  )
}

export default function App() {
  if (!configured) return <SetupNotice />
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/ingresar" element={<Layout><Login /></Layout>} />
      <Route path="/panel" element={<PanelLayout />}>
        <Route index element={<Productos />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="ajustes" element={<Ajustes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
