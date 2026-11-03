import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (!s) {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setProfile(data || null)
    setLoading(false)
  }, [])

  const userId = session?.user?.id
  useEffect(() => {
    if (userId) loadProfile(userId)
  }, [userId, loadProfile])

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()

  const isAdmin = profile?.role === 'admin' && profile?.active
  const isVendedor = profile?.role === 'vendedor' && profile?.active
  const canAccessPanel = isAdmin || isVendedor

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, signIn, signOut, isAdmin, isVendedor, canAccessPanel }}
    >
      {children}
    </AuthContext.Provider>
  )
}
