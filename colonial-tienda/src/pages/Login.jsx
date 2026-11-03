import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signOut, session, profile, loading, canAccessPanel } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && session && canAccessPanel) return <Navigate to="/panel" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signIn(email.trim(), password)
    setBusy(false)
    if (err) setError('Correo o contraseña incorrectos.')
  }

  return (
    <section className="login-section">
      <div className="login-card">
        <div className="section-kicker">Acceso para equipo y vendedores</div>
        <h2>Ingresar al panel</h2>

        {session && !loading && !canAccessPanel ? (
          <>
            <p className="error">
              {profile && !profile.active
                ? 'Tu cuenta está desactivada. Comunícate con la administración.'
                : 'Tu cuenta todavía no tiene permisos. Pide a la administración que te asigne un rol.'}
            </p>
            <button className="btn btn-secondary full" onClick={signOut}>Cerrar sesión</button>
          </>
        ) : (
          <form onSubmit={submit}>
            <label>Correo electrónico
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </label>
            <label>Contraseña
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full" disabled={busy}>{busy ? 'INGRESANDO…' : 'INGRESAR'}</button>
          </form>
        )}
        <p className="center-text small"><Link to="/">← Volver a la tienda</Link></p>
      </div>
    </section>
  )
}
